---
title: Beginner Glossary
---
inspired by Rob Líčeník, modified by Alexandr Prozorov

# STAR Beginner Glossary

A practical dictionary of STAR terms for new students working at SDCC/RCF.

---

## Preface

If you are reading this, you are probably a new student who has recently joined the STAR collaboration and are still trying to understand how things work: what people are talking about, which tools you should use, and where to look for help. This glossary was created to make your first steps easier.

It collects basic terms from:

* the physics done at STAR,
* the structure of the collaboration,
* the software and computing infrastructure.

You do not need deep previous experience, but it helps if you:

* paid some attention in a basic subatomic/particle physics course,
* know a few basics of C/C++ (what an array, class, header, function, library, pointer, loop, and if-statement are).

Because STAR is an international collaboration (especially US–China–Europe), all important terms appear in English, and you will see them in English in talks, emails, and documentation. Therefore, we define them in English and explain them in plain language.

The glossary is not perfect or complete. Expect gaps and occasional mistakes. Feedback and suggestions for new entries are welcome.

---

### 2FA (MFA) – Two-Factor(Multi-Factor) Authentication

Two-Factor Authentication is an extra security layer used for logging in to services such as the STAR web pages (Drupal) and sometimes SDCC services.
Instead of only `username + password`, you also enter a one-time code from an authenticator app on your phone. 2FA has been mandatory for STAR Drupal since 2020.

---

## A

### Abstract

A short text (usually up to half a page) summarizing the content and main results of a talk or paper.
For conferences, you must submit an abstract first through the STAR Drupal interface; it is reviewed by your supervisor, your PWG conveners, and then by the STAR Talks Committee. Only after sign-off can you submit it to the conference.

### Analysis Meeting

A shorter, more focused meeting than a full Collaboration Meeting. Usually only PWG sessions, often online or a few days long. Used to:

* review detailed analysis progress,
* prepare for major conferences,
* coordinate within a PWG.

### Analysis Note (AN)

An internal document (often ~100+ pages) that fully documents an analysis. It should:

* describe all steps, cuts, and methods,
* justify choices,
* show supporting plots, tables, and references.

It is used during PWG, GPC, and collaboration review stages. It is not a journal publication, so formatting rules are looser, but it must be clear and reproducible. You should start your AN early and keep it updated.

### Azimuth / Azimuthal Angle (φ)

The angle in the plane perpendicular to the beam axis. At STAR:

* the beam runs along the **z-axis**,
* φ is measured in radians from −π to +π in the transverse plane.

Because the detector and collisions are approximately symmetric in φ, most results are integrated over φ and divided by 2π, unless you are doing azimuthal correlations or flow.

---

## B

### Bad Run List

A list of run numbers that should be excluded from the analysis. Reasons include:

* no events,
* missing or problematic detectors,
* no relevant triggers,
* strong deviations in key quantities (multiplicity, vertex position, mean pT, etc.),
* technical problems with files or data taking.

Bad run lists are usually dataset-specific and are often prepared by someone else already. You should reuse the recommended list for your dataset.

### BBC – Beam–Beam Counter

Beam-Beam Counter (BBC) array for the Solenodial Tracker at RHIC (STAR) is a very versatile tool for polarized proton beam diagnostics. 
he BBC setup provides an excellent minimum bias trigger; and for hits on the inner annuli of six hexagonal scintillator tiles the BBC coincidence trigger with a suitable algorithm 
has a quite large single spin analyzing power ˜8×10-3 for 100 GeV polarized proton -100 GeV polarized proton collisions. 
The STAR BBC is a very effective local polarimeter at these energies. 

### BEMC – Barrel Electromagnetic Calorimeter

The main barrel EM calorimeter at STAR. Key points:

* 4800 towers (40 in pseudorapidity × 120 in azimuth),
* covers full azimuth and |η| < 1,
* built from layers of lead and plastic scintillator,
* used for EM energy measurement (electrons, photons),
* supports High Tower triggers (online selection of high-energy signals) like BHT{0,1,2} or JetPatch JP{0,1,2}.

Electrons deposit almost all their energy → E/p ≈ 1, while hadrons have E/p < 1. BEMC is essential for electron and jet analyses.

---

## C

### Centrality

A measure of how “head-on” a nucleus–nucleus collision is (how much the two nuclei overlap). Determined experimentally via some proxy, at STAR typically:

* reference multiplicity (number of tracks) in a given region.

Examples:

* 0–10%: most central collisions, highest overlap, strongest QGP effects,
* 60–80%: very peripheral, fewer participants, lower multiplicity, proton-like collisions.

Events above ~80% are usually not used because their geometry and participant number are poorly constrained.

### Collaboration Meeting

A ~5-day meeting of the whole STAR collaboration, usually every ~6 months, often in person. March meetings happen at BNL. Typical structure:

* Juniors’ Day,
* 1–2 days of PWG parallel sessions,
* plenary sessions with overview and highlight talks,
* social events (collaboration dinner, excursions).

Students should attend if possible; it is important for visibility and for understanding what the collaboration is doing.

### Collaboration Review

The final STAR internal review of an analysis before journal submission. After:

* PWG approval,
* GPC approval,

the draft paper and AN are reviewed by members of several institutions. They provide comments and questions; the analysis team must address them before sending the paper to a journal.

### Compilation

Translating your C/C++ source code into machine instructions. At STAR:

* building your analysis code on RCF with `cons` under `StRoot/`,
* generates shared libraries (e.g. `.sl73_gcc485/…`).

Compiled code runs much faster than interpreted macros, which matters for large event samples. ROOT can compile macros “on the fly” using:

```bash
root -l myMacro.C+
```

### Condor (HTCondor)

The job scheduler used at SDCC for batch jobs. Key commands:

* `condor_q` – show your jobs in the queue,
* `condor_rm <username or jobid>` – remove jobs.

Jobs are submitted by scripts or wrappers; Condor handles where and when they run.

### Conveners

Physicists who coordinate the work of a PWG. They:

* organize and chair weekly PWG meetings,
* approve abstracts, talks, and proceedings from the PWG,
* help guide paper preparation,
* represent the PWG within STAR.

There are usually 2–3 conveners per PWG. They are good contact points for questions about analysis standards and PWG expectations.

### Coordinates

Ways to describe positions and directions.

At STAR we commonly use:

* **Cartesian coordinates (x, y, z)** – detector-centered:

  * z along the beam,
  * x horizontal,
  * y vertical.
* **Cylindrical coordinates (r, φ, z)**:

  * r = distance from z-axis in the transverse plane,
  * φ = azimuthal angle around beam line.

For momenta we often use:

* transverse momentum pT,
* pseudorapidity η,
* sometimes rapidity y.

### Council

The STAR Council is the governing body of the collaboration. It:

* consists of one representative per member institution,
* makes major decisions (e.g. electing the Spokesperson(s) every three years),
* sets collaboration policies.

### Cut

A selection criterion in an analysis, used to:

* reduce background,
* ensure good quality events or tracks.

Examples:

* event cuts: vertex z position, trigger, centrality,
* track cuts: pT range, |η| range, number of TPC hits, DCA limits.

Cuts can be applied directly in code:

```cpp
if (variable < lowerCut) continue;
```

For complicated logic, it is better to put them into utility functions (e.g. `bool isGoodTrack(...)`).

### CVS – Concurrent Versions System

A version control system used historically to store official STAR software. Many old codes still live in CVS. You can:

* browse via the protected web interface,
* check out code to RCF with `cvs co <path>` (after `aklog`).

Newer development tends to be elsewhere (e.g. Git), but many core packages remain in CVS.

---

## D

### DAQ – Data Acquisition

The system that reads the detector signals and converts them into digital data stored on disk. It includes:

* front-end electronics,
* signal conditioning,
* analog-to-digital conversion (ADC),
* data formatting and recording.

The output of DAQ is later reconstructed into higher-level objects like tracks and vertices.

### Data-Driven Method

A method that uses real data rather than simulation or models as the main input. Benefits:

* fewer model assumptions,
* often faster and more robust.

Example: measuring detector matching efficiency directly from data instead of relying on GEANT simulation.

### Dataset

A collection of data files belonging together and described by:

* collision system and energy (e.g. Au+Au 200 GeV),
* run period (e.g. Run14),
* production tag (e.g. P18ih),
* data format (e.g. picoDst),
* possibly luminosity class.

At STAR, dataset composition and file lists are documented on production pages; file lists can be generated with `get_file_list.pl`.

### DCA – Distance of Closest Approach

The smallest distance between:

* two tracks, or
* a track and a vertex (often the primary vertex).

Used heavily in:

* vertexing and decay reconstruction,
* separating primary tracks (small DCA to PV) from decay products or background (larger DCA).

### Decay Length

The distance a particle travels before decaying in the lab frame. On average:

* λ = βγ c τ, where τ is the proper lifetime.

In analyses, decay length distributions are used to:

* reconstruct short-lived particles (e.g. D⁰, Λ, etc.),
* separate prompt and non-prompt components.

### Distributed Disk

A disk system where data are spread over many servers but accessed as if it were one logical storage. In STAR/SDCC context, large picoDst samples on “local” storage accessed via xrootd are an example. See also **GPFS** and **HPSS** for other storage types.

### Drupal

A web content management framework. STAR uses a large Drupal instance as the main collaboration portal:

* documentation,
* PWG pages,
* analysis notes and internal talks,
* conference contributions,
* Juniors page and various tools.

Most content is behind login and 2FA.

---

## E

### EEMC – Endcap Electromagnetic Calorimeter

Forward EM calorimeter at STAR, covering high pseudorapidity on one side of the detector. It:

* measures electromagnetic showers (photons, electrons),
* is used in certain forward physics analyses.

### Embedding

A technique to study detector acceptance and reconstruction efficiency in realistic environments. Steps:

1. Simulate signal (e.g. particle, jet) with GEANT.
2. Embed (add) the simulated signal into real low-bias data events.
3. Reconstruct the mixed event.
4. Compare reconstructed and true properties to extract efficiency.

Used widely for heavy-ion and jet analyses.

### EPD – Event Plane Detector

Forward detector on both sides of STAR used to:

* estimate the event plane (orientation of the collision in azimuth),
* provide centrality information,
* contribute to triggers.

Built from scintillator tiles; essential for flow analyses and some triggers.

### ETOF – Endcap Time-of-Flight Detector

Forward time-of-flight detector, an extension of the barrel TOF system. It:

* measures particle arrival times,
* improves PID at forward rapidities,
* serves as a prototype for CBM at FAIR.

### Event

One recorded collision. Each event has:

* run number and unique event ID,
* primary vertex and possibly other vertices,
* lists of tracks, hits, detector signals, etc.

Analyses usually loop over events and then over tracks in each event.

---

## F

### FastSim

“Fast Simulation”: a simplified simulation approach that approximates detector response without a full GEANT run. Often:

* smears true tracks according to resolutions,
* applies parameterized efficiencies.

Used for quick studies or feasibility checks.

### Flow

Collective motion of particles in the transverse plane, often quantified by Fourier coefficients v₁, v₂, … of the azimuthal distribution. Important for:

* studying QGP properties,
* initial geometry fluctuations.

Measured using correlations with the event plane (e.g. from EPD) or multi-particle methods.

---

## G

### GEANT

A widely used toolkit for simulating particle passage through matter and detectors. STAR uses GEANT-based simulations to:

* model detector geometry and materials,
* simulate energy loss, showers, and detector signals,
* generate realistic simulated events for embedding and other studies.

### Getter

A C++ method used to read (get) a value from a class or object, usually named like `GetX()` or `x()` and declared `const`. Used heavily in STAR classes (e.g. `track->gMom()`) to access internal data safely.

### Glauber Model

A model of nuclear geometry used to describe heavy-ion collisions. It:

* models nuclei as distributions of nucleons,
* simulates multiple nucleon–nucleon collisions,
* provides estimates of:

  * number of participants (Npart),
  * number of binary collisions (Ncoll).

Used to define centrality and normalize quantities like R_AA and R_CP.

### GPC – Godparent Committee

A committee that oversees the review of a given analysis during the PWG → paper pipeline. GPC members:

* read the analysis note and draft,
* ask detailed questions,
* ensure analysis quality before collaboration review.

### GPFS – General Parallel File System

A distributed parallel filesystem used at SDCC, usually visible as `gpfs01`. Characteristics:

* large capacity,
* high throughput,
* shared among users.

Most production analyses store data and output on GPFS.

---

## H

### Hadronic Correction (Towers)

Procedure to avoid double-counting charged hadrons when combining TPC tracks and calorimeter towers (BEMC/EEMC).
Tracks pointing to a tower are matched, their expected energy contribution is subtracted from the raw tower energy, and the corrected tower energy (clipped at ≥ 0) is then used. After this, tracks represent charged energy, corrected towers represent mostly neutral energy.

### Hard Processes

Partonic scatterings involving large momentum transfer Q², calculable in perturbative QCD. They:

* produce high-pT jets, heavy quarks, direct photons, etc.,
* happen early in the collision,
* are important for QGP probes (energy loss, modification).

### Heavy Flavor

Quarks heavier than up/down/strange: charm (c) and bottom (b). In STAR:

* produced mostly in initial hard scatterings,
* used as probes of the QGP via:

  * D and B mesons,
  * heavy-flavor electrons and muons.

### Heavy Flavor Tracker (HFT)

A high-resolution silicon vertex detector formerly used at STAR (now decommissioned). It:

* improved impact parameter and secondary vertex resolution,
* enabled precise reconstruction of charm hadron decays.

### HIJING

A Monte Carlo event generator for high-energy nuclear collisions. It:

* models hard and soft processes,
* includes multiple minijet production and nuclear effects.

Used to generate simulated heavy-ion events.

### HPSS – High Performance Storage System

Tape-based long-term storage at SDCC. Features:

* very large capacity,
* slower access (staging from tape),
* used for older or less frequently accessed datasets.

### HyperNews

An older web-based discussion and mailing interface used in many HEP experiments. In STAR, most communication has moved to Mattermost and “normal” mailing lists, but you may still see references to HyperNews in old notes.

---

## I

### Institution

A university or lab that is a member of the STAR Collaboration. Each institution:

* has a Council representative,
* may have local STAR group leaders,
* is associated with its students’ and postdocs’ affiliation and disk quotas.

### Inverse Barn (1/b, 1/nb, 1/pb)

Unit of integrated luminosity. A barn (b) is a unit of cross section; “inverse barn” measures how much collision exposure the experiment has collected. Higher integrated luminosity means more events and better statistics for rare processes.

### iTPC – Inner TPC Upgrade

An upgrade of the inner sectors of the TPC:

* more pad rows and improved coverage,
* better tracking and dE/dx performance,
* extends pseudorapidity reach and overall TPC quality.

---

## J

### Jet

A collimated spray of hadrons originating from a high-energy quark or gluon. In analyses:

* reconstructed with jet algorithms (anti-kT, etc.),
* used as probes of parton energy loss and QCD dynamics.

### Job

A unit of work submitted to the batch system (Condor) at RCF. A job typically:

* reads a subset of input files,
* processes events,
* writes output histograms or trees.

### Journal

A scientific journal where papers are submitted (e.g. PRL, PRC, PLB, JHEP, etc.). After STAR’s internal reviews, the final analysis paper is sent to a journal for external peer review and publication.

### Junior

Informal term for early-career members: students and postdocs. STAR Juniors is a community focused on:

* support,
* tutorials,
* improving documentation and onboarding.

---

## L

### Library

A named version of the STAR software stack used to produce or analyze data, e.g.:

* `SL22b`, `SL20c`, etc.

The library version is tied to specific productions; you must use a compatible library for analyses to avoid mismatches.

### Luminosity

Quantity describing how many collisions happen per unit time and area:

* **instantaneous luminosity**: collisions per area per time,
* **integrated luminosity**: total accumulated exposure over time.

Integrated luminosity is crucial for estimating yields of rare processes and normalizing cross sections.

---

## M

### Macro

A small C++ (or ROOT C++) script, often with extension `.C` and possibly a `+` for compilation. Used for:

* quick tests,
* plotting,
* small analyses.

ROOT can interpret or compile macros.

### Mailing Lists

Email lists used for communication within STAR. Examples:

* PWG mailing lists,
* software/infrastructure lists,
* STAR Juniors list.

You must subscribe to the relevant lists (via STAR web pages) to receive important announcements.

### Maker

In STAR’s framework, a **Maker** is a C++ class derived from `StMaker` that performs a specific task in the analysis chain:

* reading input,
* reconstructing entities,
* filling histograms.

Your main analysis code is usually implemented as a custom Maker.

### Mattermost

The primary chat system for STAR:
[https://chat.sdcc.bnl.gov/](https://chat.sdcc.bnl.gov/)

Used for:

* quick questions and support (Software and Infrastructure channel),
* STAR Juniors,
* private messages.

Login is via SDCC account.

### Minimum-Bias (MB)

A trigger configuration designed to record as unbiased a sample of inelastic collisions as possible. MB data:

* are used as reference distributions,
* often serve as embedding backgrounds.

### Mixed Events

A technique to estimate combinatorial background by combining tracks or objects from different events. Because mixed events have no true correlations, they approximate purely random combinations and help remove background from signal distributions.

### MTD – Muon Telescope Detector

A detector system at STAR used for muon identification, located outside the magnet and steel. It:

* detects penetrating muons,
* is used in quarkonium and heavy-flavor muon analyses.

### MuDst

An older, more detailed data format at STAR, storing reconstructed objects. Heavier than picoDst but containing more information. Many modern analyses use picoDst instead, but older ones may still rely on MuDst.

### Multiplicity

Number of particles in an event, usually:

* charged track multiplicity in some η and pT range.

Used for:

* centrality determination,
* event classification,
* understanding event activity.

---

## N

### NFS – Network File System

A shared disk system mounted as a normal filesystem on SDCC machines. Files on NFS appear under regular paths; access is straightforward but capacity and performance can be more limited than GPFS for huge datasets.

### nHitsFit

Number of TPC hits used in the track fit. A higher nHitsFit generally means a better-quality track. Analyses often require:

* minimum nHitsFit,
* ratio `nHitsFit / nHitsPossible` above some threshold.

### Normalization

The process of scaling histograms or yields to a common basis, such as:

* per event,
* per participant,
* per unit rapidity,
* per binary collision (for R_AA / R_CP).

Correct normalization is essential for comparing different datasets or systems.

### nSigma

Number of standard deviations a measured PID variable (e.g. dE/dx in TPC) is away from the expected value for a given particle species, e.g. `nSigma_e`, `nSigma_pi`. Used for particle identification:

* |nSigma| < cut → candidate of a given type.

---

## P

### PA – Paper Author 

Within STAR documents, “PA” often refers to the main analysis paper contact person

### Paper

The final journal publication describing an analysis. Before submission:

* PWG,
* GPC,

must approve the content. Papers are often accompanied by an internal Analysis Note.

### PHENIX

Another experiment at RHIC. PHENIX results are frequently compared with STAR’s to understand systematics and cross-check measurements.

### PicoDst

A compact data format at STAR optimized for analysis. Compared to MuDst:

* smaller files,
* only most relevant information kept.

Most modern analyses use picoDst.

### Pile-up

Multiple collisions recorded on top of each other in a single readout window (due to high ~80ns TPC window). More than one vertex in the same event (“multiple PVs”), or extra tracks from earlier/later bunch crossings drifting through the TPC during the readout.
Pile-up distorts multiplicities, vertex distributions, and detector occupancies, and can fake or dilute physics signals. Analyses usually suppress pile-up with vertex selection (choosing a single “good” PV), event-quality cuts, and consistency checks between different multiplicity or timing detectors (e.g. TPC vs. TOF/VPD).
BBC detector (flat) distribution can depict pile-up. Resolved by using |v_z(tpc) - v_z(vpd)| < cut, global DCA cut, or using fast detecros such as BEMS and TOF which have ps resolution.

### Preliminary

Label for results that are not yet final or published. Preliminary results:

* can be shown internally or at conferences (with approval),
* may change as analysis is refined.

Final, published results should not be labeled “preliminary”.

### Presentation

A talk (usually slides) given at:

* PWG meeting,
* Collaboration Meeting,
* conference.

STAR internal presentations are usually uploaded to Drupal as “Blog entry” or STAR Contribution entries.

### Primary Vertex (PV)

The reconstructed point in space where the main collision happened. Tracks associated with the PV are called:

* primary tracks.

Short-lived particles decay away from the PV, generating secondary vertices.

### Proceedings

Written summary of a conference contribution, usually a short paper associated with a talk or poster. Often required by conference organizers; must be approved within STAR similarly to other outputs.

### Production

A specific reconstruction campaign of raw data into higher-level formats (e.g. picoDst). Characterized by:

* production tag (`P12id`, `P18ih`, …),
* STAR software library version used.

When you say “Run14 Au+Au P18ih picoDst”, you specify both dataset and production.

### protected

A [special password](https://drupal.star.bnl.gov/STAR/comp/sofi/web-access#comment-897) combination for accessing certain internal STAR web pages (e.g. CVS web viewer). The credentials are confidential and must not be shared publicly. In order to see it, user has to be logged in.

### Pseudorapidity (η)

A coordinate related to the polar angle θ with respect to the beam axis:

* η = −ln[tan(θ/2)].

Useful because many distributions are approximately flat in η; also convenient for relativistic kinematics. Detector coverage is often expressed in terms of η.

### PWG – Physics Working Group

Group of collaborators focusing on a specific physics area (e.g. jets, heavy flavor, flow). For each PWG:

* regular weekly meetings,
* conveners,
* mailing list, Drupal pages, Mattermost channel.

Your analysis belongs to one (or a few) PWGs.

### PWGC – PWG Conveners’ Committee

A body coordinating across PWGs:

* harmonizes procedures,
* discusses conflicts or cross-group issues,
* interfaces with STAR management on analysis matters.

### [PYTHIA](https://pythia.org/)

A general-purpose event generator for proton–proton and  simple related collisions. Used for:

* reference distributions,
* jet studies,
* embedding signal generation
* not used for Heavy ions

---

## Q

### QA – Quality Assurance

Procedures and plots used to ensure data quality and stable detector performance. QA often includes:

* checking distributions vs. run, day, etc.,
* identifying problematic runs or periods,
* defining bad run lists.

### Quark Matter

A major international conference series on heavy-ion physics. STAR frequently submits results to Quark Matter; internal review timelines are often aligned with QM deadlines.

---

## R

### R_AA

Nuclear modification factor:

* R_AA = (yield in A+A) / (Ncoll × yield in p+p).

Measures how particle production in nucleus–nucleus collisions differs from a scaled expectation based on p+p. Values significantly below 1 indicate suppression (e.g. from energy loss in QGP).

### Rapidity (y)

A kinematic variable related to energy and momentum along the beam direction. For particles with mass, rapidity is more natural than pseudorapidity in some analyses. It transforms additively (Lorentz-invariant) under boosts along the beam.

### RCF – RHIC Computing Facility

The main computing center at BNL for STAR and other RHIC experiments. You:

* log in via SSH to `ssh.sdcc.bnl.gov`,
* run batch jobs via Condor,
* store data on GPFS or other disks.

Sometimes “RCF” and “SDCC” are used interchangeably in informal speech.

### R_CP

Central-to-peripheral nuclear modification factor:

* R_CP = (yield in central / Ncoll_central) / (yield in peripheral / Ncoll_peripheral).

Compares central and peripheral heavy-ion collisions without explicit p+p reference.

### ROOT

A data analysis framework from CERN, used heavily in STAR. It provides:

* I/O (ROOT files, TTrees),
* histograms, fitting, plotting,
* C++ interpreter and macro mechanism.

Almost all STAR analysis code is ROOT-based.

### run (lowercase)

A single data-taking segment, typically ~30 minutes long, with its own **run number** (e.g. 17319001). Used to organize data, bad run lists, and QA.

### Run (capital R)

A data-taking campaign at RHIC lasting several months. Example:

* Run17 – collider running in 2017.

Each Run has multiple subsystems, energies, and datasets.

---

## S

### [Scheduler (SUMS)](https://www.star.bnl.gov/public/comp/Grid/scheduler/manual.htm)

Software responsible for managing batch jobs on a cluster. At SDCC, this is Condor. It:

* queues jobs,
* distributes them to worker nodes,
* handles priorities and resource usage.

### Script

A small program (often in shell, Python, or similar) written to automate tasks:

* submitting jobs,
* generating file lists,
* post-processing outputs.

Scripts are essential for managing large analyses.

### Secondary Vertex (SV)

A reconstructed point where a particle decays away from the primary vertex. SV reconstruction is crucial for:

* identifying charm and strange hadron decays,
* separating prompt and non-prompt components.

### Setter

A C++ method used to set (change) a value in an object, typically named `SetX(...)`. In STAR code, setters are used to configure Maker parameters, object fields, etc.

### Shifts

Operational duties taken by collaborators to monitor the experiment (during running) or offline systems. Even if you are remote, you may be asked to perform “offline shifts” (e.g. monitoring QA).

### Signed DCA (Tracks)

DCA is the shortest distance between a track and a reference point (usually the primary vertex). Signed DCA keeps the magnitude of this distance but adds a sign based on track geometry relative to a chosen reference (e.g. vertex, jet axis, magnetic field). This preserves “which side” information, allowing better separation of different track topologies than |DCA| alone.

### Slow Controls

Systems that monitor and control detector conditions that change slowly:

* temperatures,
* voltages,
* gas flows.

Slow controls ensure detectors operate safely and within specifications.

### Small System

Collisions involving at least one small projectile, e.g.:

* p+p,
* p+Au,
* d+Au,
* He3+Au.

Used to study initial-state effects and compare with large systems like Au+Au.

### Source Code

Human-readable code written in a programming language (C++, Python, …). At STAR:

* analysis code lives in `StRoot` (C++),
* macros and scripts in separate directories.

Source code is compiled (C++) or interpreted (Python, ROOT macros) to perform analyses.

### Spectrum

Distribution of a physical quantity, commonly:

* pT spectrum,
* invariant mass spectrum,
* energy spectrum.

Spectra are typically shown as histograms and used to extract yields or compare with models.

### Spokesperson

The elected scientific leader of the STAR Collaboration. Responsibilities include:

* representing STAR externally,
* coordinating collaboration-level decisions,
* working with Council and management on strategy.

### Starsim

STAR’s simulation framework built on top of GEANT and STAR software. Used to:

* simulate detector response,
* produce simulated data samples for embedding and standalone studies.

### StarSoft

The collective name for official STAR software packages:

* reconstruction,
* simulation,
* analysis frameworks.

Most of StarSoft is stored in CVS.

### StarTalks

The STAR Talks Committee and associated infrastructure reviewing and coordinating:

* conference abstracts,
* talks,
* posters.

Abstracts and slides go through StarTalks as part of the internal approval process.

### STAR Library (SLxx)

The compiled STAR software release used for reconstruction and analysis, e.g.:

* `SL22b`.

Different productions are tied to specific SL versions.

### StRoot

Top-level directory in your STAR working area containing:

* source code for Makers,
* user analysis code,
* build products (via `cons`).

When you add a new Maker, you place its code under `StRoot`.

### Submitter

A person who uploads an abstract, talk, poster, or proceedings to Drupal on behalf of an analysis. Often the main analyst or presenter.

### Systematic Errors / Systematic Uncertainties

Uncertainties in a measurement that arise from:

* analysis choices (cuts, fitting ranges),
* detector effects,
* modeling assumptions.

Unlike statistical errors, systematics do not decrease simply by adding more data. They must be evaluated by varying assumptions and methods.

---

## T

### TMVA

Toolkit for Multivariate Data Analysis, part of ROOT. Provides machine-learning methods:

* decision trees,
* boosted trees,
* neural networks,

used for classification/regression in physics analyses (e.g. signal vs. background).

### TPC – Time Projection Chamber

The main tracking detector at STAR. It:

* measures charged particle trajectories in the magnetic field,
* provides dE/dx for particle identification,
* covers large pseudorapidity and full azimuth.

### TOF – Time-of-Flight Detector

Detector surrounding the TPC, measuring particle arrival times. Combined with track length and momentum, TOF provides:

* particle mass,
* improved PID over a wide pT range.

### Tower

Basic cell of an EM calorimeter (BEMC, EEMC). Each tower:

* corresponds to a finite region in η–φ,
* records energy deposited by particles.

Tower energies are used for triggers, jet reconstruction, and electron/photon identification.

### Track

Reconstructed trajectory of a charged particle passing through tracking detectors (TPC, iTPC). Tracks have:

* momentum,
* dE/dx,
* number of hits,
* DCA, etc.

Most analyses loop over tracks inside each event.

### Transverse Momentum (pT)

Component of a particle’s momentum perpendicular to the beam axis. pT is central in:

* spectra,
* jet physics,
* nuclear modification factors.

### Transverse Energy (ET)

Energy component associated with the transverse plane. Defined in various ways (depending on context), often ET = E sinθ or sum over particle transverse energies.

### Trigger

Online decision logic deciding which events to record. Combines detector signals to select:

* minimum-bias events,
* high tower events,
* central events, etc.

Each trigger has a name (e.g. BHT1*VPD30, BHT2*BBCMB) and specific conditions.

---

## V

### Vertex

A point where tracks intersect, usually representing:

* primary vertex (collision point),
* secondary vertices (decays).

Vertexing is crucial for reconstructing decays and understanding event geometry.

### VPD – Vertex Position Detector

Forward detector providing precise timing signals. Used for:

* measuring start time for TOF,
* helping determine the z-position of the primary vertex,
* contributing to trigger decisions.

---

## X

### Xrootd

A high-performance, scalable data access system used to read files stored on distributed disks. At STAR:

* used to access “local” storage across many servers,
* allows jobs to stream data files efficiently without manual copying.

---

## Z

### ZDC – Zero Degree Calorimeter

Very forward calorimeter located at zero degrees relative to the beam (along the beam line), on both sides of STAR. Main roles:

* detects **neutral spectators** (mainly neutrons) from heavy-ion collisions,
* used for **centrality determination** and **event characterization**,
* provides **fast trigger signals** and can help reject non-collision background (beam–gas, noise).


