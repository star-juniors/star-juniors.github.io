// EIC smart search — integrates with the existing #siteSearch widget.
//
// Activates when siteSearchConfig.smartSearchUrl is set. Owns all input and
// panel rendering from that point onward, so the Lunr init in site.js must
// step aside. See site.js -> initSearch() for the hand-off.
//
// Behavior:
//   - Typing (debounced) fires POST /query with generate_answer=false.
//     Panel shows the 5 source cards only. No LLM cost.
//   - Longer idle (~1 s since last keystroke) fires a speculative full
//     POST /query with generate_answer=true in the background and caches
//     the result by query string. Aborted as soon as the user types more.
//   - Enter or arrow button: if the current query is cached, render the
//     speculative result instantly. Otherwise (or if still in-flight) show
//     the spinner, awaiting either the existing speculative promise or a
//     fresh call.
//   - Esc or outside click closes the panel.
//
// Exposed as window.eicSmartSearch.init(config) for site.js to invoke.

(function () {
  "use strict";

  const MARKED_URL = "https://esm.sh/marked@14";
  const DOMPURIFY_URL = "https://esm.sh/dompurify@3";
  const HLJS_URL = "https://esm.sh/highlight.js@11";
  const KATEX_AUTO_RENDER_URL = "https://esm.sh/katex@0.16.11/contrib/auto-render";
  const KATEX_CSS_URL = "https://esm.sh/katex@0.16.11/dist/katex.min.css";
  // How long the user has to stop typing before we speculatively fire a
  // full (LLM-backed) /query. Speculation is expensive — every fire is an
  // OpenAI round-trip — so we err on the side of waiting. Overridable via
  // config.smartSearchSpeculateIdleMs.
  const DEFAULT_SPECULATE_IDLE_MS = 1800;
  // Minimum word count before we even consider speculating. Prevents
  // 1-2 word stubs from triggering a full LLM call mid-typing.
  const SPECULATE_MIN_WORDS = 3;
  const SPECULATIVE_CACHE_MAX = 10;

  let markedPromise = null;
  function loadMarkdownLibs() {
    if (!markedPromise) {
      markedPromise = Promise.all([
        import(/* @vite-ignore */ MARKED_URL),
        import(/* @vite-ignore */ DOMPURIFY_URL),
        import(/* @vite-ignore */ HLJS_URL),
      ]).then(function ([markedModule, domPurifyModule, hljsModule]) {
        const marked = markedModule.marked || markedModule.default;
        const DOMPurify = domPurifyModule.default || domPurifyModule;
        const hljs = hljsModule.default || hljsModule;
        if (marked && typeof marked.setOptions === "function") {
          marked.setOptions({ breaks: false, gfm: true });
        }
        // Custom code renderer: syntax highlight via highlight.js and wrap
        // with a header (language label + copy button).
        if (marked && typeof marked.use === "function") {
          marked.use({
            renderer: {
              code(token) {
                // marked v14 passes a token object; older versions pass
                // (text, lang, escaped) positionals. Normalize.
                let text, lang;
                if (token && typeof token === "object") {
                  text = token.text;
                  lang = token.lang;
                } else {
                  text = token;
                  lang = arguments[1];
                }
                const langKey = (String(lang || "").trim().split(/\s+/)[0] || "").toLowerCase();
                let highlighted;
                try {
                  highlighted = langKey && hljs.getLanguage(langKey)
                    ? hljs.highlight(text, { language: langKey, ignoreIllegals: true }).value
                    : hljs.highlightAuto(text).value;
                } catch (_err) {
                  highlighted = escapeHtml(text);
                }
                const labelText = langKey || "code";
                return (
                  '<pre class="smart-code"><div class="smart-code-header">' +
                  '<span class="smart-code-lang">' + escapeHtml(labelText) + '</span>' +
                  '<button type="button" class="smart-code-copy" data-copy aria-label="Copy code">Copy</button>' +
                  '</div><code class="hljs language-' + escapeHtml(langKey || "plaintext") + '">' +
                  highlighted +
                  "</code></pre>"
                );
              },
            },
          });
        }
        return { marked: marked, DOMPurify: DOMPurify, hljs: hljs };
      });
    }
    return markedPromise;
  }

  let katexCssInjected = false;
  function ensureKatexCss() {
    if (katexCssInjected) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = KATEX_CSS_URL;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    katexCssInjected = true;
  }

  let katexPromise = null;
  function loadKatex() {
    if (!katexPromise) {
      ensureKatexCss();
      katexPromise = import(/* @vite-ignore */ KATEX_AUTO_RENDER_URL)
        .then(function (mod) { return mod.default || mod.renderMathInElement || null; })
        .catch(function () { return null; });
    }
    return katexPromise;
  }

  function renderMath(el) {
    if (!el) return;
    loadKatex().then(function (renderMathInElement) {
      if (typeof renderMathInElement !== "function") return;
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        });
      } catch (_err) { /* swallow — leave raw text */ }
    });
  }

  // Pull math segments out of the raw markdown before marked sees them, so
  // intraword underscore emphasis doesn't mangle LaTeX. Replace each with a
  // private-use placeholder that survives marked + DOMPurify untouched, and
  // reinject as $...$ / $$...$$ afterwards for KaTeX auto-render to pick up.
  // Only $...$ and $$...$$ are recognized — backticked spans stay as code.
  const MATH_PLACEHOLDER_OPEN = "M";
  const MATH_PLACEHOLDER_CLOSE = "";

  function extractMath(md) {
    const math = [];
    function placeholder(content, display) {
      math.push({ content: content, display: display });
      return MATH_PLACEHOLDER_OPEN + (math.length - 1) + MATH_PLACEHOLDER_CLOSE;
    }
    let s = String(md || "");
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (_m, inner) { return placeholder(inner, true); });
    // Single-$ inline: skip currency ($5, USD$10) by requiring non-alphanumeric on both sides.
    s = s.replace(/(^|[^A-Za-z0-9])\$([^\$\n]+?)\$(?![A-Za-z0-9])/g, function (_m, lead, inner) {
      return lead + placeholder(inner, false);
    });
    return { md: s, math: math };
  }

  function reinjectMath(html, math) {
    if (!math.length) return html;
    const re = new RegExp(MATH_PLACEHOLDER_OPEN + "(\\d+)" + MATH_PLACEHOLDER_CLOSE, "g");
    return html.replace(re, function (m, idx) {
      const i = Number(idx);
      if (i < 0 || i >= math.length) return m;
      const entry = math[i];
      const escaped = String(entry.content)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return entry.display ? ("$$" + escaped + "$$") : ("$" + escaped + "$");
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function shortUrl(url) {
    try {
      const u = new URL(url);
      return u.host + u.pathname.replace(/\/$/, "");
    } catch (_err) {
      return url;
    }
  }

  function formatCrumb(segment) {
    return String(segment)
      .replace(/_/g, " ")
      .replace(/\b(\d+)\s+/g, "")
      .trim();
  }

  function init(config) {
    const searchRoot = document.getElementById("siteSearch");
    const input = document.getElementById("siteSearchInput");
    const submit = document.getElementById("siteSearchSubmit");
    const panel = document.getElementById("siteSearchPanel");
    const status = document.getElementById("siteSearchStatus");
    const answer = document.getElementById("siteSearchAnswer");
    const meta = document.getElementById("siteSearchMeta");
    const results = document.getElementById("siteSearchResults");

    if (!searchRoot || !input || !panel || !status || !results) {
      return false;
    }

    const apiBase = String(config.smartSearchUrl || "").replace(/\/+$/, "");
    if (!apiBase) {
      return false;
    }

    const topK = Number(config.smartSearchTopK) || 5;
    // When the user submits (Enter / arrow button) we still ask for a handful
    // of sources so they can scroll through them after the AI answer. The
    // backend gives the LLM a broader pool internally, and reorders so the
    // chunks the model actually cited bubble to the top of what's returned.
    const submitTopK = Math.max(1, Number(config.smartSearchSubmitTopK) || 5);
    const debounceMs = Number(config.smartSearchDebounceMs) || 450;
    const speculateIdleMs = Math.max(300, Number(config.smartSearchSpeculateIdleMs) || DEFAULT_SPECULATE_IDLE_MS);
    const minChars = Number(config.smartSearchMinChars) || 3;
    const popularWindowDays = Number(config.smartSearchPopularWindowDays) || 7;
    const popularLimit = Number(config.smartSearchPopularLimit) || 5;

    const state = {
      previewFetch: null,       // AbortController for the current in-flight preview fetch
      submitFetch: null,        // AbortController for the current in-flight user-triggered submit
      debounceTimer: null,      // debounce timer for the preview call
      speculativeTimer: null,   // idle-then-speculate timer
      speculativeCache: new Map(), // query -> { promise, controller, resolved, data?, error? }
      lastPreviewQuery: null,
      mode: "idle",
      popularPromise: null,     // memoized fetch of /popular for the session
      history: [],              // conversation turns [{role, content}], max 3 exchanges
    };
    const originalPlaceholder = input.placeholder;

    // ------------------------------------------------------------------
    // Conversation history (follow-up questions)
    // ------------------------------------------------------------------

    function historyPayload() {
      return state.history.slice(-6);
    }

    function pushHistory(query, answerText) {
      if (!answerText) return;
      const last = state.history[state.history.length - 2];
      if (last && last.role === "user" && last.content === query) return; // re-render of same turn
      state.history.push({ role: "user", content: String(query).slice(0, 2000) });
      state.history.push({ role: "assistant", content: String(answerText).slice(0, 4000) });
      while (state.history.length > 6) state.history.shift();
      updateFollowupUi();
    }

    function clearHistory() {
      state.history = [];
      updateFollowupUi();
    }

    function updateFollowupUi() {
      input.placeholder = state.history.length
        ? "Ask a follow-up… (Esc = new topic)"
        : originalPlaceholder;
    }

    function renderFollowupChip() {
      if (!state.history.length) return;
      const exchanges = state.history.length / 2;
      meta.innerHTML =
        '<span class="smart-search-badge smart-search-badge-hint">Follow-up mode · ' +
        exchanges + (exchanges === 1 ? " turn" : " turns") + "</span> " +
        '<button type="button" class="smart-search-newtopic" id="smartSearchNewTopic">✕ new topic</button>';
      meta.hidden = false;
      const btn = document.getElementById("smartSearchNewTopic");
      if (btn) btn.addEventListener("click", function () {
        clearHistory();
        meta.hidden = true;
        meta.innerHTML = "";
        input.focus();
      });
    }

    function openPanel() {
      panel.hidden = false;
      input.setAttribute("aria-expanded", "true");
      searchRoot.classList.add("is-open");
    }
    function closePanel() {
      panel.hidden = true;
      input.setAttribute("aria-expanded", "false");
      searchRoot.classList.remove("is-open");
    }
    function setLoading(loading) {
      if (!submit) return;
      submit.dataset.loading = loading ? "true" : "false";
      submit.disabled = !!loading;
    }
    function setStatus(text) {
      status.textContent = text;
      status.hidden = false;
    }
    function clearAnswer() {
      answer.hidden = true;
      answer.innerHTML = "";
      meta.hidden = true;
      meta.innerHTML = "";
    }
    function cancelPreview() {
      if (state.previewFetch) {
        state.previewFetch.abort();
        state.previewFetch = null;
      }
    }
    function cancelSubmit() {
      if (state.submitFetch) {
        state.submitFetch.abort();
        state.submitFetch = null;
      }
    }

    // ------------------------------------------------------------------
    // Speculative cache
    // ------------------------------------------------------------------

    function getSpeculative(query) {
      return state.speculativeCache.get(query) || null;
    }

    function putSpeculative(query, entry) {
      state.speculativeCache.set(query, entry);
      // Evict the oldest on overflow. Abort it if still in flight.
      while (state.speculativeCache.size > SPECULATIVE_CACHE_MAX) {
        const oldestKey = state.speculativeCache.keys().next().value;
        const oldest = state.speculativeCache.get(oldestKey);
        if (oldest && oldest.controller && !oldest.resolved) {
          oldest.controller.abort();
        }
        state.speculativeCache.delete(oldestKey);
      }
    }

    function cancelStaleSpeculation(currentQuery) {
      // Abort any in-flight speculation for queries that are not the current one.
      for (const [q, entry] of state.speculativeCache.entries()) {
        if (q !== currentQuery && entry.controller && !entry.resolved) {
          entry.controller.abort();
          state.speculativeCache.delete(q);
        }
      }
    }

    // ------------------------------------------------------------------
    // Fetch primitive
    // ------------------------------------------------------------------

    function runQuery(query, generateAnswer, signal) {
      return fetch(apiBase + "/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          scope: "public",
          top_k: generateAnswer ? submitTopK : topK,
          generate_answer: generateAnswer,
          history: generateAnswer ? historyPayload() : [],
        }),
        signal: signal,
      }).then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      });
    }

    // Streaming variant of the full call: POST /query/stream (SSE).
    // Events: `citations` (provisional, arrives at retrieval speed) →
    // `delta` (answer text fragments) → `done` (final aligned payload).
    // Throws on any transport/protocol problem so the caller can fall
    // back to the plain /query JSON endpoint.
    async function submitStream(query, ctrl) {
      const libs = await loadMarkdownLibs();
      const response = await fetch(apiBase + "/query/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          scope: "public",
          top_k: submitTopK,
          generate_answer: true,
          history: historyPayload(),
        }),
        signal: ctrl.signal,
      });
      if (!response.ok || !response.body) throw new Error("HTTP " + response.status);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let answerMd = "";
      let gotDone = false;
      let lastRender = 0;

      function renderPartial() {
        const html = libs.marked.parse(answerMd, { async: false });
        answer.innerHTML = libs.DOMPurify.sanitize(html, { ADD_ATTR: ["target", "rel"] });
        answer.hidden = false;
      }

      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buf += decoder.decode(chunk.value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop();
        for (const frame of frames) {
          const evMatch = frame.match(/^event: (.+)$/m);
          const dataMatch = frame.match(/^data: (.+)$/m);
          if (!evMatch || !dataMatch) continue;
          let payload;
          try { payload = JSON.parse(dataMatch[1]); } catch (e) { continue; }
          if (state.mode !== "full") { ctrl.abort(); return; }
          if (evMatch[1] === "citations") {
            // Provisional sources, pre-answer — visible within ~0.5 s.
            renderResults({ citations: payload.citations }, "full", "");
            status.hidden = false;
            status.textContent = "Generating answer…";
          } else if (evMatch[1] === "delta") {
            answerMd += payload.text || "";
            const now = Date.now();
            if (now - lastRender > 120) {
              lastRender = now;
              renderPartial();
            }
          } else if (evMatch[1] === "done") {
            gotDone = true;
            // Final payload: [N] markers remapped, citations realigned.
            await renderFull(query, payload);
          }
        }
      }
      if (!gotDone) throw new Error("stream ended without done event");
    }

    function fetchPopular() {
      if (!state.popularPromise) {
        const url = apiBase + "/popular?window_days=" + popularWindowDays + "&limit=" + popularLimit;
        state.popularPromise = fetch(url, { credentials: "omit" })
          .then(function (r) { return r.ok ? r.json() : { queries: [] }; })
          .catch(function () { return { queries: [] }; });
      }
      return state.popularPromise;
    }

    async function showPopular() {
      // Only render when the input is empty. If user typed in the meantime,
      // bail out so we don't clobber preview/full content.
      const data = await fetchPopular();
      if (input.value.trim().length > 0) return;
      if (state.mode !== "idle" && state.mode !== "popular") return;
      const popularQueries = (data && Array.isArray(data.queries) ? data.queries : []).slice(0, popularLimit);
      if (!popularQueries.length) {
        closePanel();
        return;
      }
      state.mode = "popular";
      clearAnswer();
      results.innerHTML = "";
      meta.hidden = true;
      meta.innerHTML = "";
      setStatus("Popular this week");
      const container = document.createElement("div");
      container.className = "smart-search-popular";
      popularQueries.forEach(function (pq) {
        const q = String(pq.query || "").trim();
        if (!q) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "smart-search-popular-chip";
        btn.innerHTML =
          '<span class="smart-search-popular-query">' + escapeHtml(q) + "</span>" +
          '<span class="smart-search-popular-count" aria-hidden="true">' + (Number(pq.count) || 0) + "</span>";
        btn.addEventListener("click", function () {
          input.value = q;
          input.focus();
          // Skip the preview round-trip and go straight to the full LLM
          // answer — popular chips are by definition already in the
          // server-side QueryCache, so submitFull resolves fast.
          clearTimeout(state.debounceTimer);
          clearTimeout(state.speculativeTimer);
          submitFull(q);
        });
        container.appendChild(btn);
      });
      results.appendChild(container);
      openPanel();
    }

    // ------------------------------------------------------------------
    // Prefire: retrieval-only on typing
    // ------------------------------------------------------------------

    async function prefire(query) {
      cancelPreview();
      const ctrl = new AbortController();
      state.previewFetch = ctrl;
      state.lastPreviewQuery = query;
      state.mode = "preview";
      setStatus("Searching…");
      clearAnswer();
      openPanel();
      try {
        const data = await runQuery(query, false, ctrl.signal);
        if (state.lastPreviewQuery !== query || state.mode !== "preview") return;
        renderResults(data, "preview", null);
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("Search failed: " + (err.message || err));
      }
    }

    // ------------------------------------------------------------------
    // Speculation: fire the full call on idle typing, cache by query
    // ------------------------------------------------------------------

    function scheduleSpeculation(query) {
      clearTimeout(state.speculativeTimer);
      if (getSpeculative(query)) return; // already fired (in-flight or resolved)
      // Skip short stubs — "how", "what are" etc. never warrant a live
      // LLM call. Wait until the query looks like a real question.
      const wordCount = query.split(/\s+/).filter(Boolean).length;
      if (wordCount < SPECULATE_MIN_WORDS) return;
      state.speculativeTimer = setTimeout(function () {
        if (input.value.trim() !== query) return; // user kept typing
        startSpeculation(query);
      }, speculateIdleMs);
    }

    function startSpeculation(query) {
      if (getSpeculative(query)) return;
      const ctrl = new AbortController();
      const promise = runQuery(query, true, ctrl.signal);
      const entry = { promise: promise, controller: ctrl, resolved: false, data: null, error: null };
      putSpeculative(query, entry);
      promise.then(
        function (data) { entry.data = data; entry.resolved = true; },
        function (err) {
          entry.resolved = true;
          if (err && err.name !== "AbortError") entry.error = err;
        }
      );
    }

    // ------------------------------------------------------------------
    // Submit: instant path via cache, else fresh call
    // ------------------------------------------------------------------

    async function submitFull(query) {
      if (!query || query.length < minChars) return;
      state.mode = "full";
      setLoading(true);
      openPanel();
      // Preview can go.
      cancelPreview();

      // Speculative entries were fired without conversation history — in
      // follow-up mode they would answer out of context. Skip them.
      const cached = state.history.length ? null : getSpeculative(query);
      let dataPromise;

      if (cached && cached.resolved && cached.data) {
        // Instant — render what we already have.
        await renderFull(query, cached.data);
        setLoading(false);
        return;
      }

      if (cached && !cached.resolved) {
        // Already flying — await the existing promise. No extra request.
        setStatus("Thinking…");
        dataPromise = cached.promise;
      } else {
        // Either no cache, or a prior speculation errored — fire fresh.
        // Prefer the SSE endpoint: provisional sources render at retrieval
        // speed and the answer types itself out. Any stream failure falls
        // through to the plain JSON endpoint below.
        if (cached && cached.error) state.speculativeCache.delete(query);
        setStatus("Thinking…");
        cancelSubmit();
        const streamCtrl = new AbortController();
        state.submitFetch = streamCtrl;
        try {
          await submitStream(query, streamCtrl);
          setLoading(false);
          return;
        } catch (streamErr) {
          if (streamErr && streamErr.name === "AbortError") { setLoading(false); return; }
          // Stream endpoint unavailable / proxy buffered it — plain call.
          cancelSubmit();
          const ctrl = new AbortController();
          state.submitFetch = ctrl;
          dataPromise = runQuery(query, true, ctrl.signal);
        }
      }

      try {
        const data = await dataPromise;
        if (state.mode !== "full") return;
        await renderFull(query, data);
      } catch (err) {
        if (err && err.name === "AbortError") return;
        // Transient network blips (tunnel resets, momentary offline) surface
        // as TypeError / NetworkError. Retry once transparently before we
        // give up — if speculation was the source, drop its entry first.
        const message = (err && err.message) ? String(err.message) : String(err);
        const isNetworkError = err instanceof TypeError || /NetworkError|Failed to fetch|load failed/i.test(message);
        if (isNetworkError && state.mode === "full") {
          state.speculativeCache.delete(query);
          cancelSubmit();
          const retryCtrl = new AbortController();
          state.submitFetch = retryCtrl;
          try {
            const retryData = await runQuery(query, true, retryCtrl.signal);
            if (state.mode !== "full") return;
            await renderFull(query, retryData);
            return;
          } catch (retryErr) {
            if (retryErr && retryErr.name === "AbortError") return;
            setStatus("AI answer failed: " + ((retryErr && retryErr.message) || retryErr));
            return;
          }
        }
        setStatus("AI answer failed: " + message);
      } finally {
        setLoading(false);
      }
    }

    async function renderFull(query, data) {
      const libs = await loadMarkdownLibs();
      const citations = Array.isArray(data.citations) ? data.citations : [];
      // Pull math out *before* marked sees it; intraword underscores inside
      // formulas would otherwise be eaten as emphasis.
      const extracted = extractMath(data.answer || "");
      const html = libs.marked.parse(extracted.md, { async: false });
      let clean = libs.DOMPurify.sanitize(html, { ADD_ATTR: ["target", "rel"] });
      // Citation replacement first — placeholders contain no [N] tokens, so
      // doing this before reinject avoids any [N] inside formulas being
      // mistaken for citations.
      clean = clean.replace(/\[(\d+)\]/g, function (match, n) {
        const i = Number(n);
        if (!Number.isInteger(i) || i < 1 || i > citations.length) return match;
        const citation = citations[i - 1] || {};
        const href = citation.url || "#smartCite" + i;
        const title = escapeHtml(citation.title || "");
        return '<sup><a href="' + href + '" target="_blank" rel="noopener" title="' + title + '">[' + i + "]</a></sup>";
      });
      clean = reinjectMath(clean, extracted.math);
      renderResults(data, "full", clean);
      // Render any LaTeX in the answer (e.g. $Q^2$, $$x = \\frac{p \\cdot q}{p \\cdot Q}$$).
      // Run after the HTML is in the DOM, so KaTeX scans real text nodes; DOMPurify
      // never sees KaTeX output. Code blocks are skipped via ignoredTags.
      renderMath(answer);
      // Remember the exchange so the next question can be a follow-up,
      // and offer the escape hatch back to a fresh topic.
      pushHistory(query, data.answer || "");
      renderFollowupChip();
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------

    // Citation-click telemetry: feeds the backend feedback table so
    // ranking can later learn from what users actually open.
    let lastQueryLogId = null;
    function beaconCitationClick(chunkId) {
      try {
        const payload = JSON.stringify({
          query_log_id: lastQueryLogId,
          selected_citation_ids: [chunkId],
          metadata: { type: "citation_click" },
        });
        navigator.sendBeacon(
          apiBase + "/feedback",
          new Blob([payload], { type: "application/json" })
        );
      } catch (_err) { /* telemetry only — never break navigation */ }
    }

    function renderResults(data, mode, answerHtml) {
      if (data && data.query_log_id) lastQueryLogId = data.query_log_id;
      const citations = Array.isArray(data.citations) ? data.citations : [];
      results.innerHTML = "";
      if (!citations.length) {
        setStatus("No matching documents in the indexed sources.");
        clearAnswer();
        if (mode === "full") {
          answer.hidden = false;
          answer.innerHTML =
            '<div class="smart-search-noresult">No indexed source answers this. Try rephrasing, ' +
            'or ask in <a href="https://chat.epic-eic.org/" target="_blank" rel="noopener">Mattermost</a> / ' +
            'browse the <a href="https://wiki.bnl.gov/EPIC/" target="_blank" rel="noopener">wiki</a>.</div>';
          renderFeedbackRow(data);
        }
        return;
      }

      if (answerHtml) {
        answer.innerHTML = answerHtml;
        answer.hidden = false;
      } else {
        clearAnswer();
      }

      if (mode === "preview") {
        meta.innerHTML = '<span class="smart-search-badge smart-search-badge-hint">Press ↵ for an AI answer</span>';
        meta.hidden = false;
      } else {
        meta.hidden = true;
        meta.innerHTML = "";
      }

      const fragment = document.createDocumentFragment();
      citations.forEach(function (c, i) { fragment.appendChild(renderCitation(c, i + 1)); });
      results.appendChild(fragment);

      if (mode === "full") {
        // The answer block + citation list speak for themselves; a
        // redundant "Answer" header just adds noise.
        status.textContent = "";
        status.hidden = true;
        renderFeedbackRow(data);
      } else {
        setStatus("Top " + citations.length + " sources");
      }
    }

    // Expert referral (from the API's expert_hint) + thumbs feedback. Turns
    // a low-confidence answer into a route to a human and a training signal.
    function renderFeedbackRow(data) {
      const old = document.getElementById("smart-search-feedback");
      if (old) old.remove();
      const row = document.createElement("div");
      row.id = "smart-search-feedback";
      row.className = "smart-search-feedback";
      let html = "";
      if (data && data.expert_hint) {
        html += '<div class="smart-search-expert">👤 ' + escapeHtml(data.expert_hint) + "</div>";
      }
      html +=
        '<div class="smart-search-rate">Helpful?' +
        '<button type="button" class="smart-search-thumb" data-rate="5" aria-label="Yes">👍</button>' +
        '<button type="button" class="smart-search-thumb" data-rate="1" aria-label="No">👎</button>' +
        '<span class="smart-search-thanks" hidden>Thanks — logged.</span></div>';
      row.innerHTML = html;
      row.querySelectorAll(".smart-search-thumb").forEach(function (btn) {
        btn.addEventListener("click", function () {
          sendFeedback(Number(btn.dataset.rate), data);
          row.querySelector(".smart-search-thanks").hidden = false;
          row.querySelectorAll(".smart-search-thumb").forEach(function (b) { b.disabled = true; });
        });
      });
      answer.appendChild(row);
    }

    function sendFeedback(rating, data) {
      try {
        const payload = JSON.stringify({
          query_log_id: (data && data.query_log_id) || lastQueryLogId,
          rating: rating,
          metadata: { type: "thumb" },
        });
        navigator.sendBeacon(apiBase + "/feedback", new Blob([payload], { type: "application/json" }));
      } catch (_err) { /* telemetry only */ }
    }

    function renderCitation(c, index) {
      const title = escapeHtml(c.title || c.url || "Untitled");
      const url = c.url || "#";
      const snippet = escapeHtml(c.snippet || "").slice(0, 240);
      const score = typeof c.score === "number" ? c.score : null;
      const metaData = c.metadata || {};
      const headingPath = Array.isArray(metaData.heading_path) ? metaData.heading_path : [];
      const sectionPath = Array.isArray(metaData.section_path) ? metaData.section_path : [];
      const crumbs = (headingPath.length ? headingPath : sectionPath)
        .map(formatCrumb)
        .filter(Boolean)
        .slice(-3);
      const crumbHtml = crumbs.length
        ? '<div class="smart-search-breadcrumb">' +
          crumbs.map(function (crumb, i) {
            return (i ? '<span class="smart-search-breadcrumb-sep" aria-hidden="true">›</span>' : "") +
                   '<span>' + escapeHtml(crumb) + '</span>';
          }).join("") +
          "</div>"
        : "";
      const scoreHtml = score !== null
        ? '<span class="smart-search-citation-score" title="Relevance score">' + score.toFixed(2) + "</span>"
        : "";
      const a = document.createElement("a");
      a.className = "list-group-item list-group-item-action site-search-result smart-search-citation";
      a.id = "smartCite" + index;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      if (c.chunk_id) a.addEventListener("click", function () { beaconCitationClick(c.chunk_id); });
      a.innerHTML =
        '<div class="smart-search-citation-row">' +
        '<span class="smart-search-citation-index">' + index + "</span>" +
        '<div class="smart-search-citation-body">' +
        crumbHtml +
        '<div class="smart-search-citation-title">' + title + "</div>" +
        (snippet ? '<div class="smart-search-citation-snippet">' + snippet + "</div>" : "") +
        "</div>" +
        scoreHtml +
        "</div>";
      return a;
    }

    // ------------------------------------------------------------------
    // Event wiring
    // ------------------------------------------------------------------

    input.addEventListener("input", function () {
      const q = input.value.trim();
      clearTimeout(state.debounceTimer);
      clearTimeout(state.speculativeTimer);
      cancelStaleSpeculation(q);
      if (q.length === 0) {
        cancelPreview();
        state.mode = "idle";
        showPopular();
        return;
      }
      if (q.length < minChars) {
        cancelPreview();
        // Keep panel open with popular if it was — otherwise hide.
        if (state.mode !== "popular") closePanel();
        return;
      }
      state.debounceTimer = setTimeout(function () {
        // In follow-up mode the typed text is usually anaphoric ("how do I
        // read one?") — previews and speculation on it retrieve garbage and
        // would answer without the conversation context. Submit-only.
        if (state.history.length) return;
        prefire(q);
        scheduleSpeculation(q);
      }, debounceMs);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim().length === 0) {
        showPopular();
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(state.debounceTimer);
        clearTimeout(state.speculativeTimer);
        submitFull(input.value.trim());
      } else if (e.key === "Escape") {
        // First Esc in follow-up mode starts a new topic (keeps focus for
        // the next question); Esc with no history closes the panel.
        if (state.history.length) {
          clearHistory();
          meta.hidden = true;
          meta.innerHTML = "";
          input.value = "";
          setStatus("New topic — conversation cleared.");
          return;
        }
        closePanel();
        cancelPreview();
        cancelSubmit();
        state.mode = "idle";
        input.blur();
      }
    });

    if (submit) {
      submit.addEventListener("click", function () {
        clearTimeout(state.debounceTimer);
        clearTimeout(state.speculativeTimer);
        submitFull(input.value.trim());
      });
    }

    document.addEventListener("mousedown", function (e) {
      if (!searchRoot.contains(e.target)) closePanel();
    });
    document.addEventListener("focusin", function (e) {
      if (!searchRoot.contains(e.target)) closePanel();
    });

    // Copy-to-clipboard on code-block copy buttons. Event delegation so it
    // survives re-renders of the answer HTML.
    answer.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      e.preventDefault();
      const pre = btn.closest("pre.smart-code");
      const codeEl = pre ? pre.querySelector("code") : null;
      if (!codeEl) return;
      const text = codeEl.textContent || "";
      const done = function (ok) {
        btn.textContent = ok ? "Copied" : "Copy failed";
        btn.dataset.state = ok ? "copied" : "error";
        setTimeout(function () {
          btn.textContent = "Copy";
          delete btn.dataset.state;
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (_err) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });

    return true;
  }

  window.eicSmartSearch = { init: init };
})();
