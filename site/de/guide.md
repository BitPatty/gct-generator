---
sidebar: auto
---

# Cookbook

Ein Leitfaden für die Installation und Anwendung von Super Mario Sunshine Practice Codes über Nintendont und Dolphin.

[[toc]]

## Vorbereiten der Wii

### Homebrew Installation

Zu Beginn musst du Homebrew auf deiner Wii installieren. Stelle sicher, dass deine SD-Karte FAT32 formattiert ist und besuche dann [https://wii.guide/de_DE/](https://wii.guide/de_DE/) für einen detaillierten Leitfaden zur Installation von Homebrew.

### Installation der Applikationen

Nintendont ist das empfohlene Tool zur Nutzung der Practice Codes. Du kannst die aktuellste Version über [diesen Link](https://zint.ch/NintendontPackager/latest/Nintendont.zip) herunterladen. Entpacke das Archiv und platziere den Nintendont Ordner mit all seinen Inhalten in den 'apps' Ordner auf deiner SD-Karte. Falls es noch keinen 'apps' Ordner gibt, erstelle diesen erst.

## Installation der Cheat-Datei

### Generiere die Cheat-Datei

Zuerst musst du wissen, welche Version des Spiels du verwendest. Die folgende Tabelle zeigt die unterstützten Versionen und den entsprechenden Spiel-Code:

| Version               | Spiel-Code | Disc-Code                 |
| --------------------- | ---------- | ------------------------- |
| PAL (Europa)          | GMSP01     | DOL-GMSP-0-00             |
| NTSC-U (Nord-Amerika) | GMSE01     | DOL-GMSE-0-00             |
| NTSC-J (Japan)        | GMSJ01     | DOL-GMSJ-0-00 / GMSJ-0-01 |
| NTSC-K (Korea)        | GMSE01     | DOL-GMSE-0-30             |

::: tip Tip für NTSC-J-Spieler
JP 1.0 und JP 1.1 verwenden beide dieselbe ID (GMSJ01). Um festzustellen, welche Version du hast, überprüfe die Rückseite deiner Disc. Darauf steht "DOL-GMSJ-0-00" für Version 1.0 und "DOL-GMSJ-0-01" für Version 1.1.

![](/img/jp_diff.png)
:::

Besuche anschliessend die [Hauptseite](./index.md) und wähle die entsprechende Version vom Dropdown-Menü. Eine Liste verfügbarer Codes wird angezeigt. Wähle anschliessend alle Cheats, die du verwenden möchtest von der Liste, wähle GCT als Dateiformat und klicke 'Herunterladen'.

### Kopiere die Datei auf die SD-Karte

Erstelle einen 'codes'-Ordner auf deiner SD-Karte falls es noch keinen gibt und kopiere die eben heruntergeladene GCT-Datei in diesen Ordner. Die resultierende Ordnerstruktur sollte wie folgt aussehen (die .gct Dateien können anders sein, je nach Version die du verwendest);

![Ordnerstruktur](/img/folderstructure.png)

### Aktiviere die Codes

Öffne den Homebrew Kanal auf deiner Wii und starte von dort aus Nintendont. In Nintendont, wähle SD und dann drücke B auf deinem Gamecube Controller um die Einstellungen zu sehen. Stelle sicher, dass in deinen Einstellungen die Cheats eingeschaltet sind ('On'). Du kannst sie über die A-Taste aktivieren/deaktivieren.

![Cheats in Nintendont aktivieren](/img/nintendont_cheats.jpg)

Drücke erneut B um zurück zur Spielliste zu gelangen und starte das Spiel. Die Cheats sollten nun aktiv sein.

## Problembehebung

### Das Spiel startet nicht / Schwarzer Bildschirm

Dieses Problem hat nichts mit den Practice Codes zu tun. Du hast in diesem Fall die folgenden Optionen:

- Starte Nintendont erneut bis das game startet (benötigt teilweise mehrere Versuche)
- Verbinde deine Wii mit dem Internet bevor du Nintendont startest
- Warte für ungefähr 30 Sekunden auf der Spielliste bevor du die Disc startest
- Eine Neuinstallation von Homebrew kann das Problem permanent beheben.

### Nintendont sagt 'IOS58 is missing'

[Hier](./ios58.md) ist ein Leitfaden für die Installation von IOS58 für die Verwendung mit Nintendont.

### Das Spiel startet aber die Codes funktionieren nicht

Dies kann mehrere Ursachen haben:

- Cheats sind nicht aktiviert: Siehe ["Aktiviere die Codes"](#aktiviere-die-codes).
- Du verwendest eine alte Version von Nintendont. Stell sicher, dass du mindestens Version 4.434 oder neuer verwendest.
- Deine Datei hat den falschen Namen: Stell sicher, dass die Datei 'GMSE01.gct', 'GMSJ01.gct' oder 'GMSP01.gct' heisst. Es funktioniert nicht mit Namen wie beispielsweise 'GMSP01 (1).gct'.
- Deine Datei ist am falschen Ort: Stell sicher, dass die Datei im Ordner 'codes' ist. Achte hiebei wieder darauf, dass der Ordner auch genau so heisst. Falls du einen 'games'-Ordner hast, stelle sicher dass es keine Datei mit demselben Namen in dem Ordner oder einem Unterordner gibt.
- Deine Datei ist zu gross: Zu viele Codes deaktivieren Nintendonts Cheat-Funktion. Stelle sicher, dass du nicht zwei inkompatible Codes aktiviert hast (Beispielsweise 'Level Select' und 'Fast Any%' sind nicht kompatibel).
- Falls du ein USB-Laufwerk verwendest und über die Disc spielst, stelle sicher dass du bei Nintendont das Gerät auswählst, welches die Cheat Codes enthält.
- Falls du eine ISO verwendest, müssen die Codes und die ISO auf demselben Gerät sein (beide auf der SD-Karte oder beide auf dem USB-Laufwerk)

### Ich weiss nicht weiter :(

Du kannst auch im [Super Mario Sunshine Discord](https://discord.gg/9dGJWEc) unter dem #help Kanal nach Hilfe fragen.

## Appendix: Cheat Manager

Der Cheat Manager ist eine Applikation für Homebrew (wie Nintendont), mit welcher du GCT's auf deiner Wii generieren kannst. Für den Prozess brauchst du die Applikation sowie eine Wiimote.

### Setup

Du kannst den Cheat Manager von [hier herunterladen](/files/Cheat_manager_v0_3.zip). Entpacke das Archiv und kopiere den Inhalt in den 'apps'-Ordner auf deiner SD-Karte.

Wähle mittels des Generators auf der [Hauptseite](./index.md) alle Codes aus, auf welche du im Cheat Manager Zugriff haben möchtest. Setze zusätzlich das Dateiformat auf 'Cheat Manager TXT' anstelle von 'GCT'. Erstelle anschliessend einen 'txtcodes'-Ordner auf deiner SD-Karte und kopiere die generierte Datei in den eben erstellten Ordner. Der Name der Datei spielt in diesem Fall im Gegensatz zur GCT-Datei keine grosse Rolle.

Alternativ kannst du ein Archiv mit allen verfügbaren Codes direkt von [hier herunterladen](/files/GCMCodes.zip).

### Den Cheat Manager verwenden

Starte den Cheat Manager und wechsle zu deiner Wiimote. Navigiere zu deiner Textdatei mittels des DPad und wähle es mittels des 'A'-Knopfes. Verwende auf dem nächsten Screen '+' um einen Code zu aktivieren und '-' um ihn zu deaktivieren.

Nachdem du alle Codes, die du aktiviert haben möchtest, aktiviert hast, verwende den '1'-Knopf um die GCT-Datei zu generieren. Der Cheat Manager schreibt dabei eine GCT Datei in deinem 'codes'-Ordner und überschreibt allfällige alte Dateien mit demselben Namen. Wenn du nun Nintendont startest, werden die neuen Codes geladen.

## Appendix: Dolphin

### Setup

Um die Codes mit Dolphin zu verwenden wähle 'Dolphin INI' als Dateiformat anstelle von 'GCT' bevor du die Codes herunterlädst. Alternativ kannst du ein ZIP-Archiv mit allen Codes von [hier herunterladen](/files/DolphinCodes.zip).

::: tip Code Limits
Dolphin verwendet nicht dieselbe Technik für das Laden von Cheats wie Nintendont und erreicht das Code-Limit relativ rasch. Falls dein Spiel nach dem Start abstürzt, liegt es vermutlich an diesem Limit. Versuche alle nicht-essentiellen Codes zu deaktivieren falls das passiert.
:::

### Konfiguration

#### Cheats aktivieren

Öffne Dolphin und öffne die Einstellungen über `Optionen` -> `Konfiguration`. Stelle im Einstellungsfenster sicher, dass das Häkchen bei `Cheats aktivieren` gesetzt ist:

![Enable Cheats in Dolphin](/img/dolphin_cheats.png)

#### Dolphin 5.0 oder älter

Wechsle in die Eigenschaften des Spiels mittels Rechtsklick -> Eigenschaften. Klicke 'Konfiguration bearbeiten' im neuen Fenster und kopiere den gesamten Inhalt (nach dem `[Gecko]`-Tag) der heruntergeladenen Datei an die entsprechende Stelle in der Konfigurationsdatei. Falls es noch keinen `[Gecko]`-Tag gibt (es sollte der erste sein), erstelle erst einen am Anfang deiner Konfigurationsdatei. Speichere und schliesse die Datei.

![Dolphin Gecko Codes 5.0](/img/dolphin_gecko_codes_v1.png)

#### Dolphin 5.0-11XXX oder neuer

Wechsle in die Eigenschaften des Spiels mittels Rechtsklick -> Eigenschaften. Im 'Konfigurations'-Abschnitt wähle den Editor Tab und kopiere den Inhalt der heruntergeladenen Datei in den Editor.

![Dolphin Gecko Codes 5.0-11XXX](/img/dolphin_gecko_codes_v2.png)

### Aktivieren der Codes

Wähle in den Eigenschaften des Spiels die Gecko-Registerkarte und setze ein Häkchen bei allen Cheats, die du aktiviert haben möchtest. Die meisten (aber nicht alle) Codes funktionieren mit Dolphin.
