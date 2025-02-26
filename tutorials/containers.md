---
title: Containers
parent: Tutorials
---
## How to use Singularity (= Apptainer)

### On **local** PC for star infrastructure

Here is the README file for containers for star-software , read the section containers
[https://github.com/star-bnl/star-sw/](https://github.com/star-bnl/star-sw/blob/main/docs/index.md#containers)

To sum up, just run this command:

``` bash
apptainer run docker://ghcr.io/star-bnl/star-sw:main-root5-gcc485 bash -l
```

Then you can compile your  StRoot files using `cons` command as in RCF.

Here is a link for how to install singularity on your local laptop:
[here](https://apptainer.org/docs/admin/main/installation.html)

Apptainer (formerly Singularity) in short:

``` bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:apptainer/ppa
sudo apt update
sudo apt install -y apptainer
```

How to partially clone STAR repository git
[star git tools](https://github.com/star-bnl/star-git-tools)

### On **SDCC** for your own progams

An example of usage latest ROOT 6 to execute a script `my_script.sh` inside the container.

```bash
#!/bin/bash
singularity pull docker://rootproject/root
singularity exec --bind /gpfs01/star/pwg:/gpfs01/star/pwg root_latest.sif /bin/sh my_script.sh
```
