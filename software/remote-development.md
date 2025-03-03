---
title: Remote Development
parent: Software
---
# Remote Development

There are mostly 3 ways how you can use `SDCC` for developing.

Table of Contents:

- [Mounting SDCC on your laptop](#mounting-sdcc-on-your-laptop)
- [No-machine](#no-machine)
- [Using VSCode tunnel](#using-vscode-tunnel)

## Mounting SDCC on your laptop

![alt text](/img/sshfs.png)

Replace your account name in example below:

```bash
sudo apt install sshfs
mkdir ~/star
alias starmount='sshfs -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3  prozorov@sftp.sdcc.bnl.gov:/gpfs01/star/pwg/prozorov ~/star' # add this line to your .bashrc or .bash_aliases
starmount
```

![alt text](/img/explorer.png)

## No-machine

---
![alt text](/img/nomachine2.png)

![alt text](/img/no_machine.png)

- Do remote work on servers in your browser (from mobile?)
- Better then X11 option in `ssh`
- Inspect large root files without waiting
- Run scripts in background and return to machine state anytime

## Using VSCode tunnel

See [VSCode Remote Development](/software/vs-code-tunnel)
