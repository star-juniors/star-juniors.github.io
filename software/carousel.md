---
title: Data Carousel
parent: HPSS (Tape)
---


# Data Carousel

The **Data Carousel** is the sanctioned way to restore data from
[HPSS tape](/software/hpss) at scale — especially **production data** (MuDST,
picoDst, DST). You hand it a list of files; it queues, de-duplicates, and throttles
the requests, then copies the files onto a disk path you choose.

It was written by Jérôme Lauret and is still the front end that coordinates
everyone's restore requests against the shared tape system.

{: .warning }
> **Always restore production data through the Carousel — never with `hsi`/`htar` directly.**
> Pulling MuDST file-by-file straight off tape overwhelms HPSS and **collapses production
> for everyone**. The Carousel exists precisely to prevent that.


# Why a carousel?

Tape is slow and shared. Without coordination, dozens of users pulling files at once
thrash the tape robots and starve production. The Carousel fixes this:

- **Batches and re-orders** requests so files on the same tape are read together.
- **De-duplicates** — if a file you ask for is already being restored (by you or
  someone else), you piggy-back on that request instead of staging the same tape twice.
- **Accounts and throttles** per analysis / hardware group, so no one user starves
  the rest.

It isn't only for shared production data — the Carousel restores **your own** archived
files too. And because it runs as a managed service, it's the recommended path even for
users who don't have their own HPSS account.


# Before you start

- **Find the HPSS paths** of the files you want with
  [`get_file_list.pl`](/software/get_file_list) (pass `storage=hpss`). Production files
  live under `/home/starreco/reco/...`.
- **Pick a writable destination** on disk (your scratch or PWG area). The Carousel
  **creates the target directory if it doesn't exist**, so watch for typos — a mistyped
  path just makes a new directory full of files.
- **Run from an SDCC interactive node** (`starsub0x`); `hpss_user.pl` is already on your
  `PATH` there.


# 1. Build a request list

**Same destination for everything** — one HPSS file per line (`files.lis`):

```
/home/starreco/reco/.../st_physics_..._raw_0001.MuDst.root
/home/starreco/reco/.../st_physics_..._raw_0002.MuDst.root
```

**Per-file destinations** — `HPSS_path  target_path` pairs, one per line (`pairs.lis`):

```
/home/starreco/reco/.../st_physics_..._0001.MuDst.root  /star/u/you/data/0001.MuDst.root
/home/starreco/reco/.../st_physics_..._0002.MuDst.root  /star/u/you/data/0002.MuDst.root
```

Input and output names don't have to match — you decide how to lay out the restored files.


# 2. Submit with `hpss_user.pl`

```bash
# restore a whole list into one directory
hpss_user.pl -r /star/u/you/data/ -f files.lis

# restore using explicit per-file destinations (HPSS → target pairs)
hpss_user.pl -f pairs.lis

# one-off single file straight from the command line
hpss_user.pl /home/starreco/reco/.../file.MuDst.root /star/u/you/data/file.MuDst.root
```

When you use `-r`, put it **before** `-f`.


# 3. Track your request

The Carousel server picks up new requests every few minutes and works through them as
tape bandwidth allows — a large request takes time, that's normal.

Check progress on the [accounting page](https://www.star.bnl.gov/devcgi/display_accnt.cgi);
the last column shows success, or the reason a file failed.

You can also check the queue status on the command line by running `hpss_user.pl -w`.
However, this will show the queue for all submissions not just for a particular username

# `next` — the newer restore path

A newer restore service, **`next`**, is also available. For bulk restores either the
classic Carousel or `next` is fine — when you're unsure which fits a given dataset, ask
the Software & Computing / production team. The rule that never changes: **go through a
managed service; don't pull MuDST off tape by hand.**


# Advanced: user hooks

The Carousel can run a per-file `beforeFtp.pl` / `afterFtp.pl` hook — e.g. to check free
space before a restore, or kick off a job after one. They live in `$HOME/carousel` (or
`$HOME/.carousel`) and must stay lightweight: they run **once per file**, so heavy hooks
(`du`, directory-wide `stat()`, `sleep`) will hammer the servers. See the
[full STAR documentation](https://drupal.star.bnl.gov/STAR/comp/sofi/tutorials/carousel)
for the details and example scripts.


# See also

- [HPSS (Tape)](/software/hpss) — archiving and restoring your own files with `hsi`/`htar`
- [`get_file_list.pl`](/software/get_file_list) — find the HPSS paths to put in your request list
