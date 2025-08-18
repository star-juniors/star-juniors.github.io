---
title: Root (CERN)
parent: Tutorials
---

# ROOT training for STAR/EIC workshop

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/aprozo/binder_cern_root/main?urlpath=git-pull%3Frepo%3Dhttps%253A%252F%252Fgithub.com%252Faprozo%252Froot_workshop%26urlpath%3Dtree%252Froot_workshop%252F%26branch%3Dmain)
[![Github Codespace](https://img.shields.io/badge/open-GH_Codespaces-blue?logo=github)](https://codespaces.new/aprozo/root_workshop?quickstart=1)

This is a self-contained tutorial for STAR/EIC workshop aimed at learning some ROOT basics

---

## I like to run it on my own system

- Git clone this repo:

```bash
git clone https://github.com/aprozo/root_workshop
```

- One needs to install [ROOT](https://root.cern/install/)

- Then install some additional packages with

```bash
sudo apt-get update && apt-get install -y git python3-pip
python3 -m pip install --upgrade wheel jupyter metakernel dask distributed pyspark
```

- After it run

```bash
root --notebook
```

---

Part of the material has been reused from:

- <https://github.com/root-project/training>
- <https://github.com/root-project/software-carpentry>

If facing a problem with ROOT kernel [ROOT C++ kernel](https://github.com/root-project/root/tree/master/bindings/jupyroot), one has to run it in terminal

```bash
mkdir -p  ~/.local/share/jupyter/kernels
cp -r $ROOTSYS/etc/notebook/kernels/root ~/.local/share/jupyter/kernels
jupyter notebook --allow-root
```

Then, wait untill the page is reloaded and choose Jupyter Kernel -> ROOT
