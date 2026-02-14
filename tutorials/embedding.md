---
title: Embedding
parent: Tutorials
---

# STAR Embedding
{: .no_toc }

*Monika Robotkova*
{: .fs-4 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## What “embedding” means in STAR

In STAR analyses, we often need **detector acceptance × reconstruction efficiency** to correct raw spectra. The key problem is that tracking efficiency (especially in the TPC) depends strongly on real run conditions: luminosity/occupancy, dead channels, run-by-run vertex distribution, pileup, and more.

**Embedding** solves this by:

- Simulating *only the signal tracks you care about* (e.g., electrons, pions, J/ψ daughters),
- **Mixing** their simulated TPC response into **real** data events,
- Re-running the **same reconstruction chain** as for real data,
- Measuring how many simulated tracks survive as **reconstructed** tracks (truth-matched),
- Being much cheaper than full event simulation + full detector response for every event,
- Being produced per particle/analysis and per dataset/trigger setup to stay correct.

---

## The big picture

```mermaid
flowchart TD
  A["Sample MC particles in desired kinematics<br/>(put them on the real event primary vertex)"] --> B["GEANT: propagate through STAR geometry<br/>→ produce MC TPC hits"]
  B --> C["TPC response simulation<br/>→ convert hits to TPC electronic signals"]
  R["Real data TPC electronic signals<br/>(from st_*_adc DAQ files)"] --> D["Mix MC + real TPC electronic signals"]
  C --> D
  D --> E["TPC cluster / hit reconstruction<br/>(find hit's idTruth)"]
  E --> F["Track reconstruction<br/>(find track's idTruth)"]
  F --> G["Output MuDst contains:<br/>• reconstructed tracks (with idTruth, qaTruth)<br/>• MC truth tracks (StMuMcTrack)"]
  S["Same library + chain options<br/>as real data production"] -.-> E
  S -.-> F
````

**Key point:** the “real detector signals” input is **`st_*_adc` DAQ** (not arbitrary DAQ flavors).

---

## What you analyze in the output (truth matching)

Embedding is typically delivered as **MuDst.root** files that include:

* `StMuMcTrack` (all MC truth tracks),
* `StMuMcVertex` (all MC truth vertices),
* `StMuTrack::idTruth()` = best-matched MC track id,
* `StMuTrack::qaTruth()` = match quality (percent).

That means you can compute efficiencies directly from MuDst without extra bookkeeping.

STAR embedding example macro:

* `cvs co StRoot/macros/embedding/anamudst`

---

## Production lifecycle

* Select a DAQ sample based on the embedding request,
* Stage DAQ + corresponding MuDst from HPSS to NFS disks (e.g., `/star/embed/...`),
* Configure the embedding code with requested parameters,
* Produce a **test production**,
* A helper performs **base QA**,
* Run full production; the production analyst (PA) performs QA + informs the PWG,
* If OK, the request is closed,
* Data typically stay on NFS for **~6+ months** (may be deleted later unless restored).

---

## How to find existing embeddings (before you request)

* Current embedding NFS areas (examples): `/star/data105`, `/star/embed`, `/star/data18`

* Look for productions like:

  * `/star/embed/embedding/<TriggerSetName>/<EmbeddedParticle>_<fSet>/`

* Verify all requested **fSet** chunks exist from `fSet_min` to `fSet_max`.
  If the production is incomplete, contact the embedding coordinator or the embedding mailing list.

---

## What goes into an embedding request

Before requesting, STAR typically expects you to present the analysis in your PWG and justify why embedding is needed.

### Real data sample details (what you mix into)

* Trigger set name (from a STAR data summary page)
* DAQ file type (embedding uses **`st_*_adc`** DAQ)
* Approx. number of events to sample (often start small; scale up)
* Production tag (e.g., `P15ic`)
* Run range + good/bad runs list
* Trigger IDs
* Vertex cuts / selection method (Vz, VPD constraints, etc.)
* Optional extra event cuts (e.g., refmult/grefmult)

### Simulation + reconstruction details (what you inject)

* Particle type and decay channel (if unstable)
* pT range + distribution shape (flat / exponential / etc.)
* Rapidity or pseudorapidity range (**be explicit which one**)
* Number of MC particles per event (often “~5% of refmult/grefmult”, or a fixed number)
* If using generator embedding (e.g., HIJING / PYTHIA): generator parameters
* Special chain requirements (e.g., turn off some detectors, special tracking)
* Whether you need EMC or BTOF simulators

---

## Embedding vs STARSIM

* **STARSIM**: generate events + run detector simulation. Useful for detector-response studies, but it does **not** automatically capture real run conditions.
* **Embedding**: inject signal into real events → captures the messy real world (dead channels, vertex profile, pileup), and is the go-to for final efficiency corrections.

Background context:

* GEANT3 / GEANT4 are the underlying particle-transport tools; GEANT4 is commonly used where more detailed calorimeter modeling is needed.

---

## Extras

### Requests, status, and coordination

* Embedding request / existing samples list (STAR internal): [https://drupal.star.bnl.gov/STAR/starsimrequest](https://drupal.star.bnl.gov/STAR/starsimrequest)
* Embedding mailing list info (public list server page): [https://lists.bnl.gov/sympa/info/starembd-l](https://lists.bnl.gov/sympa/info/starembd-l)

### Simulation & reconstruction docs

* STAR simulation framework overview (STAR internal): [https://drupal.star.bnl.gov/STAR/comp/simu/star-simulation-framework](https://drupal.star.bnl.gov/STAR/comp/simu/star-simulation-framework)
* “Running starsim within root4star” how-to (STAR internal): [https://drupal.star.bnl.gov/STAR/comp/simu/simulation-howtos/running-starsim-within-root4star](https://drupal.star.bnl.gov/STAR/comp/simu/simulation-howtos/running-starsim-within-root4star)
* STAR reconstruction software page (STAR internal): [https://drupal.star.bnl.gov/STAR/comp/reco/star-reconstruction-software](https://drupal.star.bnl.gov/STAR/comp/reco/star-reconstruction-software)

### Geometry tags & tools

* Production/geometry tags lookup (often STAR-protected): [https://www.star.bnl.gov/devcgi/dbProdOptionRetrv.pl](https://www.star.bnl.gov/devcgi/dbProdOptionRetrv.pl)
* A handy public tool repo that points to STAR geometry-tag resources: [https://github.com/star-bnl/star-travex](https://github.com/star-bnl/star-travex)

  * (That repo references the STAR “MCGeometry” page: [https://drupal.star.bnl.gov/STAR/comp/prod/MCGeometry](https://drupal.star.bnl.gov/STAR/comp/prod/MCGeometry))

### Generator macros directory

* STAR StarGenerator macros directory listing (doxygen-style): [https://www.star.bnl.gov/webdata/dox/html/dir_6e5f5a5c4b804c2e372f5894a2b5b4d7.html](https://www.star.bnl.gov/webdata/dox/html/dir_6e5f5a5c4b804c2e372f5894a2b5b4d7.html)

```paragraph—same content, just more “docs-y”.
```
