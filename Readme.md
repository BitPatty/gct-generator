# GCT Generator

[![GitHub license](https://img.shields.io/github/license/bitpatty/gct-generator?color=blue&label=License&style=plastic)](https://github.com/BitPatty/gct-generator/blob/master/LICENSE)
[![CD Pipeline](https://github.com/BitPatty/gct-generator/workflows/CD%20Pipeline/badge.svg)](https://github.com/BitPatty/gct-generator/actions?query=workflow%3A%22CD+Pipeline%22)

This repository contains the code behind the Super Mario Sunshine Cheatfile Generator at https://gct.zint.ch/

---

## Features

- Custom cheat combination
- Custom stage loader based on [QbeRoot's fastcodes](https://github.com/QbeRoot/fastcodes)
- Creates cheatfiles ready for use with [Nintendont](https://github.com/FIX94/Nintendont), [Gecko Cheat Manager](https://wiibrew.org/wiki/CheatManager) and [Dolphin](https://github.com/dolphin-emu/dolphin)

---

## Contributing

### Updating Practice Codes

The codes are stored in the `Codes.xml` file. If you want to add or change codes edit the XML file. Note that GMSJ0A refers to the NTSC-J 1.1 release of Super Mario Sunshine. (It's not actually called version A but that's what we've been calling it for years due to a misconception on what the A on the back of the box means).

When adding new codes keep in mind that the English title/description are mandatory.

#### Codes with configuration
Codes with configuration are usually defined as vue components,
which is defined in [site/.vuepress/components/codes/](site/.vuepress/components/codes/).
When creating/updating those codes,
in addition to editing the `Codes.xml` file,
you may also need to check the following files:
- [site/.vuepress/components/codes/codegen.js](site/.vuepress/components/codes/codegen.js):
  Specify the Gecko code generator function of the code.
  The version string will be passed as the first argument.
- [site/.vuepress/components/codes/ui.js](site/.vuepress/components/codes/ui.js):
  Specify the vue component for the configuration of the code.
  The version string will be passed as a property.
- [site/.vuepress/components/codes/preview.js](site/.vuepress/components/codes/preview.js):
  Specify the `id` and the `getConfig(version)` function of the code to make it shown in preview.

#### Reserved Memory

Some codes store some states in the games memory starting from address 0x817F0000 (up to 0x817FFFFF). To avoid collisions use a memory range in the unallocated ranges.


| Status                      | Start   | End     | Description                                                               |
| --------------------------- | ------- | ------- | ------------------------------------------------------------------------- |
| ![](./docs/reserved.svg)    | `0x0`   | `0x7`   | Level Select: Stage Data                                                  |
| ![](./docs/reserved.svg)    | `0x8`   | `0x13`  | DPad Functions: Stored Position (Mario)                                   |
| ![](./docs/reserved.svg)    | `0x14`  | `0x15`  | DPad Functions: Stored Angle (Mario)                                      |
| ![](./docs/reserved.svg)    | `0x16`  | `0x1B`  | DPad Functions: Stored Position (Camera)                                  |
| ![](./docs/reserved.svg)    | `0x20`  | `0x23`  | Coin Count Savestate: Coin Count                                          |
| ![](./docs/reserved.svg)    | `0x24`  | `0x26`  | Pattern Selector: Selected Pattern Numbers                                |
| ![](./docs/reserved.svg)    | `0x27`  | `0x27`  | Pattern Selector: Cursor Position                                         |
| ![](./docs/reserved.svg)    | `0x28`  | `0x29`  | Instant Level Select: Last Selected Area ID                               |
| ![](./docs/reserved.svg)    | `0x2A`  | `0x2A`  | Instant Level Select: Last Selected Episode Number                        |
| ![](./docs/reserved.svg)    | `0x2B`  | `0x2B`  | Instant Level Select: Area Lock Flag                                      |
| ![](./docs/reserved.svg)    | `0x2C`  | `0x2C`  | Red Coin Savestate: Red Coin state                                        |
| ![](./docs/reserved.svg)    | `0x2D`  | `0x2D`  | Red Coin Savestate: Red Coin Count                                        |
| ![](./docs/unallocated.svg) | `0x2E`  | `0x2F`  | Not Allocated                                                             |
| ![](./docs/reserved.svg)    | `0x30`  | `0x33`  | QF Time Savestate: Stored QF Time                                         |
| ![](./docs/reserved.svg)    | `0x34`  | `0x3B`  | In-Game Time Savestate: Stored Elapsed Time                               |
| ![](./docs/reserved.svg)    | `0x3C`  | `0x3F`  | Open World Shine Get: Last Touched Shine Game QF                          |
| ![](./docs/reserved.svg)    | `0x40`  | `0x4F`  | Mario Savestate: Stored State (0x7C-0x8B)                                 |
| ![](./docs/reserved.svg)    | `0x50`  | `0x57`  | Mario Savestate: Stored Flag (0x118-0x123)                                |
| ![](./docs/reserved.svg)    | `0x58`  | `0x5B`  | Mario Savestate: Stored Horizontal Speed                                  |
| ![](./docs/reserved.svg)    | `0x5C`  | `0x5F`  | Mario Savestate: Stored Vertical Speed                                    |
| ![](./docs/reserved.svg)    | `0x60`  | `0x63`  | Mario Savestate: Stored Last Grab Target                                  |
| ![](./docs/reserved.svg)    | `0x64`  | `0x67`  | Mario Savestate: Stored Water Amount                                      |
| ![](./docs/unallocated.svg) | `0x68`  | `0x93`  | Not Allocated                                                             |
| ![](./docs/reserved.svg)    | `0x94`  | `0xA3`  | QF Timer: Coordinates of the Text box (LTRB)                              |
| ![](./docs/reserved.svg)    | `0xA4`  | `0xB0`  | QF Timer: Timer Format String                                             |
| ![](./docs/reserved.svg)    | `0xB0`  | `0xB1`  | QF Timer: (Unused)                                                        |
| ![](./docs/reserved.svg)    | `0xB2`  | `0xB2`  | QF Timer: Stop at QFT Offset                                              |
| ![](./docs/reserved.svg)    | `0xB3`  | `0xB3`  | QF Timer: Restart Flag                                                    |
| ![](./docs/reserved.svg)    | `0xB4`  | `0xB7`  | QF Timer: Cumulative time of previous areas since last reset (QFT Offset) |
| ![](./docs/reserved.svg)    | `0xB8`  | `0xBB`  | QF Timer: Time to display if timer freeze > 0                             |
| ![](./docs/reserved.svg)    | `0xBC`  | `0xBF`  | QF Timer: Duration of timer freeze (in frames)                            |
| ![](./docs/buffer.svg)      | `0xC0`  | `0xFF`  | Buffer (QF Timer)                                                         |
| ![](./docs/reserved.svg)    | `0x100` | `0x100` | Ingame Timer: Reset Stopwatch Flag                                        |
| ![](./docs/reserved.svg)    | `0x101` | `0x101` | Ingame Timer: Disable Custom IG Timer Flag                                |
| ![](./docs/reserved.svg)    | `0x102` | `0x10B` | Ingame Timer: Stopwatch Backup                                            |
| ![](./docs/reserved.svg)    | `0x10C` | `0x10C` | Ingame Timer: Stop Stopwatch Flag                                         |
| ![](./docs/buffer.svg)      | `0x10D` | `0x10F` | Buffer (Ingame Timer)                                                     |
| ![](./docs/reserved.svg)    | `0x110` | `0x11F` | QF Timer: Text Config                                                     |
| ![](./docs/reserved.svg)    | `0x120` | `0x123` | QF Timer: Background Config                                               |
| ![](./docs/reserved.svg)    | `0x124` | `0x133` | Streak Tracker: Text Config                                               |
| ![](./docs/unallocated.svg) | `0x134` | `0x237` | Not Allocated                                                             |
| ![](./docs/reserved.svg)    | `0x238` | `0x347` | General Function (`drawText`)                                             |
| ![](./docs/buffer.svg)      | `0x348` | `0x39B` | Buffer (QF Timer)                                                         |
| ![](./docs/reserved.svg)    | `0x39C` | `0x3AF` | QF Section Timer: Background Config                                       |
| ![](./docs/reserved.svg)    | `0x3B0` | `0x3BF` | QF Section Timer: Text Config                                             |
| ![](./docs/reserved.svg)    | `0x3C0` | `0x3C8` | QF Section Timer: Format String                                           |
| ![](./docs/reserved.svg)    | `0x3C9` | `0x3C9` | QF Section Timer: (Unused)                                                |
| ![](./docs/reserved.svg)    | `0x3CA` | `0x3CB` | QF Section Timer: Section Count                                           |
| ![](./docs/reserved.svg)    | `0x3CC` | `0x3CF` | QF Section Timer: Last Freezed Time                                       |
| ![](./docs/reserved.svg)    | `0x3D0` | `0x40F` | QF Section Timer: Section Time Array                                      |
| ![](./docs/reserved.svg)    | `0x410` | `0x41F` | Pattern Selector: Background Config                                       |
| ![](./docs/reserved.svg)    | `0x424` | `0x433` | Pattern Selector: Text Config                                             |
| ![](./docs/reserved.svg)    | `0x434` | `0x440` | Pattern Selector: Format String                                           |
| ![](./docs/reserved.svg)    | `0x441` | `0x475` | Pattern Selector: Pattern Data                                            |
| ![](./docs/reserved.svg)    | `0x476` | `0x477` | Attempt Counter: Previous Area                                            |
| ![](./docs/reserved.svg)    | `0x478` | `0x478` | Attempt Counter: Display Timer                                            |
| ![](./docs/reserved.svg)    | `0x479` | `0x479` | Attempt Counter: Display Duration                                         |
| ![](./docs/reserved.svg)    | `0x47A` | `0x47F` | Attempt Counter: Format String                                            |
| ![](./docs/reserved.svg)    | `0x480` | `0x48F` | Attempt Counter: Text Config                                              |
| ![](./docs/reserved.svg)    | `0x490` | `0x4A3` | Attempt Counter: Background Config                                        |
| ![](./docs/reserved.svg)    | `0x4A4` | `0x4A5` | Attempt Counter: Success Count                                            |
| ![](./docs/reserved.svg)    | `0x4A6` | `0x4A7` | Attempt Counter: Attempt Count                                            |
| ![](./docs/reserved.svg)    | `0x4A8` | `0x4A8` | Attempt Counter: Got Shine Flag                                           |
| ![](./docs/buffer.svg)      | `0x4A9` | `0x4AF` | Buffer (Attempt Counter)                                                  |
| ![](./docs/unallocated.svg) | `0x4B0` | `0x4BF` | Not Allocated                                                             |
| ![](./docs/buffer.svg)      | `0x4C0` | `0x4C2` | Buffer (Controller Input Display)                                         |
| ![](./docs/reserved.svg)    | `0x4C3` | `0x4C3` | Controller Input Display: Line Width                                      |
| ![](./docs/reserved.svg)    | `0x4C4` | `0x4C7` | Controller Input Display: Scale                                           |
| ![](./docs/reserved.svg)    | `0x4C8` | `0x4CB` | Controller Input Display: (X, Y) Coordinate                               |
| ![](./docs/reserved.svg)    | `0x4CC` | `0x4CF` | Controller Input Display: Background Color                                |
| ![](./docs/reserved.svg)    | `0x4D0` | `0x53F` | Controller Input Display: Components Config                               |
| ![](./docs/unallocated.svg) | `0x540` | `0x17F8` | Not Allocated                                                            |
| ![](./docs/reserved.svg)   | `0x17F8` | `0xD800` | GCI Loader Codes (0x81780000 - 8)*                                       |
| ![](./docs/reserved.svg)   | `0xD800` | `0xFFFF` | GCI Loader                                                               |

\* Additional gecko codes from the memory card are loaded into this space by the GCI loader.


### Adding translations

1. Create a new file `<lang>.json` in `site/.vuepress/i18n`, where `<lang>` is the language code you want to add. Copy the contents of `en-US.json` into your file and translate each entry in the JSON file.
2. Create a new folder with your language code in `site` (such as `site/de` for German). Create a new markdown file for each existing page (`guide.md`, `index.md`, `ios58.md`, ...) and translate its contents from the English version.
3. Create a new entry in `site/.vuepress/i18n/locales.json` with the site metadata and navigation items for your language.
4. Add your locale to the `translations` in `site/.vuepress/i18n/localeHelper.js`.
5. Open `Codes.xml` and add a translation for each code (`<title>` and `<description>`).

### Updating Guides

You can find the guides in the [site](https://github.com/BitPatty/gct-generator/tree/master/site) folder. Simply edit the corresponding markdown file (.md).

Note that in the code reference files everything following the `<!-- injectionpoint -->` tag will be removed during the next build.

### Site Development

You can either use dev containers or your own setup to develop new features.

#### Using Dev-Containers

If you have access to codespaces simply open the repository in codespaces. Else you can set it up locally as follows:

1. Install [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/).
2. Open the project in VSCode
3. Click the `Reopen in Container` button or run the command with the same name.

#### Using your own environment

Due to formatting rules you should use VSCode for development with the following features/extensions:

- NodeJS 16.x (LTS)
- npm 8.x
- `octref.vetur`
- `esbenp.prettier-vscode`

#### Development commands

```sh
# Install dependencies
npm i

# Inject codes from the Codes.xml file
npm run codes:inject

# Run project in watch mode
# This will serve the page in development mode on http://localhost:8080
npm run dev

# Remove injected codes
npm run codes:clean

# Build project for production
npm run build

# Serve the production build
npm run serve
```

The XML codes will be written automatically to the json file and code reference during the following actions:

- Starting the development server with `npm run dev`
- Building the site with `npm run build`

If you want to inject the codes at any given point you can use `npm run codes:inject`.

**!!! Note that if npm was used, `npm run codes:clean` is ran automatically as a pre-commit hook, removing all injected codes and staging ALL changes.** If you want to commit changes without cleaning codes first you have to commit through `git commit --no-verify`.

### Build and preview the site (Docker)

The project root provides a [docker-compose](https://docs.docker.com/compose/) file, which creates a clean build (with the same configuration as the production build) and spins up a minimal Apache server on your local, serving the resulting build on port 8080.

```sh
# Build and serve the site on http://localhost:8080
# Press CTRL+C to stop the container
docker-compose up --build
```
