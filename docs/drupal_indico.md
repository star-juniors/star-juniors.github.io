---
title: Drupal access and Indico
nav_order: 7
permalink: /drupal-indico
---

# Drupal access and Indico
{: .no_toc }

{: .warning }
Drupal is reachable only through an SSH tunnel to SDCC. Until STAR moves to InvenioRDM, talks for review go to [Indico](#2-talks-on-indico).

1. TOC
{:toc}

## 1. Drupal through an SSH tunnel

The tunnel opens a SOCKS proxy on `localhost:1088`. A [PAC file](https://www4.rcf.bnl.gov/~geurts/configs/star.pac) tells the browser to send only BNL addresses through it.

```mermaid
flowchart LR
    B[Browser] -- "*.bnl.gov" --> P["localhost:1088"]
    B -- "other sites" --> I[Internet]
    P == ssh ==> G[cssh.sdcc.bnl.gov] --> D[drupal.star.bnl.gov]
```

You need an SDCC account and a working [SSH key](/software/ssh/).

### Open the tunnel

Linux, macOS and WSL:

```bash
ssh -C -N -D 1088 <sdcc_user>@cssh.sdcc.bnl.gov
```

Keep the terminal open; `Ctrl+C` closes the tunnel.

<details markdown="1">
<summary>Shortcut in <code>~/.ssh/config</code></summary>

```
Host star-socks
    HostName cssh.sdcc.bnl.gov
    User <sdcc_user>
    DynamicForward 127.0.0.1:1088
    Compression yes
    ServerAliveInterval 60
```

Then run `ssh -N star-socks`.
</details>

{: .note }
WSL: run the command inside [WSL](/software/wsl). Windows browsers reach it as `localhost:1088`; check with `Test-NetConnection 127.0.0.1 -Port 1088` in PowerShell.

### Set up the browser

PAC URL: [`https://www4.rcf.bnl.gov/~geurts/configs/star.pac`](https://www4.rcf.bnl.gov/~geurts/configs/star.pac)

**Firefox:** Settings → Network Settings → Settings… → *Automatic proxy configuration URL* → paste the URL → Reload → OK ([Mozilla help](https://support.mozilla.org/kb/connection-settings-firefox)).

**Chrome** has no proxy setting of its own. Start a separate window with the PAC URL; the separate `--user-data-dir` is needed if Chrome is already running.

Windows (desktop shortcut target, replace `<you>`):

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\Users\<you>\AppData\Local\Google\Chrome STAR" --proxy-pac-url=https://www4.rcf.bnl.gov/~geurts/configs/star.pac
```

macOS:

```bash
open -na "Google Chrome" --args --user-data-dir="$HOME/.chrome-star" --proxy-pac-url=https://www4.rcf.bnl.gov/~geurts/configs/star.pac
```

Linux:

```bash
google-chrome --user-data-dir="$HOME/.chrome-star" --proxy-pac-url=https://www4.rcf.bnl.gov/~geurts/configs/star.pac
```

**Other browsers** use the system proxy: on Windows *Settings → Network & internet → Proxy → Use setup script*, on macOS *Network → Details → Proxies → Automatic proxy configuration*, on GNOME *Network → Network Proxy → Automatic*.

{: .warning }
Do not set `localhost:1088` as a manual SOCKS proxy: that sends all your traffic through BNL.

Then open <https://drupal.star.bnl.gov/STAR/>.

### Troubleshooting

| Problem | Fix |
|:--|:--|
| `503 Service Unavailable` | The tunnel is not running. Start it again (it drops after sleep or a network change). |
| `Address already in use` | A tunnel is already open. |
| `Permission denied (publickey)` | Your key is not registered at SDCC, see [SSH](/software/ssh/). |
| Chrome ignores the proxy | Another Chrome with the same `--user-data-dir` is open. |

## 2. Talks on Indico

Temporary procedure until InvenioRDM is ready.

```mermaid
flowchart LR
    L[Log in to Indico] --> A
    A[Upload to Indico] --> B[Email PWG conveners]
    B --> C[Update slides]
    C --> B
    B --> D[Conveners forward to STAR-talks]
    D --> E[PAC review]
```

### Log in to Indico

STAR events on [indico.bnl.gov](https://indico.bnl.gov) are visible only to STAR members. Access comes from the STAR PhoneBook, matched to your Indico account through ORCID. Steps from the pinned post in the Mattermost channel [Indico / PhoneBook integration](https://chat.sdcc.bnl.gov/star/channels/indico--phonebook-integration):

1. [Register with CoManage](https://docs.sdcc.bnl.gov/services/comanage/Register_for_SCDF_COmanage/). Use your BNL/SDCC account as the first identity if you have one. The first registration needs approval.
2. [Add your ORCID](https://docs.sdcc.bnl.gov/services/comanage/Add_ORCID_to_COperson/) to the CoManage entry. Other identities, e.g. your home institution, can be [added later](https://docs.sdcc.bnl.gov/access/accounts/connecting-comanage/). If the page misbehaves on a second visit, use a private window.
3. Log in to Indico with **CILogon**, then log out. Indico merges the accounts that share your ORCID.
4. PhoneBook syncs to Indico every hour at 20 minutes past. After the next sync, log in again with CILogon and open the [test event](https://indico.bnl.gov/event/34407/). If it opens, you are done.

{: .note }
Still "Access Denied" after the sync? Usually the PhoneBook record has no ORCID or a different email than Indico. Ask in the [Mattermost channel](https://chat.sdcc.bnl.gov/star/channels/indico--phonebook-integration).

### Upload the slides

1. Open the [STAR conferences category](https://indico.bnl.gov/category/801/), then the conference and your PWG. If they are missing, ask the PWG conveners and the PAC to create them.

   <img src="/img/indico/category.png" alt="STAR conferences category on Indico" width="560">

2. Click the pencil icon in the top toolbar (*Switch to the management area*), then **Timetable**.

   <img src="/img/indico/manage-button.png" alt="Pencil icon: switch to the management area" width="560">
   <img src="/img/indico/timetable-menu.png" alt="Timetable in the management menu" width="180">

3. **Add new → Contribution**. Title: `John Doe: Measurement of ...`. Save, then **Switch to display view**.

   <img src="/img/indico/add-contribution.png" alt="Add new, Contribution" width="220">

4. Next to your talk, open the pencil menu, choose **Material editor** and upload the slides.

   <img src="/img/indico/material-editor.png" alt="Contribution menu with Material editor" width="180">

The result looks like this ([example event](https://indico.bnl.gov/event/35219/)):

<img src="/img/indico/event-example.png" alt="Example contribution in the PWG event" width="560">

### Ask for review

1. Email the PWG conveners:

   ```
   Subject: STAR presentation by John Doe for Quark Matter 2027 submitted for review

   Slides: https://indico.bnl.gov/event/<id>/contributions/<id>/
   ```

2. Update the slides on Indico after the comments.
3. When the conveners approve, they forward the email to STAR-talks. The PAC then reviews the talk as usual.
