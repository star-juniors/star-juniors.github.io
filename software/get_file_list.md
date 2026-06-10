---
title:  get_file_list.pl
parent: Software
---


# get_file_list.pl

`get_file_list.pl` queries the STAR **File Catalog** to find data files and build the
file lists you feed to your analysis (or to the [Data Carousel](/software/carousel)).

Full reference: [File Catalog user manual](https://drupal.star.bnl.gov/STAR/comp/sofi/filecatalog/user-manual)


## Syntax

```bash
get_file_list.pl -keys 'path,filename' -cond 'storage=XX,filetype=XX,filename~XX,production=XX,trgsetupname=XX' -limit NN -distinct -delim '/'
```

- `-cond` — what to select (see the table below). Use `~` for a substring match
  (`filename~st_physics`) and `!=` to exclude (`storage!=hpss`). Keys are case-insensitive.
- `-keys` — what to print for each match (see *Output*).
- `-distinct` — drop duplicate rows.
- `-limit NN` — cap the number of results; `-limit 0` returns **all** files.
- `-delim '/'` — join the printed fields with `/` instead of the default `::`.


## What to select (`-cond`)

| Key | Selects | Where to find values |
|------|---------|----------------------|
| `storage` | `local` (`/home/starlib/…`), `NFS` (`/star/dataXX/…`), or `HPSS` (`/home/starreco/reco/…`) | — |
| `filetype` | `daq_reco_event` (DST), `daq_reco_muDst` (MuDst), `daq_reco_picoDst` (PicoDst) | [PicoDst format](https://drupal.star.bnl.gov/STAR/blog/gnigmat/picodst-format) |
| `filename` | filename substring, e.g. `filename~st_physics` | — |
| `production` / `library` | production tag / software library | [production options](https://www.star.bnl.gov/devcgi/dbProdOptionRetrv.pl) |
| `trgsetupname` | trigger setup | [data summary](https://www.star.bnl.gov/public/comp/prod/DataSummary.html) · [production](https://drupal.star.bnl.gov/STAR/comp/prod) |


## What to print (`-keys`)

For a plain file list, use `-keys 'path,filename' -delim '/'`.

To see *where* the data lives and how big it is, add more fields, e.g.
`-keys 'fdid,storage,site,node,path,filename,events'`:

- `storage` — `local`, `NFS`, or `HPSS` (handy to know if a file is still on tape)
- `site`, `node` — where the file physically sits
- `events` — event count, useful to check **before** you restore from tape
- `fdid` — file descriptor ID


## Most common query

Find PicoDst files on disk (not tape):

```bash
get_file_list.pl -keys 'path,filename' \
-cond 'storage!=hpss,filetype=daq_reco_picoDst,filename~st_physics,production=P12id,trgsetupname=pp200_production_2012' \
-limit 10 -distinct -delim '/'
```

Use `storage=local` to search only the distributed disks.


## More examples

```bash
get_file_list.pl -keys 'path,filename'\
-cond 'storage=hpss,filetype=daq_reco_muDst,filename~st_physics,production=P11id,trgsetupname=AuAu19_production'\
-limit 10 -distinct -delim '/'
```
```bash
get_file_list.pl -keys path,filename \
-cond storage=local,trgsetupname=production_pp200trans_2015,filetype=daq_reco_mudst,filename~st_fms_16 \
-delim '/'
```
```bash
get_file_list.pl -keys 'fdid,storage,site,node,path,filename,events' \
-cond 'trgsetupname=AuAu19_production, filetype=daq_reco_MuDst, filename~st_physics, storage!=hpss' \
-limit 60 -delim '/'
```
```bash
get_file_list.pl -keys 'path,filename' \
-cond 'production=P11id,filetype=daq_reco_MuDst,trgsetupname=AuAu19_production,tpx=1,filename~st_physics,sanity=1,storage!=HPSS' \
-limit 60 -delim '/'
```


## Tips

- **Check disk first, tape last.** Query with `storage!=hpss` and only fall back to
  `storage=hpss` if nothing comes back — no point restoring a file that's already on disk.
  (The catalog searches `local` → `NFS` → `HPSS` in that order anyway.)
- **`/home/starlib/…` is distributed disk (DD).** You can't browse it, but `root` can open
  the files using the prefix `root://xrdstar.rcf.bnl.gov:1095/`.
- **`/home/starreco/reco/…` is HPSS tape.** Those files can't be opened until you restore
  them — see below.


## Restoring files from HPSS

Once you have the HPSS paths, restore them through the **[Data Carousel](/software/carousel)** —
that page has the full `hpss_user.pl` walkthrough and request-list formats. Never pull MuDst
straight off tape with `hsi`/`htar`; see [HPSS (Tape)](/software/hpss) for why. The short version:

1. **Find the files** with `get_file_list.pl` and `storage=hpss`.
2. **Pick a good run** in the STAR RunLog Browser.
3. **Check event counts** first by adding `events` to `-keys` (e.g. `-keys 'path,filename,events'`).
4. **Make a target directory** on your local or PWG disk.
5. **Submit the request:** `hpss_user.pl HPSSFilePath/ TargetFilePath/` (`hpss_user.pl -h` lists all options).
6. **Track it** on the [accounting page](https://www.star.bnl.gov/devcgi/display_accnt.cgi); restored files land in your target directory.
