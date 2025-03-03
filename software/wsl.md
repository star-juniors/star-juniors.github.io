---
title: WSL (Windows Subsystem for Linux)
parent: Software
---

# WSL2 Install on Windows


![alt text](/img/mywsl.png)


It is strongly suggested to use WSL2 if you are using Windows. It is somewhat similar to Virtual Machine but with much better optimization and incorporation into Windows. Not Dual boot, not VM, not powershell, just WSL2.




search Windows PowerShell (right click - "Run as administrator")
Paste and run:
`wsl --install`  - it will install latest wsl2 Ubuntu version.

If there are any problems, one can download and run it from Microsoft Store
[Ubuntu in Store](https://www.microsoft.com/store/productId/9PDXGNCFSCZV?ocid=pdpshare){: .btn }


I would also advice to install [Windows Terminal Preview](https://www.microsoft.com/store/productId/9N8G5RFZ9XK3?ocid=pdpshare)

Then reboot your system.

start new UBUNTU terminal, and update some packages (just copy/paste inside the new terminal):
These are needed for ROOT program+ some tools like `firefox` and `sshfs`
```bash
cd ~
sudo apt-get install dpkg-dev cmake g++ gcc binutils libx11-dev libxpm-dev \
libxft-dev libxext-dev python3 libssl-dev \ 
gfortran libpcre3-dev \
xlibmesa-glu-dev libglew-dev libftgl-dev \
libmysqlclient-dev libfftw3-dev libcfitsio-dev \
graphviz-dev libavahi-compat-libdnssd-dev \
libldap2-dev python3-dev libxml2-dev libkrb5-dev \
libgsl0-dev qtwebengine5-dev -y 

 cd ~
 mkdir -p install 
 cd install 
 wget https://root.cern/download/root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz
 tar -xzvf  root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz 
 rm  root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz
 source ~/install/root/bin/thisroot.sh
 
 sudo apt-get install firefox sshfs -y 
 export PATH="$HOME/.local/bin:$PATH"
  cd ~
  mkdir -p mount
```

How to make a SSH key - see [here](/how-tos/generate_keys.md)

I would also recommend to update your `$HOME/.bashrc` which is run every time you start a new terminal:

```bash
if [ -z "$SSH_AUTH_SOCK" ] ; then
    eval `ssh-agent -s`
    ssh-add /.ssh/your_private_key # this is for WSL only   
fi
source ~/install/root/bin/thisroot.sh # ROOT

alias starmount='sshfs -o allow_root prozorov@sftp.sdcc.bnl.gov:/gpfs01/star/pwg/prozorov ~/mount' # alias for mounting STAR 
```

