---
title: VS code tunnel
parent: VS Code
---

## How to Make Use of Tunnels in Visual Code Studio

These instructions will go over how to setup the tunnel with VS Code on your remote machine. [Source](https://code.visualstudio.com/docs/remote/tunnels)

Tunnels in VS Code allow remote access with fewer logins and better usability than NoMachine. You can edit files directly and use all VS Code extensions, even through a browser. Here’s how to set it up:  

1. **Log into SDCC**: Use [NoMachine](no-machine.md) to avoid repeated GitHub authentication.  
2. **Download VS Code Client within SDCC**:  
   - Navigate to your preferred directory (e.g., `~/Downloads/`) and run:  

     ```bash
     curl -Lk 'https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64' -output vscode_cli.tar.gz
     tar -xf vscode_cli.tar.gz
     ```

3. **Start the Tunnel**:  
   - Run `code tunnel` and accept the license terms.  
   - Log into GitHub on SDCC and authorize VS Code instance.  
   - Name your device, and get a `vscode.dev` URL for remote access.  
4. **Connect Locally**:  
   - Install [VS Code](https://visualstudio.microsoft.com/) on your local machine.  
   - Install the "Remote-Tunnels" extension.  
   - Use the Remote Explorer to connect to your tunnel.  

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


