---
sidebar: auto
---

# Cookbook

A guide on how to install and use Super Mario Sunshine practice codes on Nintendont and Dolphin.

[[toc]]

## Preparing your Wii

### Install Homebrew

First of all you're gonna have to install Homebrew on your Wii. Make sure your SD card is formatted to FAT32 and then visit [https://wii.guide/](https://wii.guide/) for a detailed guide on how to get Homebrew on your Wii.

### Install the necessary applications

Using Nintendont is the recommended way to use practice codes. You can download the latest build by [clicking this link](https://zint.ch/NintendontPackager/latest/Nintendont.zip). Unpack the archive and place the Nintendont folder with all of its contents in the "apps" folder of your SD card. If there is no "apps" folder create one in the root of your SD card.

## Installing the cheat file

### Generate the cheat file

First you need to know which version of the game you're using. The following table displays the supported versions as well as the respective game code:

| Version                | Game Code | Disc Code                 |
| ---------------------- | --------- | ------------------------- |
| PAL (Europe)           | GMSP01    | DOL-GMSP-0-00             |
| NTSC-U (North America) | GMSE01    | DOL-GMSE-0-00             |
| NTSC-J (Japan)         | GMSJ01    | DOL-GMSJ-0-00 / GMSJ-0-01 |
| NTSC-K (Korea)         | GMSE01    | DOL-GMSE-0-30             |

::: tip Note for NTSC-J players
JP 1.0 and JP 1.1 both use the same ID (GMSJ01). To identify which version you have check the back of your disc. It will read "DOL-GMSJ-0-00" for 1.0 and "DOL-GMSJ-0-01" for 1.1.

![](https://gct.zint.ch/img/jp_diff.png)
:::

Visit the main site and select the appropriate game version from the dropdown menu. A list of available cheat codes will appear. Select all the cheats you want to have enabled from the list, choose GCT as file format and click "Download".

### Copy the file onto your SD card

Create a "codes" folder in the root of your SD card if there is none and copy the GCT file you just downloaded into that folder. This is what the resulting folder structure should look like on your SD card (the .gct files might be different depending on the version you chose):

![Sample Folder Structure](/img/folderstructure.png)

::: tip Windows file extensions
Windows hides file extensions by default. To avoid accidentally naming your file something like "GMSE01.gct.gct" ensure that you can see the file extension:

![](https://github.com/user-attachments/assets/527b372b-914b-4a2d-af6f-c07fa59b7e4b)
:::

### Enable the codes

Open your Homebrew channel and from there launch Nintendont. Select SD and then press B on your Gamecube controller to see the settings. In your settings, make sure that "Cheats" are "On". You can switch it on/off by pressing A on your controller. (See image below)

![Enabling Cheats in Nintendont](/img/nintendont_cheats.jpg)

Press B again to return to the game list and launch your game. And with that you're done already.

## Updating the cheat file

You can generate a new GCT file and replace the old one on your SD card.

If you periodically need to switch between two or more sets of codes you could create a structure such as the one below in your codes directory and replace GMSE01.gct with the target code file (assuming you use GMSE01):

- GMSE01.gct
- GMSE01_FastAny.gct
- GMSE01_Practice.gct
- ... etc.

Only the GCT with the game code will be read, in the sample above "GMSE01.gct", meaning only the codes in "GMSE01.gct" will be active during gameplay.

## Troubleshooting

### The game doesn't launch / Stuck at black screen

This issue is not related to the practice codes. You have the following options if that happens to you:

- Restart Nintendont until the game launches (usually takes a few attempts).
- Connect your Wii to the internet before launching Nintendont.
- Wait for ~30 seconds on the game selection screen before booting the disc.
- Reinstalling homebrew may fix this issue permanently.

### Nintendont says IOS58 is missing

[Here's](/ios58.html) a guide on how to install IOS58 for use with Nintendont.

### The game launches but the codes don't work

This can have multiple reasons:

- You don't have cheats enabled: See ["Enable the codes" section](#enable-the-codes) for details.
- You're using an obsolete version of Nintendont. Make sure you use version 4.434 or newer.
- Your cheatfile has the wrong name: Make sure the file is named "GMSE01.gct", "GMSJ01.gct" or "GMSP01.gct". It won't work with names like "GMSE01 (1).gct". Nintendont is very picky!
- Your cheatfile is at the wrong location: Make sure the file is in the "codes" folder of your SD Card. Again, the folder has to be named "codes" (See sample folder structure in ["Copy the file onto your SD Card section"](#copy-the-file-onto-your-sd-card)). If you have a "games" folder, make sure there's no file with the same name in it or its subfolders.
- Your cheatfile is too big: Using too many codes at once can cause Nintendont to disable them since the used space in the game is limited. Make sure you don't have two incompatible codes selected when downloading the cheatfile (for example "Level Select", "Fast Any%" and the Stage loader cannot be used simultaneously). If you're using Nintendont 4.434 or newer you don't have to worry about your file size unless it exceeds 5KB.
- If you have a USB drive connected and use disc, make sure you select the device that contains the cheats for your disc.
- If you use an ISO your cheat file and ISO must be on the same device (both on the SD card or both on the USB drive).

### The controller behaves differently in Nintendont

Ensure that you turn on "Native controls" in the Nintendont settings. The setting only needs to be turned off for non-Gamecube controllers (i.e. controllers not plugged into the Gamecube controller ports, such as Xbox controllers and the like).

### I'm lost :(

You can ask for help on the [Super Mario Sunshine Discord](https://discord.gg/9dGJWEc) or open a [new Issue on GitHub](https://github.com/BitPatty/gctGenerator/issues).

## Appendix: Cheat Manager

The Cheat Manager is a homebrew application that allows you to generate GCTs on your Wii. This way you don't have to redownload your cheatfile everytime you want a different combination. However, you're gonna have to use a Wiimote to control the application.

### Setup

You can download the Cheat Manager from [here](/files/Cheat_manager_v0_3.zip). Unzip the archive and copy the contents into the "apps" folder of your SD card.

Using the generator on the main site, select all the codes you want to have available on the cheat manager and choose "Cheat Manager TXT" as file format instead of "GCT" to download a text file formatted for use with the cheat manager. Create a "txtcodes" folder in the root of your SD card if there is none and copy the generated text file into that folder. The name of the text file doesn't matter if you use this application, since the games ID is stored in the textfile.

Alternatively, a zip archive containing all codes available on this site can be downloaded from [here](/files/GCMCodes.zip).

### Using the Cheat Manager

Launch the cheat manager and grab your Wiimote. Navigate to your textfile using the DPad and select it with "A". On the following screen press "+" to activate and "-" to deactivate a cheat.

After activating your desired codes press "1" to generate the GCT file. The cheatmanager then creates the GCT file in your "codes" folder, overwriting the old one if there's already a GCT with the same name. If you now launch the game with cheats active the new codes will be loaded.

## Appendix: Dolphin

### Setup

To use the codes with Dolphin choose "Dolphin INI" as file format instead of "GCT" to download the codes formatted for use with Dolphin. Alternatively, a zip archive containing all codes available on this site can be downloaded from [here](/files/DolphinCodes.zip).

::: tip Code limits
Dolphin doesn't use the same cheat loader as Nintendont. Its code limit is reached rather quickly and it won't tell you whether the codes you enabled exceed the internal limit. If your game crashes after enabling some codes, this might be the cause. Try to disable non-essential codes if that happens to you.
:::

::: tip Dolphin Version
Codes are known to not work properly on Dolphin 5.0. We therefore recommend to use the latest beta version (5.0-XXXXX) which you can download from the [Dolphin Website](https://dolphin-emu.org/download/).
:::

### Configuration

#### Enabling Cheats

Open Dolphin and navigate to the settings menu through `Options` -> `Configuration`. Make sure the checkbox labeled `Enable Cheats` is checked:

![Enable Cheats in Dolphin](/img/dolphin_cheats.png)

#### Dolphin 5.0 or older

Right-click the game in Dolphin and, then click on "Properties" and on the bottom left corner of the property window click the "Edit configuration" button. Open the text file you downloaded and copy everything following the `[Gecko]` tag below the same tag in the configuration you just opened. If there is no `[Gecko]` tag (it should be the first tag), create one on top of your configuration file. Save and close the configuration file.

![Dolphin Gecko Codes 5.0](/img/dolphin_gecko_codes_v1.png)

#### Dolphin 5.0-11XXX or newer

Right click the game in Dolphin and click on "Properties". In the "Game Config" section choose the "Editor" tab and paste the contents of the text file you just downloaded into the "User Config" editor.

![Dolphin Gecko Codes 5.0-11XXX](/img/dolphin_gecko_codes_v2.png)

### Using the codes

Select the "Gecko-Codes" tab in the game properties and check all the codes you want to be active. Most (but not all codes) will work with Dolphin.

## Appendix: Using large cheat file with Nintendont

There is a file size limit of 5000 bytes in Nintendont.
To use cheat file with size larger than 5000 bytes,
you need to store the cheat file in your Gamecube memory card
and load it on runtime.

### Preparation: Installing GCMM

You need GCMM to store the cheat file to your Gamecube memory card.
[Download the latest GCMM release](https://github.com/suloku/gcmm/releases/download/1.4f/gcmm_1.4f.zip) and unzip it.
Copy the `apps/gcmm` folder to `/apps/` folder in your SD card.

![File list after GCMM is installed](/img/gci/0-gcmm-files.jpg)

### [Step 1/3] Generating cheat file

Select the game version and the functions you want in [GCT Generator](/).
Choose `GCI + GCT` as Download Format and press the download button.

There will be 2 files being downloaded.
Put the first file (GCI) in `/MCBACKUP/` folder
and the second file (GCT) in `/codes/` folder in your SD card.
Create the folders if they do not exist.

![File list after downloading the cheat files](/img/gci/1-cheat-files.jpg)

### [Step 2/3] Write the GCI file to Gamecube memory card with GCMM

Open your Homebrew channel and run GCMM.

![Run GCMM in Homebrew channel](/img/gci/2-0-open-gcmm.png)

Press A if you are using SD card, or B if you are using USB.

![Choose device](/img/gci/2-1-choose-device.png)

Press X (Restore) in mode selection.

![Choose mode](/img/gci/2-2-choose-mode.png)

Put your Gamecube memory card in slot A and press A.
Press B instead if you put it in slot B.

![Choose slot](/img/gci/2-3-choose-slot.png)

Use D-Pad to select the downloaded GCI file,
and then press A to restore the file to your Gamecube memory card.

![Choose file](/img/gci/2-4-choose-file.png)

After the message "Restore Complete" appears,
press A to return to the main menu,
and then press Start to return to Homebrew.

![Restore Complete](/img/gci/2-5-complete.png)

#### For the second time and onwards

There will be a message to confirm
whether you want to overwrite the file since the second time.
Press B and then Z to overwrite.

![Overwrite confirm 1](/img/gci/2-6-overwrite-1.png)
![Overwrite confirm 2](/img/gci/2-6-overwrite-2.png)

### [Step 3/3] Run the game with Nintendont

Run the game with Nintendont with your Gamecube memory card plugged in.
The GCI file stored in your memory card will be loaded automatically.
You can remove your memory card
after confirming the functions you selected work.
