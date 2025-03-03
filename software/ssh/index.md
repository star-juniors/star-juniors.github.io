---
title: SSH
parent: Software
---

# How to make easy SSH config

An example of my `~/.ssh/config`:

```bash
Host star 
    User prozorov
    HostName ssh.sdcc.bnl.gov
    RemoteCommand rterm -i
    RequestTTY yes
    ForwardAgent yes    

Host rcas60*
    User prozorov
    HostName %h.rcf.bnl.gov
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedAlgorithms +ssh-rsa
    ProxyJump prozorov@ssh.sdcc.bnl.gov
    RequestTTY yes
    ForwardAgent yes
```

All you wanted to know about SSH for STAR
