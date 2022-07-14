# GCT Generator

[![GitHub license](https://img.shields.io/github/license/bitpatty/gctGenerator?color=blue&label=License&style=plastic)](https://github.com/BitPatty/gctGenerator/blob/master/LICENSE)
[![CD Pipeline](https://github.com/BitPatty/gctGenerator/workflows/CD%20Pipeline/badge.svg)](https://github.com/BitPatty/gctGenerator/actions?query=workflow%3A%22CD+Pipeline%22)

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

#### Reserved Memory

Some codes store some states in the games memory starting from address 0x817F0000. To avoid collisions use a memory range in the unallocated ranges:

| Status                      | Start   | End     | Description                                                               |
| --------------------------- | ------- | ------- | ------------------------------------------------------------------------- |
| ![](./docs/reserved.svg)    | `0x0`   | `0x7`   | Level Select: Stage Data                                                  |
| ![](./docs/reserved.svg)    | `0x8`   | `0x13`  | DPad Functions: Stored Position (Mario)                                   |
| ![](./docs/reserved.svg)    | `0x14`  | `0x15`  | DPad Functions: Stored Angle (Mario)                                      |
| ![](./docs/reserved.svg)    | `0x16`  | `0x1B`  | DPad Functions: Stored Position (Camera)                                  |
| ![](./docs/reserved.svg)    | `0x20`  | `0x23`  | Coin Count Savestate: Coin Count                                          |
| ![](./docs/unallocated.svg) | `0x24`  | `0x93`  | Not Allocated                                                             |
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
| ![](./docs/reserved.svg)    | `0x110` | `0x237` | QF Timer: Timer Textbox                                                   |
| ![](./docs/reserved.svg)    | `0x238` | `0x347` | General Function (`drawText`)                                             |
| ![](./docs/buffer.svg)      | `0x348` | `0x39B` | Buffer (QF Timer)                                                         |
| ![](./docs/unallocated.svg) | `0x39C` | `0xFFF` | Not Allocated                                                             |

### Adding translations

1. Create a new file `<lang>.json` in `site/.vuepress/i18n`, where `<lang>` is the language code you want to add. Copy the contents of `en-US.json` into your file and translate each entry in the JSON file.
2. Create a new folder with your language code in `site` (such as `site/de` for German). Create a new markdown file for each existing page (`guide.md`, `index.md`, `ios58.md`, ...) and translate its contents from the English version.
3. Create a new entry in `site/.vuepress/i18n/locales.json` with the site metadata and navigation items for your language.
4. Add your locale to the `translations` in `site/.vuepress/i18n/localeHelper.js`.
5. Open `Codes.xml` and add a translation for each code (`<title>` and `<description>`).

### Updating Guides

You can find the guides in the [site](https://github.com/BitPatty/gctGenerator/tree/master/site) folder. Simply edit the corresponding markdown file (.md).

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

- NodeJS 18.x (LTS)
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
