---
title: Containers
parent: Tutorials
---

# How to use Singularity (= Apptainer)

Here is the README file for containers for star-software , read the section containers
[https://github.com/star-bnl/star-sw/blob/main/docs/index.md#containers](https://github.com/star-bnl/star-sw)

To sum up, just run this command:

``` bash
apptainer run docker://ghcr.io/star-bnl/star-sw:main-root5-gcc485 bash -l
```

Then you can compile your  StRoot files using `cons` command as in RCF.

Here is a link for how to install singularity on your local laptop:
[https://apptainer.org/docs/admin/main/installation.html](here)

Apptainer (formerly Singularity) in short:

``` bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:apptainer/ppa
sudo apt update
sudo apt install -y apptainer
```

How to partially clone STAR repository git
[https://github.com/star-bnl/star-git-tools](star git tools)
