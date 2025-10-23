---
title: StRoot (beta)
parent: Tutorials
---

# [STAR Tutorial](https://github.com/aprozo/star-tutorial) [![Github Codespace](https://img.shields.io/badge/open-GH_Codespaces-blue?logo=github)](https://codespaces.new/aprozo/star-tutorial?quickstart=1) <- click

_Alexandr Prozorov_

For successfull running on Github Codespaces one can submit an application for Free [Github Education](https://github.com/education) benefits.

This is an example analysis of [`StPicoDst`](https://www.star.bnl.gov/webdata/dox/html/classStPicoDstMaker.html):
- `St` stands for STAR, [all classes](https://www.star.bnl.gov/webdata/dox/html/annotated.html) start from it 
- `Pico` means the tree data format where only small number of numerous qualities are saved, exist also `Micro` and `Mini`,
- `Dst` means Data Summary Table)


It is based on [Grigory's presentation on PicoDst 2019](https://drupal.star.bnl.gov/STAR/system/files/Nigmatkulov_intro2pico_Krakow2019.pdf)

## Introduction

The [starver](https://github.com/star-bnl/star-sw) corresponds to the latest version `star pro` with compiler `gcc4.85` and `ROOT 5.34` version.

STAR uses [`cons` command](https://www.gnu.org/software/cons/stable/cons.html) to compile. This is similar to compiling projects using `Make` file or performing `g++` command with additional libs within complex `C++` projects (whic STAR is).
The `cons` command will:
- create a directory `.sl7X_gccXX` where all compiled libraries will go which are used in your project
- perform compilation of all your files with `.cxx`(important!) and connected headers `.h` under `StRoot` directory.

## What this tutorial about?
- It will show how `StRoot` folder is used to compile your project.
- The [analysis macro](https://github.com/aprozo/star-tutorial/tree/main/macros/runPicoDstAnalysisMaker.C) will create a file with user `TTree` and `QA Histograms`
- The user defined `TTree` actually consists of classes [MyTreeEvent.h](https://github.com/aprozo/star-tutorial/tree/main/StRoot/StPicoDstAnalysisMaker/MyTreeEvent.h) and [MyTrack.h](https://github.com/aprozo/star-tutorial/tree/main/StRoot/StPicoDstAnalysisMaker/MyTrack.h)
- There is a second [standalone macro](https://github.com/aprozo/star-tutorial/macros/readMyTreeEvent.C) which does not need any STAR infrastructure - only meantioned header files [MyTreeEvent.h](https://github.com/aprozo/star-tutorial/tree/main/StRoot/StPicoDstAnalysisMaker/MyTreeEvent.h) and [MyTrack.h](https://github.com/aprozo/star-tutorial/tree/main/StRoot/StPicoDstAnalysisMaker/MyTrack.h) and can be further used for analysis on personal latptop or batchfarm.
 
## Run instructions:
1. First, you'll need to enter the STAR container, for that, type:
```bash
star-shell
```
2. To compile a project, perform `cons` command
```bash
cons
```
3. Now, one can run event analysis macro using without(!) compilation (not using `+` sign at the end)
```bash
root -l -b -q macros/runPicoDstAnalysisMaker.C
```
It will create a `.root` file with your TTree and some QA histograms. 
If you are interested what are these [ROOT flags](https://root.cern.ch/root/html534/guides/users-guide/ROOTUsersGuide.html#start-and-quit-a-root-session): 
- `-l` - no splash screen
- `-b` - stands for batchmode (no pictures showed),
- `-q` - quit after executing.

4. Now, one can perform your analysis on this newly created TTree with compiled (!) macro - notice `+` at the end
```bash
root -l -b -q macros/readMyTreeEvent.C+
```


## Some old presentation on DST tutorials:

- [Introduction to PicoDst](https://drupal.star.bnl.gov/STAR/system/files/Nigmatkulov_intro2pico_Krakow2019.pdf) (Grigory Nigmatkulov, 2019)
- [Starting Data Analysis on STAR](http://nuclear.ucdavis.edu/~brovko/GettingStarted.pdf) (Samantha Brovko, 2011)
- [A common-MuDst tutorial](https://www.star.bnl.gov/public/comp/meet/RM200311/MuDstTutorial.pdf) (Sergey Panitkin, 2003)



## Remark: Running on your own laptop
In case you want to enter and run STAR container on your own laptop:

- You need to install either [Docker engine](https://docs.docker.com/get-started/get-docker/) or [Apptainer (singularity)](https://apptainer.org/docs/admin/main/installation.html).
For simplier Apptainer (singularity) installation:
```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:apptainer/ppa
sudo apt update
sudo apt install -y apptainer
```
 - And then run commands:
```bash
git clone https://github.com/aprozo/star-tutorial.git
cd star-tutorial
apptainer run docker://ghcr.io/star-bnl/star-sw:main-root5-gcc485 bash -l
```
### Important! 
Do not forget to comment in your `~/.bashrc` sourcing your local Root installation (`source /path/thisroot.sh`), otherwise there will be a conflict of 2 ROOT versions: one - from your local installation, another - from STAR container.

- You may also create a shortcut for `star-shell` using code below:
```bash
mkdir -p ~/.local/bin && cat >~/.local/bin/star-shell <<'EOF'
#!/usr/bin/env bash
apptainer run  docker://ghcr.io/star-bnl/star-sw:main-root5-gcc485 "$@"
EOF
chmod +x ~/.local/bin/star-shell
grep -qxF 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc || echo 'export PATH="$HOME/.local/bin:$PATH"' >>~/.bashrc
export PATH="$HOME/.local/bin:$PATH"
```


