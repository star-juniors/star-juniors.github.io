---
title: Singularity(Apptainer) containers
parent: Tutorials
---

# How to use Singularity (Apptainer)

*Ever wanted to have all STAR framework within your laptop?
Or wanted to run your own programs with specific installation requirements on SDCC using batch system?*
Reference - [D.Smirnov presentation](https://drupal.star.bnl.gov/STAR/system/files/smirnov_star_collaboration_meeging_2022.pdf)
## On **local** PC for star infrastructure

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

![alt text](/img/container.png)

## On remote **SDCC** for your own progams

An example of usage of latest ROOT 6 to run a bash sell inside the container.
More info here - [quick_start](https://apptainer.org/docs/user/main/quick_start.html)

```bash
singularity pull docker://rootproject/root
singularity shell --bind /gpfs01/star/pwg:/gpfs01/star/pwg root_latest.sif 
```

![alt text](/img/singularity_sdcc.png)
