(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{249:function(e,a,i){"use strict";i.d(a,"a",(function(){return d})),i.d(a,"b",(function(){return p}));var o=i(276),n=i(277),l=i(278),s=i(279);const r={enUS:o,deCH:n,frFR:l,jaJP:s},t=(e,a,i,o,n=!1)=>{const l=n?"html":"content",s=e[a].find(e=>e.lang===i),r=e[a].find(e=>e.lang===o);s&&s[l]?e[a]=s[l]:r&&r[l]?e[a]=r[l]:e[a]=null},c=(e,a)=>{if(a){const i=a.replace("-","");if(null!=r[i]){const a=((e,a)=>{const i=a.split(".");try{let a=e[i.shift()];for(;i.length>0;)a=a[i.shift()];return a}catch{return null}})(r[i],e);if(a)return a}}return null},d=(e,a,i="en-US")=>{const o=c(e,a);return o||c(e,i)},p=(e,a,i="en-US")=>{const o={};return Object.assign(o,e),t(o,"title",a,i),t(o,"description",a,i,!0),o}},276:function(e){e.exports=JSON.parse('{"common":{"download":"Download","yes":"Yes","no":"No","GMSE01":"GMSE01 (NTSC-U)","GMSJ01":"GMSJ01 (NTSC-J 1.0)","GMSJ0A":"GMSJ01 (NTSC-J 1.1)","GMSP01":"GMSP01 (PAL)","loadpresetplaceholder":"Load a preset..","selectionreset":"This will reset your selection, continue?","discard":"This will discard all your changes, continue?"},"codeeditor":{"fields":{"title":{"label":"Title","placeholder":"N/A"},"value":{"label":"Gecko Code","placeholder":"Your Gecko Code.."}},"save":"Save"},"headers":{"codelist":"Available Codes","help":"Help","stageloader":"Stage List Loader"},"codeinfo":{"author":"Author:","authors":"Authors:","version":"Version:"},"generatorconfig":{"gameversion":{"label":"Game Version:","placeholder":"Choose Version.."},"downloadformat":{"label":"Download Format:","options":{"gct":"GCT","dolphin":"Dolphin INI","gcm":"CheatManager TXT","gci+gct":"GCI + GCT (Experimental)","gci+dolphin":"GCI + Dolphin INI (Experimental)","gci+gcm":"GCI + CheatManager TXT (Experimental)","gci":"GCI (Experimental)"}},"alert":{"gct":"The generated GCT file size exceeds 5000 bytes ({size} bytes). All of the codes may not work when using this file on Nintendont. Do you wish to download anyway?","dolphin":"The total code size exceeds 3256 bytes ({size} bytes). All of the codes may not work when all of them are enabled on Dolphin. Try to disable some codes in that case. Do you wish to download anyway?","gci-compatibility":"The following code is not included in the GCI file due to incompatibility: "},"categories":{"qol":"Quality of Life","loader":"Loaders","timer":"Timers","savestate":"Savestate","misc":"Misc","memcardpatch":"Memory Card Patches","cosmetic":"Cosmetic","custom":"Custom","metadata":"Metadata Display"},"presets":{"standard":"Standard","recommended":"Recommended","il":"IL Runs","fap":"Fast Any%","hfsetup":"Hacked File Setup","@lastDLCodes":"(Previous Downloaded Codes)"}},"landingpage":{"title":"Super Mario Sunshine Practice File Generator","summary":"This is a cheatfile generator for Super Mario Sunshine speedrun practice. If this is your first time using the generator we highly recommend to check out the <a href=\'/guide.html\' target=\'_blank\'>guide</a> first. Visit the  <a href=\'/guide.html#troubleshooting\' target=\'_blank\'>the troubleshooting section</a> if you encounter any issues. For an overview of all available codes check out the <a href=\'/code-reference\' target=\'_blank\'>code reference</a>.","community":"The SMS Speedrunning Community","links":{"discord":"Discord","discordlink":"https://discord.gg/9dGJWEc","twitter":"Twitter: @SMSCommunity","twitch":"Twitch: SunshineCommunity","src":"Speedrun.com Leaderboards"}},"stageloader":{"help":"Loads levels in a customized order.","levelorder":{"label":"Level Order","options":{"list":"As specified","shuffle":"Random, no duplicates","random":"Fully random"}},"removedialogue":{"label":"Remove Dialogue:","options":{"pv5":"Not in Pianta 5","yes":"Always","no":"Don\'t include"}},"skippablefmvs":{"label":"Skippable FMVs:","options":{"pp":"Not in Pinna","yes":"Always","no":"Don\'t include"}},"postgame":{"label":"Post-Game:","options":{"3400":"Load Corona Mountain","0F00":"Return to the title screen","0109":"Load the flooded plaza","0102":"Load post-Corona plaza","3C00":"Load the Bowser fight"}},"levels":{"delfinoplaza":{"header":"Delfino Plaza","current":"Plaza - Current","biancounlock":"Plaza - Bianco Unlock","peachchase":"Plaza - Peach Chase","riccounlock":"Plaza - Ricco / Gelato unlocks","peaceful":"Plaza - Peaceful","pinnaunlock":"Plaza - Pinna Unlock","yoshiunlock":"Plaza - Yoshi / nozzles unlocks","flooded":"Plaza - Flooded","postcorona":"Plaza - Post-Corona"},"delfinosublevels":{"header":"Delfino Plaza Sublevels","airstrip":"Airstrip","airstripreds":"Airstrip (red coins)","slide":"Slide","pachinko":"Pachinko","grasspipe":"Grass pipe","lilypad":"Lily Pad Ride","jail":"Jail Secret"},"secrets":{"header":"Secret Areas","bianco3":"Bianco 3 Secret","bianco6":"Bianco 6 Secret","ricco4":"Ricco 4 Secret","gelato1":"Gelato 1 Secret","pinna2":"Pinna 2 Secret","pinna6":"Pinna 6 Secret","sirena2":"Sirena 2 Secret","sirena4":"Sirena 4 Secret","noki6":"Noki 6 Secret","pianta5":"Pianta 5 Secret"},"sublevels":{"header":"Sublevels","petey":"Petey Piranha fight (Bianco 2)","gooperblooper":"Gooper Blooper fight (Ricco 1)","sewers":"Race course (Ricco 2)","sandbird":"Sand bird (Gelato 4)","mecha":"Mecha-Bowser fight (Pinna 1)","rollercoaster":"Rollercoaster (Pinna 8)","casino1":"Casino Delfino (Sirena 4)","casino2":"Casino Delfino (Sirena 5)","kingboo":"King Boo fight (Sirena 5)","bottle":"Bottle (Noki 3)","eel":"Deep Sea of Mare (Noki 4)","nokireds":"Deep Sea of Mare (Noki 8)"},"misc":{"header":"Miscellaneous","biancoepisodeselect":"Bianco episode selection","riccoepisodeselect":"Ricco episode selection","gelatoepisodeselect":"Gelato episode selection","pinnaepisodeselect":"Pinna episode selection","sirenaepisodeselect":"Sirena episode selection","nokiepisodeselect":"Noki episode selection","piantaepisodeselect":"Pianta episode selection"},"bianco":{"1":"Bianco 1","2":"Bianco 2","3":"Bianco 3","4":"Bianco 4","5":"Bianco 5","6":"Bianco 6","7":"Bianco 7","8":"Bianco 8","header":"Bianco Hills"},"ricco":{"1":"Ricco 1","2":"Ricco 2","3":"Ricco 3","4":"Ricco 4","5":"Ricco 5","6":"Ricco 6","7":"Ricco 7","8":"Ricco 8","header":"Ricco Harbor"},"gelato":{"1":"Gelato 1","2":"Gelato 2","3":"Gelato 3","4":"Gelato 4","5":"Gelato 5","6":"Gelato 6","7":"Gelato 7","8":"Gelato 8","header":"Gelato Beach"},"pinna":{"1":"Pinna 1","2":"Pinna 2","3":"Pinna 3","4":"Pinna 4","5":"Pinna 5","6":"Pinna 6","7":"Pinna 7","8":"Pinna 8","header":"Pinna Park"},"sirena":{"1":"Sirena 1","2":"Sirena 2","3":"Sirena 3","4":"Sirena 4","5":"Sirena 5","6":"Sirena 6","7":"Sirena 7","8":"Sirena 8","header":"Sirena Beach"},"noki":{"1":"Noki 1","2":"Noki 2","3":"Noki 3","4":"Noki 4","5":"Noki 5","6":"Noki 6","7":"Noki 7","8":"Noki 8","header":"Noki Bay"},"pianta":{"1":"Pianta 1","2":"Pianta 2","3":"Pianta 3","4":"Pianta 4","5":"Pianta 5","6":"Pianta 6","7":"Pianta 7","8":"Pianta 8","header":"Pianta Village"}},"presets":{"fullgameminimalplaza":{"header":"Full-game categories, minimal plaza","fapnormal":"Fast Any% usual route","fapriccolate":"Fast Any% Ricco late","fap49":"Fast Any% No Major Skips","fap58":"Fast 58 Shines / All Episodes","fap79":"Fast 79 Shines / All Level Shines","fap96":"Fast 96 Shines / All Shines, No Blues"},"fullgamecategories":{"49":"Any% No Major Skips","58":"58 Shines / All Episodes","79":"79 Shines / All Level Shines","96":"96 Shines / All Shines, No Blues","120":"120 Shines / All Shines, All Blues","header":"Full-game categories","anyp":"Any% usual route"},"iw":{"header":"Individual Worlds","bianco":"Bianco Hills","ricco":"Ricco Harbor","gelato":"Gelato Beach","pinna":"Pinna Park","sirena":"Sirena Beach","noki":"Noki Bay","pianta":"Pianta Village"},"iwallshines":{"header":"Individual Worlds (all Shines)","bianco":"Bianco Hills","ricco":"Ricco Harbor","gelato":"Gelato Beach","pinna":"Pinna Park","sirena":"Sirena Beach","noki":"Noki Bay","pianta":"Pianta Village"}},"levelselectplaceholder":"Choose a level..","route":"Route","clear":"Clear List"},"misc":{"defaulthelpmessage":"Select your codes from the list on the left."}}')},277:function(e){e.exports=JSON.parse('{"common":{"download":"Herunterladen","yes":"Ja","no":"Nein","GMSE01":"GMSE01 (NTSC-U)","GMSJ01":"GMSJ01 (NTSC-J 1.0)","GMSJ0A":"GMSJ01 (NTSC-J 1.1)","GMSP01":"GMSP01 (PAL)","loadpresetplaceholder":"Lade eine Vorlage..","selectionreset":"Deine Auswahl wird zurückgesetzt. Fortfahren?","discard":"Deine Änderungen werden zurückgesetzt, fortfahren?"},"codeeditor":{"fields":{"title":{"label":"Titel","placeholder":"N/A"},"value":{"label":"Gecko Code","placeholder":"Dein Gecko Code.."}},"save":"Speichern"},"headers":{"help":"Hilfe","codelist":"Verfügbare Codes","stageloader":"Stage List Loader"},"codeinfo":{"author":"Autor:","authors":"Autoren:","version":"Version:"},"generatorconfig":{"gameversion":{"label":"Spiel Version:","placeholder":"Wähle Version.."},"downloadformat":{"label":"Download Format:","options":{"gct":"GCT","dolphin":"Dolphin INI","gcm":"CheatManager TXT","gci+gct":"GCI + GCT (Experimental)","gci+dolphin":"GCI + Dolphin INI (Experimental)","gci+gcm":"GCI + CheatManager TXT (Experimental)","gci":"GCI (Experimental)"}},"categories":{"qol":"Allgemein","loader":"Loader","timer":"Timer","misc":"Misc","memcardpatch":"Memory Card Patches","cosmetic":"Kosmetisch","custom":"Benutzerdefiniert","metadata":"Metadaten Anzeige"},"presets":{"standard":"Standard","recommended":"Empfohlen","il":"IL Runs","fap":"Fast Any%","hfsetup":"Hacked File Setup"}},"landingpage":{"title":"Super Mario Sunshine Practice File Generator","summary":"Ein Cheat-Datei-Generator für Super Mario Sunshine Speedruns. Falls du den Generator bisher nie verwendet hast, empfehlen wir dir erst den <a href=\'/de/guide.html\' target=\'_blank\'>Guide</a> durchzulesen. Falls etwas nicht funktioniert findest du im Abschnitt \'Problembehebung\' einige Infos.","community":"Die SMS Speedrunning Community","links":{"discord":"Discord","discordlink":"https://discord.gg/9dGJWEc","twitter":"Twitter: @SMSCommunity","twitch":"Twitch: SunshineCommunity","src":"Speedrun.com Ranglisten"}},"stageloader":{"help":"Ladet die Level in einer benutzerdefinierten Reihenfolge.","levelorder":{"label":"Level Reihenfolge:","options":{"list":"Wie angegeben","shuffle":"Mixen","random":"Zufällig"}},"postgame":{"label":"Nach der Route:","options":{"3400":"Lade Korona","0F00":"Zurück zum Titelbildschirm","0109":"Lade die geflutete Plaza","0102":"Lade Post-Korona Plaza","3C00":"Lade den Bowserkampf"}},"levels":{"delfinoplaza":{"header":"Isla Delfino","current":"Delfino - Aktuell","biancounlock":"Delfino - Bianco Freischaltung","peachchase":"Delfino - Peach Jagd","riccounlock":"Delfino - Porto d\'Oro / Playa del Sol Freischaltung","peaceful":"Delfino - Friedlich","pinnaunlock":"Delfino - Isla Fortuna Unlock","yoshiunlock":"Delfino - Yoshi / Düsen Freischaltung","flooded":"Delfino - Geflutet","postcorona":"Delfino - Post-Korona"},"delfinosublevels":{"header":"Delfino Unterlevel","airstrip":"Flugplatz","airstripreds":"Flugplatz (Rote Münzen)","slide":"Rutsche","pachinko":"Pachinko","grasspipe":"Gras-Röhre","lilypad":"Seerosen-Wildwasserfahrt","jail":"Gefängnis"},"secrets":{"header":"Geheime Level","bianco3":"Monte Bianco 3 Geheimnis","bianco6":"Monte Bianco 6 Geheimnis","ricco4":"Porto d\'Oro 4 Geheimnis","gelato1":"Playa del Sol 1 Geheimnis","pinna2":"Isla Fortuna 2 Geheimnis","pinna6":"Isla Fortuna 6 Geheimnis","sirena2":"Lido Sirena 2 Geheimnis","sirena4":"Lido Sirena 4 Geheimnis","noki6":"Baia Paradiso 6 Geheimnis","pianta5":"Baia Paradiso 5 Geheimnis"},"sublevels":{"header":"Unterlevel","petey":"Mutant-Tyranha Kampf (Monte Bianco 2)","gooperblooper":"Riesen-Blooper Kampf (Porto d\'Oro 1)","sewers":"Blooper-Rennen (Porto d\'Oro 2)","sandbird":"Sandvogel (Playa del Sol 4)","mecha":"Mecha-Bowser Kampf (Isla Fortuna 1)","rollercoaster":"Achterbahn (Isla Fortuna 8)","casino1":"Casino Delfino (Lido Sirena 4)","casino2":"Casino Delfino (Lido Sirena 5)","kingboo":"König Buu Huu Kampf (Lido Sirena 5)","bottle":"Flasche (Baia Paradiso 3)","eel":"Riesen-Aal (Baia Paradiso 4)","nokireds":"Baia Paradiso Rote Münzen (Baia Paradiso 8)"},"misc":{"header":"Verschiedenes","biancoepisodeselect":"Monte Bianco Episodenwahl","riccoepisodeselect":"Porto d\'Oro Episodenwahl","gelatoepisodeselect":"Playa del Sol Episodenwahl","pinnaepisodeselect":"Isla Fortuna Episodenwahl","sirenaepisodeselect":"Lido Sirena Episodenwahl","nokiepisodeselect":"Baia Paradiso Episodenwahl","piantaepisodeselect":"Plaza della Palma Episodenwahl"},"bianco":{"1":"Monte Bianco 1","2":"Monte Bianco 2","3":"Monte Bianco 3","4":"Monte Bianco 4","5":"Monte Bianco 5","6":"Monte Bianco 6","7":"Monte Bianco 7","8":"Monte Bianco 8","header":"Monte Bianco"},"ricco":{"1":"Porto d\'Oro 1","2":"Porto d\'Oro 2","3":"Porto d\'Oro 3","4":"Porto d\'Oro 4","5":"Porto d\'Oro 5","6":"Porto d\'Oro 6","7":"Porto d\'Oro 7","8":"Porto d\'Oro 8","header":"Porto d\'Oro"},"gelato":{"1":"Playa del Sol 1","2":"Playa del Sol 2","3":"Playa del Sol 3","4":"Playa del Sol 4","5":"Playa del Sol 5","6":"Playa del Sol 6","7":"Playa del Sol 7","8":"Playa del Sol 8","header":"Playa del Sol"},"pinna":{"1":"Isla Fortuna 1","2":"Isla Fortuna 2","3":"Isla Fortuna 3","4":"Isla Fortuna 4","5":"Isla Fortuna 5","6":"Isla Fortuna 6","7":"Isla Fortuna 7","8":"Isla Fortuna 8","header":"Isla Fortuna"},"sirena":{"1":"Lido Sirena 1","2":"Lido Sirena 2","3":"Lido Sirena 3","4":"Lido Sirena 4","5":"Lido Sirena 5","6":"Lido Sirena 6","7":"Lido Sirena 7","8":"Lido Sirena 8","header":"Lido Sirena"},"noki":{"1":"Baia Paradiso 1","2":"Baia Paradiso 2","3":"Baia Paradiso 3","4":"Baia Paradiso 4","5":"Baia Paradiso 5","6":"Baia Paradiso 6","7":"Baia Paradiso 7","8":"Baia Paradiso 8","header":"Baia Paradiso"},"pianta":{"1":"Plaza della Palma 1","2":"Plaza della Palma 2","3":"Plaza della Palma 3","4":"Plaza della Palma 4","5":"Plaza della Palma 5","6":"Plaza della Palma 6","7":"Plaza della Palma 7","8":"Plaza della Palma 8","header":"Plaza della Palma"}},"presets":{"fullgameminimalplaza":{"header":"Komplett-Spiel-Kategorien, ohne Delfino","fapnormal":"Fast Any% normale Route","fapriccolate":"Fast Any% Ricco spät","fap49":"Fast Any% No Major Skips","fap58":"Fast 58 Shines / All Episodes","fap79":"Fast 79 Shines / All Level Shines","fap96":"Fast 96 Shines / All Shines, No Blues"},"fullgamecategories":{"49":"Any% No Major Skips","58":"58 Shines / All Episodes","79":"79 Shines / All Level Shines","96":"96 Shines / All Shines, No Blues","120":"120 Shines / All Shines, All Blues","header":"Komplett-Spiel-Kategorien","anyp":"Any% normale Route"},"iw":{"header":"Individuelle Welten","bianco":"Monte Bianco","ricco":"Porto d\'Oro","gelato":"Playa del Sol","pinna":"Isla Fortuna","sirena":"Lido Sirena","noki":"Baia Paradiso","pianta":"Plaza della Palma"},"iwallshines":{"header":"Individuelle Welten (alle Insignien)","bianco":"Monte Bianco","ricco":"Porto d\'Oro","gelato":"Playa del Sol","pinna":"Isla Fortuna","sirena":"Lido Sirena","noki":"Baia Paradiso","pianta":"Plaza della Palma"}},"removedialogue":{"label":"Dialoge entfernen:","options":{"pv5":"Nicht in Pianta 5","yes":"Immer","no":"Nie"}},"skippablefmvs":{"label":"Überspringbare FMVs:","options":{"pp":"Nicht in Pinna","yes":"Immer","no":"Nie"}},"levelselectplaceholder":"Wähle ein Level..","route":"Route","clear":"Liste leeren"},"misc":{"defaulthelpmessage":"Wähle deine Codes von der Liste auf der linken Seite."}}')},278:function(e){e.exports=JSON.parse('{"common":{"download":"Télécharger","yes":"Oui","no":"Non","GMSE01":"GMSE01 (NTSC-U)","GMSJ01":"GMSJ01 (NTSC-J 1.0)","GMSJ0A":"GMSJ01 (NTSC-J 1.1)","GMSP01":"GMSP01 (PAL)","loadpresetplaceholder":"Charger une liste prédéfinie…"},"headers":{"codelist":"Codes disponibles","help":"Aide","stageloader":"Chargeur de liste"},"codeinfo":{"author":"Auteur :","authors":"Auteurs :","version":"Version :"},"generatorconfig":{"gameversion":{"label":"Version du jeu :","placeholder":"Choisissez une version…"},"downloadformat":{"label":"Format de fichier :","options":{"gct":"GCT","dolphin":"Dolphin INI","gcm":"CheatManager TXT","gci+gct":"GCI + GCT (Experimental)","gci+dolphin":"GCI + Dolphin INI (Experimental)","gci+gcm":"GCI + CheatManager TXT (Experimental)","gci":"GCI (Experimental)"}}},"landingpage":{"title":"Générateur de fichiers de codes d\'entraînement pour Super Mario Sunshine","summary":"Ceci est un générateur de fichiers de codes pour l\'entraînement au speedrun de Super Mario Sunshine. Si c\'est la première fois que vous utilisez le générateur, nous vous recommandons avant tout de consulter le <a href=\'/guide.html\' target=\'_blank\'>guide</a>. Visitez la <a href=\'/guide.html#résolution-de-problèmes\' target=\'_blank\'>section de résolution</a> si vous rencontrez des problèmes.","community":"La communauté de speedrun SMS","links":{"discord":"Discord","discordlink":"https://discord.gg/9dGJWEc","twitter":"Twitter : @SMSCommunity","twitch":"Twitch : SunshineCommunity","src":"Classements Speedrun.com"}},"stageloader":{"levelorder":{"label":"Ordre des niveaux","options":{"list":"Comme spécifié","shuffle":"Aléatoire, sans répétition","random":"Complètement aléatoire"}},"removedialogue":{"label":"Suppression des dialogues :","options":{"pv5":"Pas dans Pianta 5","yes":"Toujours","no":"Ne pas inclure"}},"skippablefmvs":{"label":"FMV passables :","options":{"pp":"Pas dans Pinna","yes":"Toujours","no":"Ne pas inclure"}},"postgame":{"label":"Fin de partie :","options":{"3400":"Charger le Mont Corona","0F00":"Retourner à l\'écran titre","0109":"Charger la place inondée","0102":"Charger la place finale","3C00":"Charger le combat contre Bowser"}},"levels":{"delfinoplaza":{"header":"Place Delfino","current":"Place - Actuelle","biancounlock":"Place - Débloquage de Bianco","peachchase":"Place - Course-poursuite de Peach","riccounlock":"Place - Débloquages de Ricco / Gelato","peaceful":"Place - Paisible","pinnaunlock":"Place - Débloquage de Pinna","yoshiunlock":"Place - Débloquage de Yoshi / des buses","flooded":"Place - Inondée","postcorona":"Place - Finale"},"delfinosublevels":{"header":"Niveaux de la Place Delfino","airstrip":"Aéroport","airstripreds":"Aéroport (pièces rouges)","slide":"Toboggan","pachinko":"Pachinko","grasspipe":"Hautes herbes","lilypad":"Voyage en nénuphar","jail":"Secret de la prison"},"secrets":{"header":"Niveaux secrets","bianco3":"Secret de Bianco 3","bianco6":"Secret de Bianco 6","ricco4":"Secret de Ricco 4","gelato1":"Secret de Gelato 1","pinna2":"Secret de Pinna 2","pinna6":"Secret de Pinna 6","sirena2":"Secret de Sirena 2","sirena4":"Secret de Sirena 4","noki6":"Secret de Noki 6","pianta5":"Secret de Pianta 5"},"sublevels":{"header":"Zones secondaires","petey":"Combat contre Flora Piranha (Bianco 2)","gooperblooper":"Combat contre Méga-Bloups (Ricco 1)","sewers":"Circuit de surf (Ricco 2)","sandbird":"Oiseau de sable (Gelato 4)","mecha":"Combat contre Mecha-Bowser (Pinna 1)","rollercoaster":"Montagnes russes (Pinna 8)","casino1":"Casino Delfino (Sirena 4)","casino2":"Casino Delfino (Sirena 5)","kingboo":"Combat contre le Roi Boo (Sirena 5)","bottle":"Bouteille (Noki 3)","eel":"Fond de l\'océan (Noki 4)","nokireds":"Fond de l\'océan (Noki 8)"},"misc":{"header":"Divers","biancoepisodeselect":"Sélection d\'épisode de Bianco","riccoepisodeselect":"Sélection d\'épisode de Ricco","gelatoepisodeselect":"Sélection d\'épisode de Gelato","pinnaepisodeselect":"Sélection d\'épisode de Pinna","sirenaepisodeselect":"Sélection d\'épisode de Sirena","nokiepisodeselect":"Sélection d\'épisode de Noki","piantaepisodeselect":"Sélection d\'épisode de Pianta"},"bianco":{"1":"Bianco 1","2":"Bianco 2","3":"Bianco 3","4":"Bianco 4","5":"Bianco 5","6":"Bianco 6","7":"Bianco 7","8":"Bianco 8","header":"Collines Bianco"},"ricco":{"1":"Ricco 1","2":"Ricco 2","3":"Ricco 3","4":"Ricco 4","5":"Ricco 5","6":"Ricco 6","7":"Ricco 7","8":"Ricco 8","header":"Port Ricco"},"gelato":{"1":"Gelato 1","2":"Gelato 2","3":"Gelato 3","4":"Gelato 4","5":"Gelato 5","6":"Gelato 6","7":"Gelato 7","8":"Gelato 8","header":"Gelato-les-Flots"},"pinna":{"1":"Pinna 1","2":"Pinna 2","3":"Pinna 3","4":"Pinna 4","5":"Pinna 5","6":"Pinna 6","7":"Pinna 7","8":"Pinna 8","header":"Parc Pinna"},"sirena":{"1":"Sirena 1","2":"Sirena 2","3":"Sirena 3","4":"Sirena 4","5":"Sirena 5","6":"Sirena 6","7":"Sirena 7","8":"Sirena 8","header":"Plage Sirena"},"noki":{"1":"Noki 1","2":"Noki 2","3":"Noki 3","4":"Noki 4","5":"Noki 5","6":"Noki 6","7":"Noki 7","8":"Noki 8","header":"Baie Noki"},"pianta":{"1":"Pianta 1","2":"Pianta 2","3":"Pianta 3","4":"Pianta 4","5":"Pianta 5","6":"Pianta 6","7":"Pianta 7","8":"Pianta 8","header":"Village Pianta"}},"presets":{"fullgameminimalplaza":{"header":"Catégories jeu complet, sans place Delfino","fapnormal":"Fast Any% route habituelle","fapriccolate":"Fast Any% Ricco en dernier","fap49":"Fast Any% No Major Skips","fap58":"Fast 58 Shines / Tous les épisodes","fap79":"Fast 79 Shines / Tous les Shines des niveaux","fap96":"Fast 96 Shines / Tous les Shines, pas de pièces bleues"},"fullgamecategories":{"49":"Any% No Major Skips","58":"58 Shines / Tous les épisodes","79":"79 Shines / Tous les Shines des niveaux","96":"96 Shines / Tous les Shines, pas de pièces bleues","120":"120 Shines / Tous les Shines, toutes les pièces bleues","header":"Catégories jeu complet","anyp":"Any% route habituelle"},"iw":{"header":"Mondes individuels","bianco":"Collines Bianco","ricco":"Port Ricco","gelato":"Gelato-les-Flots","pinna":"Parc Pinna","sirena":"Plage Sirena","noki":"Baie Noki","pianta":"Village Pianta"},"iwallshines":{"header":"Mondes individuels (tous les Shines)","bianco":"Collines Bianco","ricco":"Port Ricco","gelato":"Gelato-les-Flots","pinna":"Parc Pinna","sirena":"Plage Sirena","noki":"Baie Noki","pianta":"Village Pianta"}},"levelselectplaceholder":"Choisir un niveau…","route":"Route","clear":"Effacer la liste"},"misc":{"defaulthelpmessage":"Choisissez vos codes dans la liste à gauche."}}')},279:function(e){e.exports=JSON.parse('{"common":{"download":"ダウンロード","yes":"Yes","no":"No","GMSE01":"GMSE01 (NTSC-U)","GMSJ01":"GMSJ01 (NTSC-J 1.0)","GMSJ0A":"GMSJ01 (NTSC-J 1.1)","GMSP01":"GMSP01 (PAL)","loadpresetplaceholder":"プリセットをロードします.."},"headers":{"codelist":"利用可能なコード","help":"説明","stageloader":"ステージローダー"},"codeinfo":{"author":"作者:","authors":"作者:","version":"バージョン:"},"generatorconfig":{"gameversion":{"label":"ゲームバージョン","placeholder":"バージョンを選択…"},"downloadformat":{"label":"ダウンロードフォーマット","options":{"gct":"GCT","dolphin":"Dolphin INI","gcm":"CheatManager TXT","gci+gct":"GCI + GCT (Experimental)","gci+dolphin":"GCI + Dolphin INI (Experimental)","gci+gcm":"GCI + CheatManager TXT (Experimental)","gci":"GCI (Experimental)"}},"presets":{"standard":"標準","recommended":"おすすめ","il":"IL Runs","fap":"Fast Any%","hfsetup":"Hacked Fileセットアップ","@lastDLCodes":"(前回ダウンロードしたコード)"},"alert":{"gct":"生成されたGCTファイルのサイズが5000バイトを超えました({size}バイト)。NintendontでこのGCTファイルを使う時、全ての機能が動作しなくなることがあるため、5000バイトを超えないようにいくつかの機能を減らすことをおすすめします。","dolphin":"コードの合計サイズが3256バイトを超えました({size}バイト)。Dolphinで全てのコードをONにすると、全ての機能が動作しなくなることがあります。その場合はいくつかのコードをOFFにしてください。","gci-compatibility":"互換性がないため次のコードはGCIファイルに含まれません："}},"landingpage":{"title":"スーパーマリオサンシャイン練習用ファイルジェネレータ","summary":"スーパーマリオサンシャインRTAの練習用のチートファイルジェネレータです。初めてジェネレータを使う場合は、<a href=\'guide.html\' target=\'_blank\'>ガイド</a>の参照を推奨します。問題が発生した場合は、ガイド内にあるトラブルシューティングを参照してください。","community":"The SMS Speedrunning Community","links":{"discord":"Discord","twitter":"Twitter：@SMSCommunity","twitch":"Twitch：SunshineCommunity","src":"Speedrun.comリーダーボード"}},"stageloader":{"levelorder":{"label":"レベル順","options":{"list":"指定どおり","shuffle":"ランダム、重複なし","random":"完全ランダム"}},"removedialogue":{"label":"会話を削除するか","options":{"pv5":"モンテ5を除いて削除","yes":"常に削除","no":"削除しない"}},"skippablefmvs":{"label":"FMVをスキップするか","options":{"pp":"メカクッパ以外をスキップ","yes":"常にスキップ","no":"スキップしない"}},"postgame":{"label":"最後のステージ終了後は？","options":{"3400":"コロナマウンテン内部","0F00":"タイトル画面に戻る","0109":"洪水状態のドルピックタウン","0102":"コロナマウンテン突入後のドルピックタウン","3C00":"クッパ戦"}},"levels":{"delfinoplaza":{"header":"Delfino Plaza","current":"Plaza - Current","biancounlock":"Plaza - Bianco Unlock","peachchase":"Plaza - Peach Chase","riccounlock":"Plaza - Ricco / Gelato unlocks","peaceful":"Plaza - Peaceful","pinnaunlock":"Plaza - Pinna Unlock","yoshiunlock":"Plaza - Yoshi / nozzles unlocks","flooded":"Plaza - Flooded","postcorona":"Plaza - Post-Corona"},"delfinosublevels":{"header":"Delfino Plaza Sublevels","airstrip":"Airstrip","airstripreds":"Airstrip (red coins)","slide":"Slide","pachinko":"Pachinko","grasspipe":"Grass pipe","lilypad":"Lily Pad Ride","jail":"Jail Secret"},"secrets":{"header":"ヒミツステージ","bianco3":"ビアンコ 3 ヒミツ","bianco6":"ビアンコ 6 ヒミツ","ricco4":"リコ 4 ヒミツ","gelato1":"マンマ 1 ヒミツ","pinna2":"ピンナ 2 ヒミツ","pinna6":"ピンナ 6 ヒミツ","sirena2":"シレナ 2 ヒミツ","sirena4":"シレナ 4 ヒミツ","noki6":"マーレ 6 ヒミツ","pianta5":"モンテ 5 ヒミツ"},"sublevels":{"header":"サブレベル","petey":"ボスパックンとの戦い (ビアンコ 2)","gooperblooper":"ボスゲッソーとの戦い (リコ 1)","sewers":"イカサーフィン (リコ 2)","sandbird":"おおすなどり (マンマ 4)","mecha":"メカクッパとの戦い (ピンナ 1)","rollercoaster":"ジェットコースター (ピンナ 8)","casino1":"カジノ・デルフィーノ (シレナ 4)","casino2":"カジノ・デルフィーノ (シレナ 5)","kingboo":"ボステレサとの闘い (シレナ 5)","bottle":"ビンのなか (マーレ 3)","eel":"きょだいウナギ (マーレ 4)","nokireds":"コインフィッシュ (マーレ 8)"},"misc":{"header":"その他","biancoepisodeselect":"ビアンコのストーリー選択画面","riccoepisodeselect":"リコのストーリー選択画面","gelatoepisodeselect":"マンマのストーリー選択画面","pinnaepisodeselect":"ピンナのストーリー選択画面","sirenaepisodeselect":"シレナのストーリー選択画面","nokiepisodeselect":"マーレのストーリー選択画面","piantaepisodeselect":"モンテのストーリー選択画面"},"bianco":{"1":"ビアンコ 1","2":"ビアンコ 2","3":"ビアンコ 3","4":"ビアンコ 4","5":"ビアンコ 5","6":"ビアンコ 6","7":"ビアンコ 7","8":"ビアンコ 8","header":"ビアンコヒルズ"},"ricco":{"1":"リコ 1","2":"リコ 2","3":"リコ 3","4":"リコ 4","5":"リコ 5","6":"リコ 6","7":"リコ 7","8":"リコ 8","header":"リコハーバー"},"gelato":{"1":"マンマ 1","2":"マンマ 2","3":"マンマ 3","4":"マンマ 4","5":"マンマ 5","6":"マンマ 6","7":"マンマ 7","8":"マンマ 8","header":"マンマビーチ"},"pinna":{"1":"ピンナ 1","2":"ピンナ 2","3":"ピンナ 3","4":"ピンナ 4","5":"ピンナ 5","6":"ピンナ 6","7":"ピンナ 7","8":"ピンナ 8","header":"ピンナパーク"},"sirena":{"1":"シレナ 1","2":"シレナ 2","3":"シレナ 3","4":"シレナ 4","5":"シレナ 5","6":"シレナ 6","7":"シレナ 7","8":"シレナ 8","header":"シレナビーチ"},"noki":{"1":"マーレ 1","2":"マーレ 2","3":"マーレ 3","4":"マーレ 4","5":"マーレ 5","6":"マーレ 6","7":"マーレ 7","8":"マーレ 8","header":"マーレのいりえ"},"pianta":{"1":"モンテ 1","2":"モンテ 2","3":"モンテ 3","4":"モンテ 4","5":"モンテ 5","6":"モンテ 6","7":"モンテ 7","8":"モンテ 8","header":"モンテのむら"}},"presets":{"fullgameminimalplaza":{"header":"フルゲームのカテゴリ、最小限のドルピックタウン","fapnormal":"Fast Any% 通常ルート","fapriccolate":"Fast Any% リコ後","fap49":"Fast Any% No Major Skips","fap58":"Fast 58 Shines / All Episodes","fap79":"Fast 79 Shines / All Level Shines","fap96":"Fast 96 Shines / All Shines, No Blues"},"fullgamecategories":{"49":"Any% No Major Skips","58":"58 Shines / All Episodes","79":"79 Shines / All Level Shines","96":"96 Shines / All Shines, No Blues","120":"120 Shines / All Shines, All Blues","header":"フルゲームのカテゴリ","anyp":"Any% 通常ルート"},"iw":{"header":"個別ステージ","bianco":"ビアンコヒルズ","ricco":"リコハーバー","gelato":"マンマビーチ","pinna":"ピンナパーク","sirena":"シレナビーチ","noki":"マーレのいりえ","pianta":"モンテのむら"},"iwallshines":{"header":"個別ステージ (全シャイン)","bianco":"ビアンコヒルズ","ricco":"リコハーバー","gelato":"マンマビーチ","pinna":"ピンナパーク","sirena":"シレナビーチ","noki":"マーレのいりえ","pianta":"モンテのむら"}},"levelselectplaceholder":"レベルを選択します..","route":"ルート","clear":"リストをクリア"},"misc":{"defaulthelpmessage":"左にあるリストからコードを選択します"}}')}}]);