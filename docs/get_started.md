---
title: Get Started
nav_order: 2
---

# Get Started
*Alexandr Prozorov*  

## Introduction

Welcome to STAR! This is a checklist and starting point for new users joining the collaboration.

## Main Steps Checklist:

1) Join [Mattermost Software channel](https://chat.sdcc.bnl.gov/star/channels/star-software-and-infrastructure)

2) Make a [Drupal](https://drupal.star.bnl.gov/STAR/comp/sofi/facility-access/drupal-access) 2FA access via [Dmitry Arkhipkin](https://chat.sdcc.bnl.gov/bnl/messages/@dmarkh) or [Jerome Lauret](https://chat.sdcc.bnl.gov/bnl/messages/@jeromel)

3) Subscribe to mailing lists:
  * [starmail](https://lists.bnl.gov/sympa/subscribe/starmail-l)
  * [star-talks](https://lists.bnl.gov/sympa/subscribe/star-talks-l)
  * [star-juniors](https://lists.bnl.gov/sympa/subscribe/starjuniors-l/)
  * [your physics working group](https://star-juniors.github.io/#mailing-lists)
  
4) Add yourself/Check for STAR [**Phone Book**](https://www.star.bnl.gov/central/collaboration/phonebook.php) entry by writing to <a href="mailto:mogavero@bnl.gov?subject=Phonebook entry&body=Hi Liz,%0D%0A could you please add me to STAR Phonebook as %0D%0A <YOUR NAME> from %0D%0A <YOUR INSTITUTION>%0D%0A Thanks!">Liz Mogavero</a>

# Software Setup (Linux/MacOS + Windows via WSL2):
All following instructions are for Linux/MacOS users. Windows users are asked to use [WSL2](https://star-juniors.github.io/software/wsl.html) which is a Linux subsytem integrated into Windows

## 0) Preconditions
* SDCC account working with password login (first-time users must [set up their account](https://useraccount.sdcc.bnl.gov/new-user) and [add their SSH key](https://useraccount.sdcc.bnl.gov/ssh-key) manually)
* Local [OpenSSH](https://documentation.ubuntu.com/server/how-to/security/openssh-server/) client (`ssh`, `ssh-keygen`)
* Local [VS Code](https://code.visualstudio.com/download) + extension [**Remote - SSH**](vscode:extension/ms-vscode-remote.remote-ssh)

## 1) Generate an SSH key (local) and upload `.pub` to SDCC
Use RSA-4096 for generation of the key pair (if you don't have one already):

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -b 4096 -t rsa -f ~/.ssh/id_rsa
```
After generating, [upload](https://useraccount.sdcc.bnl.gov/ssh-key) it to SDCC in order to connect to `ssh.sdcc.bnl.gov` gateway if it has not been done.

### Copy-paste script (local)
Now, add your public key to SDCC STAR nodes `authorized_keys` using this script:

```bash
YOUR_KEY="${HOME}/.ssh/id_rsa"  # replace with your key path if different
SDCC_USERNAME=$(whoami) # replace with your SDCC username if different from local

mkdir -p ~/.ssh
chmod 700 ~/.ssh
b64="$(base64 < ${YOUR_KEY}.pub | tr -d '\n')"
ssh -tt -x -o ForwardX11=no $SDCC_USERNAME@ssh.sdcc.bnl.gov "ssh -t -x -o ForwardX11=no -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $SDCC_USERNAME@starsub03.sdcc.bnl.gov \
\"umask 077; mkdir -p ~/.ssh; touch ~/.ssh/authorized_keys ; chmod 700 ~/.ssh; printf '%s\n' '$b64' | base64 -d >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys\""

touch ~/.ssh/config
chmod 600 ~/.ssh/config
grep -qF "=== SDCC jump host ===" ~/.ssh/config || cat >> ~/.ssh/config <<EOF
# === SDCC jump host ===
Host starsub0*
    HostName %h.sdcc.bnl.gov
    User ${SDCC_USERNAME}
    ProxyJump ${SDCC_USERNAME}@ssh.sdcc.bnl.gov
    IdentityFile ${YOUR_KEY}
    ForwardAgent yes
    RequestTTY yes
    ServerAliveInterval 60
    ServerAliveCountMax 2
Host star
    HostName starsub03.sdcc.bnl.gov
    User ${SDCC_USERNAME}
    ProxyJump ${SDCC_USERNAME}@ssh.sdcc.bnl.gov
    IdentityFile ${YOUR_KEY}
    ForwardAgent yes
    RequestTTY yes
# legacy RCAS nodes
Host rcas60*
    HostName %h.rcf.bnl.gov
    User ${SDCC_USERNAME}
    ProxyJump ${SDCC_USERNAME}@ssh.sdcc.bnl.gov
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedKeyTypes +ssh-rsa
    RequestTTY yes
    ForwardAgent yes
EOF

# Load your key into the SSH agent (local)
if [ -n "${SSH_AUTH_SOCK:-}" ]; then
  ssh-add -L 2>/dev/null || true
  ssh-add ${YOUR_KEY}
fi
```

### Test: passwordless login

```bash
ssh star
# or
ssh starsub05
```

## 2) VS Code: Remote-SSH
1. Install VS Code extension [**Remote - SSH**](vscode:extension/ms-vscode-remote.remote-ssh) and some [other useful extensions](https://star-juniors.github.io/software/vscode.html)
2. Open Command Palette (`Ctrl+Shift+P`) → start typing `Remote-SSH: Connect to Host...`
3. Select `star`.
4. VS Code installs the remote server on first connect; then open your folder on SDCC, e.g. `/gpfs01/star/pwg/${SDCC_USERNAME}/`
Persistence note: the node state is not persistent; use [`tmux`](https://www.redhat.com/en/blog/introduction-tmux-linux) for long-running terminal sessions.

## 3) Mount SDCC
If you need to download files from SDCC (like ROOT Trees) I recommend [mounting](https://star-juniors.github.io/software/remote-development.html#mounting-sdcc-on-your-laptop) SDCC filesystem via `sshfs`:

```bash
sudo apt install sshfs #linux
# brew install sshfs # for MacOS use Homebrew
mkdir ~/star
SDCC_USERNAME=$(whoami) # replace with your SDCC username if different from local
echo "alias starmount='sshfs -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3  ${SDCC_USERNAME}@sftp.sdcc.bnl.gov:/gpfs01/star/pwg/${SDCC_USERNAME} ~/star'" >> ~/.bashrc
source ~/.bashrc
starmount
```

## 4) Running STAR software locally (optional)
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
apptainer run docker://ghcr.io/star-bnl/star-sw:main-root5-gcc485 bash -l
```

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
