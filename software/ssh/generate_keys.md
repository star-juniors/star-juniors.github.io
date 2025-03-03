---
title: Generate A New Key Pair SSH
parent: SSH
---

Generate A New Key Pair SSH
===========================

Ref: [SDCC tutorial](https://www.sdcc.bnl.gov/information/ssh/generate-ssh-key-pairs)

SSH key authentication is needed to log into the old RHIC computing facility (RCF) or the new (2021+) Software and Data Computing Center (SDCC) gateway *ssh.sdcc.bnl.gov*, or check [here](https://www.sdcc.bnl.gov/information/ssh/ssh-gateways) for most recent available ssh gateways. Links to modify, upload, or view keys can be found [here](https://www.sdcc.bnl.gov/information/ssh/ssh-key-utilities)

SSH keys are a convenient way to authenticate users logging into remote machines.  The idea is that there is a private and public key.  The public key is kept on the server/remote machine you want to log into.  The private key you keep and typically requires a pass-phrase to use.  Although you can generate a private key without a password this will defeat the purpose of using key pairs to authenticate.

The public and private keys are paired in that they are unique "hashes".  I will not go into the algorithms responsible for this but you can have different levels of security based on different algorithms.  The generating algorithm can be modified with the key generating command that I will use.  These instruction create a hash using the default which is good enough for our purposes.

The authentication happens when the server you are logging into checks the hash of the public key against your private key.  Since no one but you knows the password to your private key this ensures that the one logging in is in fact the person who created the public key.
**So don't share your private key password or private key it is the only thing that tells the remote machine you are you and not someone else**

-----------------------------------------------------------

1. Open a terminal window  on the desktop machine or laptop that you will be using to login to the RCF/SDCC.

2. At the prompt, type: `ssh-keygen -t rsa`
 - You will see output similar to the following: "Generating public/private rsa key pair."

3. Enter location and file in which to save the key
 - To accept the default file name and location (*~/.ssh/id_rsa*) press *Return/Enter*.
 - This command will generate an RSA key of the default length for use with ssh protocol version 2

5. At the Enter pass-phrase prompt, type in a pass phrase, which will not be echoed as you type, and then press *Return/Enter*.
 - This pass phrase will be used to unlock your private key file (failing to enter a pass phrase for your key will, of course, defeat all security related to the key pair).
 - You will be prompted to verify the pass phrase by entering it again. Retype your pass phrase, and then press Return.

6.  <a name="KeyFingerprint"></a>The key pair will be generated, and you will see output similar to the following:
 > Your identification has been saved in *~/.ssh/id_rsa*.  
 > Your public key has been saved in *~/.ssh/id_rsa.pub*.  
 > The key fingerprint is: 99:99:99:99:99:99:99:99:99:99:99:99:99:99:99:99 \<user\>@\<machine.name\> 
 - The actual fingerprint for your key will be displayed (not the one shown in the example above), and where the terms in brackets (<>) are replaced by the values appropriate for your machine.
 - Two files will be created:
  1. The first file is the private key, with the default name (or the name you entered above).
  2. The second file is the public key, with .pub appended to the file name.

 **Important Note:**
 - The key may not look like that and instead look something like below.
  > SHA256:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA \<user\>@\<machine.name\>  
  > The key's random art image is:  
  >
 - This is normal since your laptop is displaying using the 'SHA256' standard instead of the *md5* standard.  To see the *md5* standard run the command `ssh-keygen -lf key.pub -E md5`
  - [Command Ref](https://superuser.com/questions/929566/sha256-ssh-fingerprint-given-by-the-client-but-only-md5-fingerprint-known-for-se) 

7. Copy the key fingerprint value from the output above.  To upload the key, browse to [SDCC new key upload](https://web.racf.bnl.gov/Facility/SshKeys/UploadSshKey.php)
 - In order to view the form, you will be prompted for your Kerberos user name and password.

8. Click the Browse button, and in the dialog box, navigate to your .ssh directory (or the directory in which your public key file is stored).  If your browser does not display hidden directories (ones that begin with a period), then you will have to type in or cut and paste the name of the public key file into the dialog box. Enter the full name of the public key file (as displayed in output earlier), including the path and the .pub file extension (if you copy and paste the name or path, take care to leave off the period at the end of the line with the public key file name).

9. Copy and paste the fingerprint of your public key (as displayed in output earlier) into the second box in the form, or type it into the dialog box. The *md5* key is comprised of 16 2-digit hexadecimal numbers separated by colons (:).

10. To upload your key file, click the Send File button.

11. You can now login to one of the gateway machines using SSH keys using command below. You will be prompted for the pass-phrase for your private key during the login process. The pass-phrase will not leave your local machine.
 - `ssh -i ~/.ssh/id_rsa/ username@ssh.sdcc.bnl.gov`
 
12. In order to prevent having to type the password every time you can add the key to the *ssh-agent*  [see here](ssh_agent.md)