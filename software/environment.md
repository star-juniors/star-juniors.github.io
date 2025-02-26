---
title: Environment setup
parent: Software
---

# Environment setup

# WSL2 Install on Windows

search Windows PowerShell (right click - "Run as administrator")
Paste and run:
`wsl --install`  - it will install latest wsl2 Ubuntu version.

If there are any problems, one can download and run it from Microsoft Store : <https://www.microsoft.com/store/productId/9PDXGNCFSCZV?ocid=pdpshare>

I would also advice to install [Windows Terminal Preview](https://www.microsoft.com/store/productId/9N8G5RFZ9XK3?ocid=pdpshare)

Then reboot your laptop.

start new UBUNTU terminal, and update some packages (just copy/paste inside the new terminal):

``` bash
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
 mkdir install 
 cd install 
 wget https://root.cern/download/root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz
 tar -xzvf  root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz 
 rm  root_v6.32.08.Linux-almalinux9.4-x86_64-gcc11.4.tar.gz
 source ~/install/root/bin/thisroot.sh
 
 sudo apt-get install firefox xdg-utils sshfs -y 
 export PATH="$HOME/.local/bin:$PATH"
```

I would also recommend to update your $HOME/.bashrc file in your Home directory, one could take an example in this repository.

At least add there :

`source ~/install/root/bin/thisroot.sh`

# VS Code

Visual Studio Code <https://code.visualstudio.com/download> (please, download and install Windows version)

Then open a terminal (Ubuntu) and test it:
`code .`
I suggest also to install some additional extensions for easier work as well as login into github account inside VS Code.

### VS code extensions (inside WSL2)

``` bash
code --install-extension albertopdrf.root-file-viewer  # root trees explorer
code --install-extension GitHub.copilot # copilot
code --install-extension tomoki1207.pdf # view pdf files
code --install-extension ms-vscode.cmake-tools # for C++ highlightning
code --install-extension ms-vscode.cpptools # for C++ highlightning
code --install-extension ms-vscode.cpptools-extension-pack # for C++ highlightning
code --install-extension ms-vscode.cpptools-themes # for C++ highlightning
code --install-extension xaver.clang-format # beautify  C++ code in universal style
```

# RBrowser

To view root files by siply doucle-clicking them

link for Linux and Mac:
<https://github.com/mvranovsky/RootFileOpener>
