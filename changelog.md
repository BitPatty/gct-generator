# Changelog
## Apr 21, 2022
### Shortened QFT
- Shortened QFT's freeze code by replacing C2 with 04(bl@event) and 07.
- Reserve `817F0348`~`817F03BF` (120 bytes)

### Reduced code size of Pattern Selector
Reduce 240 bytes of PS by replacing switch case with lookup table.

### Reverted QFT to version 0.5
Codes are getting too big for Nintendont, reverting to a simpler version while we figure out ways to make everything fit.

## Apr 08, 2022
### Implemented custom config of QFT
- Appearance: location, font size, font color, background color (GMSJ01 only)
- Freezing the timer

### Implemented customizable code
- Add code info in `Codes.xml` as other code,
  but you should specify `<id>` and available versions with `<source version="XXX"></source>`
  (the code in `<source>` will be ignored).
- Create directory `site/.vuepress/components/codes/YOUR_CODE_NAME`,
  and create the following two files (file names are arbitrary):
  + `codegen.js`: **export default** a `codegen(version: string): string` function,
    where `version` is the game version (e.g. `GMSJ01`),
    and the return value is the gecko code string.
    The config of the code can be read from localStorage
    (with key = `config/YOUR_CODE_ID` as convention) directly.
  + `config.vue`: The vue component of the config UI,
    which is shown below the `<description>` given in `Codes.xml`.
    When the config is changed, store the new config into localStorage
    (with key = `config/YOUR_CODE_ID` as convention).
- Register `codegen.js` in `site/.vuepress/components/codes/codegen.js`
  and `config.vue` in `site/.vuepress/components/codes/ui.js`.
  Note that the name used in export must match the `<id>` of the code.

### Added 'Instant Restart' (GMSJ01 only)
Restarts the area without pausing.

## Mar 25, 2022
### Implemented dependencies system
Add `<dependencies>` tag in `<code>` (e.g. `<dependencies>dep1,dep2,dep3</dependencies>`)
to specify dependencies (separated by `,` if multiple).
The system will find code with id specified with `<id>` tag in `<code>` (e.g. `<id>dep1</id>`)

In addition, to specify dependencies for specific version, add the `version` attribute. e.g.
`<dependencies version="GMSJ01">dep1,dep4</dependencies>`

To prevent internal library being shown on code list,
specify the category as `lib` (i.e. `<category>lib</category>`).

### Added 'drawText' internal library
```c
void drawText(int x, int y, int fontSize, uint32_t colorTop, uint32_t colorBot, const char *fmt, ...);
```
Reserve `817F0238` to `817F0347` (0x110 bytes) for this function.

### Added 'Pattern Selector' (GMSJ01 only)
Select pattern of Chain Chomp (PV4) and Chain Chomplets (PV1).
This code use `drawText` as dependencies.

### Update 'Position/angle/speed display' and 'Speed display' (GMSJ01 only)
Use `drawText` function to simplify the code.

## Mar 13, 2022

### Added 'Metadata Display' category

- Moved speed display codes from misc to metadata display
- Made codes in the category exclusive

## Feb 22, 2022

### Added Option to define custom Gecko codes

## Feb 20, 2022

### Added 'Shadow Mario HP Meter'

Displays a health bar above Shadow Mario.

## Nov 28, 2021

### Updated 'Speed display'

Fixed a crash when leaving certain levels.

### Updated 'Quarterframe Timer (Experimental)'

- The timer now freezes upon grabbing blue or red coins.
- The timer now rounds to the frame for end times, entry times and blue coin grabs, as more precision in those cases would be meaningless.

## Nov 15, 2021

### Updated 'Quarterframe Timer (Experimental)'

- Revamped reset behavior; this code is now fully compatible with Shine Get Timer, and no longer depends on any loader code.
- The timer now freezes upon hitting a loading zone (similarly to Shine Get Timer) or exiting area.
- Fixed possible overflows when entering a loading zone after staying in the same area for a very long time.

## Oct 22, 2021

### Updated 'Quarterframe Timer (Experimental)'

- Adjusted speed to match real time on 30fps. The timer will run slightly faster than real time on 25fps PAL, just as the game itself does.
- Fixed the ability for the timer to eventually roll back to 0:00.000; it will now stop at 99:59.994 (the highest achievable time below 100 minutes).
- Fixed the ability for the timer to eventually resume while waiting on a Shine textbox; it will now keep displaying the end time forever (well, until the next area transition).

## Oct 10, 2021

### Added 'Speed Display' and 'Shiny Shines'

Speed Display is a more compact version of Position/angle/speed Display, and Shiny Shines simply makes all Shines yellow whether collected or not.

### Added code categories and presets

\-

## Sep 29, 2021

### Added 'Quarterframe Timer (Experimental)'

A new timer that aims to circumvent the Shine Get Timer's inconsistencies, and allow timing full levels where SGT would be interrupted by the in-game timer.

## Aug 13, 2021

### Removed 'Stage Randomizer' and 'Remove Save Boxes'

The stage randomizer was outdated by the more powerful stage loader. Removing save boxes has little use for practice and is banned for individual level runs, though it is still possible using 'Fast Any%' or the stage loader.

## Jul 24, 2021

### Added 'Coin Count Savestate'

Allows you to save and load your coin counts using the DPad. The mapping uses the same combination as the one for position saves/loads to simplify usage.

## Jul 5, 2021

### Updated 'Level Select'

Changed C-down + X from Sirena 5 casino to Sirena 4 casino. This shortcut was originally put in place to work around an old practice codes bug, but it now seems more sensible to repurpose it as a quick access to casino skip.

## Jul 1, 2021

### Renamed 'Fix Memory Card Encoding'

Nothing really ever was broken, you simply need to select the correct encoding for your memory card.

## Jun 10, 2021

### Split 'Nozzle Lock' out of 'DPad Functions'

Nozzle Lock is very easy to activate by accident during practice, and its underwater behavior has confused many beginners.

## Mar 22, 2021

### Updated 'Shine Get Timer'

The timer now freezes as soon as you touch a loading zone, allowing you to see your entry time.

## Mar 17, 2021

### Fixed 'Fix Manta Splitting'

When enabling 60Hz mode (PAL) or progressive mode (other versions), the confirmation message would incorrectly reappear on the Dolby logo screen. This is no longer the case.

## Feb 17, 2021

### Fixed 'Remove Save Boxes'

The previous version would just crash the game on boot. Good job me.

## Feb 15, 2021

### Updated 'Fix Manta Splitting'

For verification purposes, this code now changes the color of the stripe behind the coin count in the HUD when in Sirena 1.

## Jan 23, 2021

### Updated 'Remove Save Boxes'

Enabling this code no longer prevents you from saving through the pause menu.

## Jan 21, 2021

### Added 'Fix Memory Card Encoding (NTSC-K)'

Memory card encoding is one of the very few differences between the US and Korean versions, using the wrong version of this code will have no effect.

## Jun 25, 2020

### Updated 'Fix Memory Card Encoding'

Turns out Nintendont was doing things right all along, but some loaders like Gecko OS don't.

## May 29, 2020

### Updated Stage Loader

Fixed a crash on NTSC-U when using Remove Dialogue: Always.

## May 8, 2020

### Updated 'Level Select'

You can now use Start instead of Z in any shortcut.

## Apr 9, 2020

### Removed 'Shine Touch Timer'

The community widely uses Shine Get Timer now, Shine Touch has become more confusing than actually useful.

## Mar 15, 2020

### Added 'Fix Memory Card Encoding'

Fixes a Nintendont issue with memory card encoding.

## Mar 9, 2020

### Updated 'Level Select'

Added shortcuts for the Noki 3 bottle (C-down-left + X) and the Red Coin Fish subarea (Y + L).

## Mar 8, 2020

### Updated 'Level Select'

You can now load different versions of the plaza using Y + C-stick, and the airstrip using X + L. The FLUDD cutscenes on the airstrip no longer reset the timer or accept level shortcuts.

### Added 'Force Plaza Events'

Forces events to happen on certain versions of the plaza.

## Feb 28, 2020

### Updated 'Infinite Lives'

The code no longer sets the life count to 99, which would persist on save files.

### Removed 'Persistent FMV skips'

Use FMV Skips instead.

## Oct 28, 2019

### Updated 'Position/angle/speed display'

Fixed a buffer overflow which caused a crash upon starting the manta fight, and ported the code to JP 1.1.

### twice

Fixed a timing issue which caused a crash when reloading the Sirena 8 hotel with Level Select.

## Oct 22, 2019

### Updated Stage Loader

The coin counter is now reset upon entering a main world.

## Oct 11, 2019

### Updated 'Shine Get Timer'

The timer now pauses during load times.

## Sep 21, 2019

### Updated 'Level Select'

Added a new reset shortcut, Y, which doesn’t reload into the park or the hotel.

## Aug 19, 2019

### Added 'Respawn One-Time Shines'

Respawns Shines obtained from the bells, the Shine Gate and Shine graffitis.

## Aug 19, 2019

### Updated 'Shine Get Timer' and 'Shine Touch Timer'

Improved compatibility with ISO hacks.

## Aug 4, 2019

### Fixed 'Shine Get Timer' and 'Shine Touch Timer'

The previous update made them start at the wrong time on all versions except PAL.

## Jul 24, 2019

### Fixed Box Game timer in 'Shine Get Timer' and 'Shine Touch Timer'

The box game timer is no longer affected by the timer codes.

## Jun 19, 2019

### Added 'Intro skip'

Allows to reach the title screen faster upon booting or resetting the game.

## Apr 30, 2019

### Updated 'Level Select'

Resetting in Pinna 1 can no longer bring up the park owner's dialogue or the Shine spawn, resetting in Sirena 5 no longer loads Sirena 4, episode names fixed when resetting into the park or hotel.

## Apr 19, 2019

### Fixed 'Level Select'

The shortcut for any episode 1 would reset the game and all shortcuts in the Secrets category would load Bianco 3.

## Apr 17, 2019

### Updated 'Level Select'

Z can now reload main levels that weren't initially entered using Level Select, and Hotel Delfino without letting Mario move earlier than normal. Reloading Casino Delfino with Z is no longer possible unless it was specifically loaded with C-down + X.

## Apr 5, 2019

### Added 'Infinite Juice'

Prevents Yoshi from running out of juice and despawning.

## Apr 3, 2019

### Updated 'DPad Functions'

Position codes now save camera angle.

## Jan 24, 2019

### Merged 'Fade-in Timer' into 'Shine Touch Timer'

'Shine Touch Timer' now starts on the last black frame before taking control of Mario, matching the timing method for IL leaderboards on speedrun.com.

## Jan 23, 2019

### Updated 'Level Select'

Fixed Pinna 8 always skipping to the Shine after you beat it once.

## Dec 23, 2018

### Updated 'Position/angle/speed display'

Fixed a error in the US and PAL codes that caused wrong output on Dolphin and a crash on console.

## Dec 18, 2018

### Added 'Position/angle/speed display'

Not available on JP A for now as it was made using the C kit.

## Nov 3, 2018

### Added 'Fade-in Timer'

A new variant of the in-game timer, starting on the last black frame before taking control of Mario rather than before the demo.

## Nov 1, 2018

### Updated 'DPad Functions'

Added a remote grab code in place of Yoshi/nozzles unlock (X + Up), which exists as standalone codes.

## Oct 25, 2018

### Updated Stage Loader

Fixed gpApplication address for US and JP A.

## Sep 09, 2018

### Updated 'Level Select'

Mashing through cutscenes with B no longer causes the game to reset.

### Updated Stage Loader

Fixed some repeated/missing segments in the presets and 'Not in Pinna' FMV skips for JP A.

## Sep 05, 2018

### Updated 'Disable Blue Coin Flag'

The blue coin counter now increases as normal and gets reset on area transitions.

## Aug 29, 2018

### Updated Stage Loader

The code is now able to load the airstrip and any version of the plaza. Added new presets with plaza movement, including 96 Shines and 120 Shines. Added new route endings. Changed the conditional FMV skips option from 'Not in Pinna 1' to 'Not in Pinna', no longer making the Pinna unlock cutscene skippable.

## Aug 24, 2018

### Updated 'DPad Functions' and Stage Loader

Skipping Yes/No textboxes now acts as a Yes.

## Aug 19, 2018

### Removed 'Codes Optimizer'

Its only noticeable effect was to break the timer codes.

### Added 'Any Fruit Opens Yoshi Eggs'

Yoshi still asks for a specific fruit but bringing him another one will open the egg anyway.

## Jul 26, 2018

### Added 'Persistent FMV Skips'

Makes FMVs skippable in newly created save files.

## Jul 03, 2018

### Added 'Codes Optimizer'

Prevents the codes that only need to run once from running every frame.

## Mar 08, 2018

### Removed Original IGT (Deprecated)

Use Shine Get/Touch timer instead.

## Feb 28, 2018

### Fixed Stage Loader.

The previous version didn’t reset properly after the first use if the route ending was the title screen, and reloaded the last level upon exiting area in Corona.

### Added new stages to the loader.

You can now select the Gooper Blooper fight from Ricco 1, the rollercoaster ride from Pinna 8, the King Boo fight from Sirena 5, the bottle from Noki 3 and the underwater area from Noki 8.

## Feb 16, 2018

### Fixed timer compatibility in Fast Any% and Stage Loader.

The timer didn’t reset in Corona.

## Feb 13, 2018

### Added 'Replace Episode names with their ID' for all versions.

Previously only available for NTSC-U.

## Feb 12, 2018

### Fixed Stage Loader.

An error in the generator caused it to output malformed codes.

### Added Unlock Nozzles.

Standalone code and extra feature for X+Up on the DPad Functions.

## Feb 10, 2018

### Added Unlock Yoshi.

Standalone equivalent to X+Up on the DPad Functions.

## Feb 06, 2018

### Fixed Level Select for JP 1.1.

Fixed the injection address.

## Feb 03, 2018

### Updated Stage Loader.

Exiting area or dying now reloads the current stage instead of moving on.

### Added IW and ASIW presets.

Added options for what to do after the last level; removed Corona and Bowser from the regular level choices.

## Feb 02, 2018

### Integrated Noki Dokis Stage Loader.

Integrated [Noki Doki’s Stage Loader](https://qberoot.github.io/fastcodes/) into the Generator.

## Jan 24, 2018

### Optimized 'Fast Any%'.

Shortened the code by a few lines.

## Jan 20, 2018

### Fixed episode names in 'Fast Any%'.

Makes the correct episode names appear in the demo cutscenes and the pause menu in Fast Any%.

### Added 'Remove Save Boxes'.

Adds the option to have save boxes removed outside of 'Fast Any%'

### Made 'Fast Any%' compatible with the timers.

Makes it possible to use the Shine Get and Shine Touch timer in combination with Fast Any%

## Jan 18, 2018

### Updated guides.

Added additional information based on questions asked on the Discord.

## Jan 17, 2018

### Added JP-A port.

Added JP-A port for all codes.

## Jan 08, 2018

### Added guide for installing IOS58.

Added [a guide on how to install IOS58](https://gct.zint.ch/ios58.html).

## Jan 01, 2018

### Fixed 'D-Pad Functions' not removing dialogue properly.

## Dec 30, 2017

### Plaza Yoshi Unlock in 'D-Pad Functions'.

Added Plaza Yoshi Unlock.

## Dec 19, 2017

### Added FMV Skips to 'Fast Any%' except for Pinna 1.

Always enables FMV Skips outside Pinna 1.

## Dec 05, 2017

### Added 'Download for Gecko Cheat Manager' option.

Added option to download codes formatted for the Gecko Cheat Manager.

## Nov 29, 2017

### Made timers stop after the bowser fight.

Timers now also allow to time Corona properly, by stopping them when hitting the last platform during the bowser fight.

### Fixed Pinna not resetting inside the park on PAL.

## Nov 12, 2017

### Fixed 'Free Pause' compatibility with 'Shine Get Timer'.

Fixed 'Free Pause' incompatibility with 'Shine Get Timer' caused by them injecting code in the same address.

## Nov 09, 2017

### Added 'Download for Dolphin' button.

Added download button to get the codes formatted for Dolphin.

## Nov 08, 2017

### Added 'Fast 79 Shines' for NTSC-U.

Same concept as 'Fast Any%'.

## Nov 07, 2017

### Seperated 'Free Pause' and 'Exit Area everywhere'.

Seperated these two codes again since they don't depend on each other.

## Nov 06, 2017

### Updated 'Level Select'. Added 'Shine Touch Timer'. Marked original IGT as deprecated.

The Original Ingame Timer has been marked as deprecated. You can still find it on the bottom of the codelist though if you still want to use it. Instead, there are now two other timers:

- Shine Touch Timer: Starts on the last black frame of the loading screen and ends when you touch the shine.
- Shine Get Timer: Starts on the last black frame of the loading screen and ends when the Shine Get animation starts (similiar to the x-cam timer of SM64).

Since the Shine Get timer contained a way better Level Select, the Level Select code has been replaced with the one from the timer. It includes the most recent fixes and also has some maintenance advantages.

### Timer Changes:

### Changed timing (see above).

- Resets on death.
- Resets when using Shine Select.
- Only uses existing timers for Piantissimo, Sirena/Pianta 6 and Ricco 2 underground.
- Fixed Pinna 8 HUD.

#### Known Bugs:

- Can't reset Pinna 8 properly after finishing the rollercoaster. Use the cannon to reenter or reset the game instead.
- Box game timer doesn't work properly.

### Updated Level Select

- Mashing A during loading screens doesn't affect your level selection anymore.
- Pinna game resets have been fixed.
- Level Names in the intro have been fixed (shoutouts to Noki Doki).
- Sirena 5 now loads the right casino.
- Reloading Sirena does no longer respawn you in the Hotel. Reason: You can move earlier than usual if you do that, making it too inaccurate for practice.

### Replaced 'Exit Area Everywhere' and 'Pause Mid-Air' with 'Free Pause'.

- Merged the two codes.

## Nov 06, 2017

### Added 'Free Pause'

'Free Pause' replaces 'Enable Pause Mid-Air' and 'Enable Exit Area Everywhere'. It now also allows you to pause during cutscenes.

## Nov 04, 2017

### Fixed 'Shine Get Timer' stopping in wrong cutscenes.

Fixed timer resetting during wrong cutscenes when using 'Exit Area' after touching a Shine.

## Oct 30, 2017

### Added 'Enable Exit Area Everywhere'.

## Oct 29, 2017

### Added 'Shine Get Timer'.

Allows you to choose 'Exit Area' in the pause menu on Plaza.

## Oct 28, 2017

### Added X+DPad combinations to 'DPad Functions'.

New functions have been added to the DPad Functions:

- X+D-Pad left: No FLUDD in secrets
- X+D-Pad right: Always FLUDD in secrets
- X+D-Pad up: Unlock Yoshi in stages
- X+D-Pad down: Defauld FLUDD behaviour for secrets

## Oct 26, 2017

### Added 'Enable Pause Mid-Air'.

Allows you to pause mid-air.

## Oct 24, 2017

### Added 'Shine outfit'.

Always wear glasses and the shirt.

## Oct 15, 2017

### Fixed download for Firefox.

Fixed the download button not working for Firefox.

## Oct 14, 2017

### Added 'Fast Any%' for JP & PAL

\-

## Oct 11, 2017

### Added 'Stage Randomizer' for NTSC-U (Experimental).

Loads a random stage after exiting of finishing a level.
