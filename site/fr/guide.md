---
sidebar: auto
---

# Cookbook

Un guide d'installation et d'usage des codes d'entraînement de Super Mario Sunshine sur Nintendont et Dolphin.

[[toc]]

## Préparer votre Wii

### Installer la chaîne Homebrew

Pour commencer, vous devez installer la chaîne Homebrew sur votre Wii. Vérifiez que votre carte SD est formatée en FAT32, puis visitez [https://wii.guide/](https://wii.guide/) pour un guide détaillé (actuellement indisponible en français) sur la marche à suivre.

### Installer les applications nécessaires

Nintendont est l'application recommandée pour utiliser les codes d'entraînement. Vous pouvez télécharger la version la plus récente en [cliquant sur ce lien](https://share.zint.ch/nintendont/latest/Nintendont.zip). Extrayez l'archive et placez le dossier `nintendont` avec tout son contenu dans le dossier `apps` de votre carte SD. S'il n'y a pas de dossier `apps`, créez-en un à la racine de votre carte SD.

## Installer le fichier de codes

### Générer le fichier de codes

Vous devez d'abord savoir quelle version du jeu vous utilisez. Le tableau suivant indique les versions supportées et leurs identifiants respectifs :

| Version                   | Identifiant |
| ------------------------- | ----------- |
| PAL (Europe)              | GMSP01      |
| NTSC-U (Amérique du Nord) | GMSE01      |
| NTSC-J (Japon)            | GMSJ01      |
| NTSC-K (Corée)            | GMSE01      |

::: tip Note pour les joueurs de NTSC-J
JP 1.0 et JP 1.1 partagent le même ID (GMSJ01). Pour identifier quelle version est la vôtre, vérifiez l'arrière du disque. Il y sera écrit « DOL-GMSJ-0-00 » pour 1.0, et « DOL-GMSJ-0-01 » pour 1.1.

![](https://gct.zint.ch/img/jp_diff.png)
:::

Visitez la page principale et sélectionnez la version appropriée dans le menu déroulant. Une liste des codes disponibles apparaîtra. Sélectionnez tous les codes que vous voulez dans la liste, choisissez GCT comme format et cliquez sur « Télécharger ».

### Copier le fichier vers votre carte SD

Create a "codes" folder in the root of your SD card if there is none and copy the GCT file you just downloaded into that folder. This is what the resulting folder structure should look like on your SD card (the .gct files might be different depending on the version you chose):
Créez un dossier `codes` à la racine de votre carte SD s'il n'existe pas déjà, puis copiez le fichier GCT que vous venez de télécharger vers ce dossier. Voici la structure de dossiers que vous devriez obtenir sur votre carte SD (les fichiers .gct peuvent être différents selon la version choisie) :

![Exemple de structure de dossiers](/img/folderstructure.png)

### Activer les codes

Ouvrez la chaîne Homebrew et démarrez Nintendont. Choisissez SD, puis appuyez sur B pour voir les paramètres. Vérifiez que le paramètre « Cheats » est « On ». Vous pouvez changer entre « On » et « Off » en appuyant sur A (voir image ci-dessous).

![Activer les codes dans Nintendont](/img/nintendont_cheats.jpg)

Press B again to return to the game list and launch your game. And with that you're done already.
Appuyez à nouveau sur B pour revenir à la liste des jeux et démarrer le jeu. Et ça y est, la préparation est terminée.

## Résolution de problèmes

### Le jeu ne démarre pas / bloque sur un écran noir

Ce problème n'est pas lié aux codes d'entraînement. Si cela vous arrive, vous avez plusieurs options :

- redémarrer Nintendont jusqu'à ce que le jeu démarre (ça prend généralement quelques essais) ;
- connecter votre Wii à Internet avant de démarrer Nintendont ;
- attendre une trentaine de secondes sur la liste de jeux avant de démarrer ;
- réinstaller la chaîne Homebrew (peut corriger ce problème de manière permanente).

### Nintendont dit qu'il manque IOS58

[Voici](/fr/ios58.html) un guide sur l'installation d'IOS58 pour Nintendont.

### Le jeu démarre mais les codes ne fonctionnent pas

Il peut y avoir plusieurs raisons :

- Vous n'avez pas activé les codes : lisez [la section « Activer les codes »](#activer-les-codes) pour plus de détails.
- Vous utilisez une version obsolète de Nintendont : vérifiez que vous utilisez la version 4.434 ou une plus récente.
- Votre fichier de codes a un nom incorrect : vérifiez que le fichier s'appelle `GMSE01.gct`, `GMSJ01.gct` ou `GMSP01.gct`. Nintendont est très exigeant et ne lira pas des fichiers comme `GMSP01 (1).gct` !
- Votre fichier de codes est dans le mauvais dossier : vérifiez que le fichier est dans le dossier `codes` de votre carte SD. Encore une fois, le dossier doit exactement s'appeler `codes` (vérifiez la structure d'exemple dans [la section « Copier le fichier vers votre carte SD »](#copier-le-fichier-vers-votre-carte-sd)). Si vous avez un dossier `games`, vérifiez qu'il n'y ait pas de fichier du même nom dans ce dossier ou ses sous-dossiers.
- Votre fichier de codes est trop grand : utiliser trop de codes à la fois peut forcer Nintendont à en désactiver certains car l'espace libre dans le jeu est limité. Vérifiez aussi que vous n'avez pas activé deux codes incompatibles en téléchargeant votre fichier (par exemple, « Sélecteur de niveau », « Fast Any% » et le chargeur de liste ne peuvent pas être utilisés en même temps). Si vous utilisez Nintendont 4.434 ou plus récent, la taille du fichier ne devrait pas être un problème à moins que vous dépassiez 8 Ko.
- Si vous avez une clé USB et utilisez un disque, vérifiez que vous choisissez le périphérique qui contient les codes.
- Si vous utilisez une ISO, le fichier de codes et l'ISO doivent être sur le même périphérique (les deux sur la carte SD, ou les deux sur la clé USB).

### Je suis perdu :(

Vous pouvez demander de l'aide sur le [Discord Super Mario Sunshine](https://discord.gg/9dGJWEc).

## Annexe : Cheat Manager

Cheat Manager est une application homebrew qui vous permet de générer vos GCT sur votre Wii. Cela vous évite d'avoir à retélécharger un fichier à chaque fois que vous voulez une combinaison de codes différente. Cependant il vous faut une Wiimote pour naviguer dans cette application.

### Préparation

Vous pouvez télécharger Cheat Manager [ici](/files/Cheat_manager_v0_3.zip). Dézippez l'archive et copiez son contenu dans le dossier `apps` de votre carte SD.

À l'aide du générateur sur la page principale, choisissez les codes auxquels vous voulez avoir accès dans Cheat Manager, et choisissez le format « Cheat Manager TXT » au lieu de « GCT » pour télécharger un fichier texte formaté pour Cheat Manager. Créez un dossier `txtcodes` à la racine de votre carte SD s'il n'existe pas déjà, et copiez-y le fichier texte généré. Le nom du fichier n'est pas important pour cette application, l'ID du jeu se trouve à l'intérieur du fichier.

Vous pouvez également télécharger une archive ZIP contenant tous les codes disponibles sur ce site [ici](/files/GCMCodes.zip).

### Utiliser Cheat Manager

Démarrez Cheat Manager, naviguez jusqu'à votre fichier texte à l'aide de la croix directionnelle et choisissez-le avec A. Sur l'écran suivant, appuyez sur + pour activer un code, et - pour le désactiver.

Une fois que vous avez activé les codes que vous voulez, appuyez sur 1 pour générer le fichier GCT. Cheat Manager crée alors un fichier GCT dans votre dossier `codes`, remplaçant l'ancien s'il y en avait déjà un. Lorsque vous démarrerez le jeu avec les codes activés, les nouveaux codes seront utilisés.

## Annexe : Dolphin

### Préparation

Pour utiliser les codes sur Dolphin, choisissez « Dolphin INI » comme format au lieu de « GCT » pour télécharger les codes formatés pour Dolphin. Vous pouvez également télécharger une archive ZIP contenant tous les codes disponibles sur ce site [ici](/files/DolphinCodes.zip).

::: tip Limite de codes
Dolphin n'utilise pas le même chargeur de codes que Nintendont. Sa limite de codes est atteinte assez rapidement et vous ne pouvez pas voir si les codes que vous avez activés dépassent la limite interne. Si votre jeu plante après avoir activé certains codes, ceci peut en être la raison. Essayez de désactiver les codes non essentiels si cela vous arrive.
:::

### Configuration

#### Activer les codes

Ouvrez Dolphin et naviguez dans les paramètres vers «jOptions » → « Configuration ». Vérifiez que la case nommée « Activer les Cheats » est cochée :

![Activer les codes sur Dolphin](/img/dolphin_cheats.png)

#### Dolphin 5.0 ou plus ancien

Cliquez droit sur le jeu dans Dolphin, puis cliquez sur « Propriétés » et, dans le coin inférieur gauche de la fenêtre, cliquez sur le bouton « Éditer la configuration ». Ouvrez le fichier texte que vous avez téléchargé et copiez tout ce qui suit la balise `[Gecko]` sous la même balise dans le fichier de configuration de Dolphin. S'il n'y a pas de balise `[Gecko]` (il devrait être au début du fichier), ajoutez-en un en haut de votre fichier de configuration. Enregistrez et fermez le fichier de configuration.

![Dolphin Gecko Codes 5.0](/img/dolphin_gecko_codes_v1.png)

#### Dolphin 5.0-11XXX ou plus récent

Cliquez droit sur le jeu dans Dolphin et cliquez sur « Propriétés ». Dans la section « Configuration du jeu », choisissez l'onglet « Éditeur » et collez le contenu du fichier que vous avez téléchargé dans l'éditeur « Configuration personnalisée ».

![Dolphin Gecko Codes 5.0-11XXX](/img/dolphin_gecko_codes_v2.png)

### Utiliser les codes

Sélectionnez l'onglet « Codes Gecko » dans les propriétés du jeu et choisissez les codes que vous voulez. La plupart des codes fonctionnent sur Dolphin.
