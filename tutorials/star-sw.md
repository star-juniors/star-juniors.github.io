---
title: StRoot tutorial (beta)
parent: Tutorials
---

# STAR Tutorial [![Github Codespace](https://img.shields.io/badge/open-GH_Codespaces-blue?logo=github)](https://codespaces.new/aprozo/star-tutorial?quickstart=1)


This is an example analysis of [`StPicoDst`](https://www.star.bnl.gov/webdata/dox/html/classStPicoDstMaker.html):
- `St` stands for STAR, [all classes](https://www.star.bnl.gov/webdata/dox/html/annotated.html) start from it 
- `Pico` means the tree data format where only small number of numerous qualities are saved, exist also `Micro` and `Mini`,
- `Dst` means Data Summary Table)


It is based on [Grigory's presentation on PicoDst 2019](https://drupal.star.bnl.gov/STAR/system/files/Nigmatkulov_intro2pico_Krakow2019.pdf)

## Introduction

The star-sw version is [here](https://github.com/star-bnl/star-sw), which corresponds to the latest version `star pro` with compiler `gcc4.85` and `ROOT 5.34` version.

STAR uses [`cons` command](https://www.gnu.org/software/cons/stable/cons.html) to compile. This is similar to compiling projects using `Make` file or performing `g++` command within complex `C++` projects (whic STAR is).
The `cons` command will:
- create a directory `.sl7X_gccXX` where all compiled libraries will go which are used in your project
- perform compilation of all your files with `.cxx`(important!) and connected headers `.h` under `StRoot` directory.

 
## Run instructions:
1. First, you'll need to enter the container, for that, type:
```bash
star-shell
```
2. To compile a project, perform `cons` command
```bash
cons
```
3. Now, one can run event analysis macro using
```bash
root -l -b macros/runPicoDstAnalysisMaker.C
```
It will create a `.root` file with your TTree and some QA histograms. If you are interested what are these [ROOT flags](https://root.cern.ch/root/html534/guides/users-guide/ROOTUsersGuide.html#start-and-quit-a-root-session) : `-l` - no splash screen, `-b` - stands for batchmode (no pictures showed), `-q` - quit after executing.

4. Now, one can perform your analysis on this newly created TTree with compiled (!) macro - notice `+` at the end
```bash
root -l -b -q macros/readMyTreeEvent.C+
```



### Some old presentation on DST tutorials:

- [Introduction to PicoDst](https://drupal.star.bnl.gov/STAR/system/files/Nigmatkulov_intro2pico_Krakow2019.pdf) (Grigory Nigmatkulov, 2019)
- Introduction to MuDst:
  - [Starting Data Analysis on STAR](http://nuclear.ucdavis.edu/~brovko/GettingStarted.pdf) (Samantha Brovko, 2011)
  - [A common-MuDst tutorial](https://www.star.bnl.gov/public/comp/meet/RM200311/MuDstTutorial.pdf) (Sergey Panitkin, 2003)
