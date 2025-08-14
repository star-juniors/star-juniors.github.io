---
title: VS code tunnel
parent: VS Code
---


# SSH server
If you follow this [SSH guide](/software/ssh) and configure your SSH, then you could automatically connect to new [Alma 9](/software/a9) machines and it will start server automatically for you, no need for the tunnel. 
You may proceed with [Step 5](#step5) using VS code Remote extension from you local machine 

However, it will not save the state of the machine (not persistent) - use `tmux` for background tasks.

Some info here on [VS code remote SSH](https://code.visualstudio.com/docs/remote/ssh)


## How to Make Use of Tunnels in Visual Code Studio

These instructions will go over how to setup the tunnel with VS Code on your remote machine. [Source](https://code.visualstudio.com/docs/remote/tunnels)

Tunnels in VS Code allow remote access with fewer logins and better usability than NoMachine. You can edit files directly and use all VS Code extensions, even through a browser. 

{: .highlight }
**Important** : Login into new [Alma 9](/software/a9) machines (i.e. `ssh starsub0x.sdcc.bnl.gov`(where `x`= 1-7) instead of `ssh rcas60xx` or `rterm -i` ) 


Here’s how to set it up:  

1. **Log into SDCC**: Use [NoMachine](no-machine.md) to avoid repeated GitHub authentication.
(or one can use ssh + tmux - needed for continous running of the tunnel)

2.  ```bash
    ssh starsub02.sdcc.bnl.gov
    ```

3. **Download VS Code Client within SDCC**:  
   - Navigate to your preferred directory (e.g., `~/Downloads/`) and run:  

     ```bash
     curl -Lk 'https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64' --output vscode_cli.tar.gz
     tar -xf vscode_cli.tar.gz
     ```

4. **Start the Tunnel**:  
   - Run 
     ```bash
     code tunnel
     ```
     or
     ```bash
     ./code tunnel
     ```
      and accept the license terms.  
   - Log into GitHub on SDCC and authorize VS Code instance.  
   - Name your device, and get a `vscode.dev` URL for remote access.

5.  <a id="step5">**Connect Locally**:</a>  
   - Install [VS Code](https://visualstudio.microsoft.com/) on your local machine.  
   - Install the ["Remote-SSH"](vscode:extension/ms-vscode-remote.remote-ssh) extension and ["Remote-Tunnels"](vscode:extension/ms-vscode.remote-server)   
   - Use the Remote Explorer to connect to your tunnel.
   - Or start an SSH connection to server in `~/.ssh/config`  

### Benefits

- Seamlessly access remote files and terminals.  
- Utilize VS Code extensions for enhanced coding.  
- Open files directly in VS Code without additional tools.


## ROOT File Viewer

![alt text](/img/vscode_extension_announcement.gif)

ROOT File Viewer allows you to see your ROOT Files directly in VS Code! This extension is for you if you want to view ROOT Files:
- with just a click, without having to type anything on a terminal
- anywhere, with no local ROOT installation required


[VS Marketplace](https://marketplace.visualstudio.com/items?itemName=albertopdrf.root-file-viewer)


[Original blog page](https://root.cern/blog/vscode-extension-announcement/) 
