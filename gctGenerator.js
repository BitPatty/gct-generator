if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
   HTMLElement.prototype.click = function() {
      var evt = this.ownerDocument.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      this.dispatchEvent(evt);
  }
}

document.getElementById("checklist").addEventListener("click", function(ev) {
   if (ev.target && ev.target.nodeName == "LI") {
      ev.target.classList.toggle("checked");
  }
});

function parseXML(name) {
  var xml = new XMLHttpRequest();
  var file = "codes/" + name + ".xml";
  xml.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
      var xmlData = xml.responseXML;
      xmlData = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
      xmlData = xmlData.getElementsByTagName("code");

      var i = 0;
      for (; i < xmlData.length; i++) {
        var li = document.createElement("li");
        var desc = xmlData[i].getElementsByTagName("title")[0].textContent;
        var t = document.createTextNode(desc);
        li.appendChild(t);
        li.setAttribute("data-codename", btoa(xmlData[i].getElementsByTagName("title")[0].textContent));
        li.setAttribute("data-codeauthor", btoa(xmlData[i].getElementsByTagName("author")[0].textContent));
        li.setAttribute("data-codedesc", btoa(xmlData[i].getElementsByTagName("description")[0].textContent));
        li.setAttribute("data-codeversion", btoa(xmlData[i].getElementsByTagName("version")[0].textContent));
        li.setAttribute("data-codedate", btoa(xmlData[i].getElementsByTagName("date")[0].textContent));
        li.setAttribute("data-codesrc", btoa(xmlData[i].getElementsByTagName("source")[0].textContent.replace(/[\s\n\r\t]+/gm, "")));
        li.setAttribute("onmouseover", "updateDescription(this)");
        document.getElementById("checklist").appendChild(li);
      }

      var buttons = document.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) buttons[i].disabled = false;

      document.getElementById("gameversion").disabled = false;
    }
  };

  xml.open("GET", file);
  xml.send();
}

function updateFastCode(name) {
   var xml = new XMLHttpRequest();
   var file = "codes/fast/" + name + ".json";
   xml.onreadystatechange = function() {
      if (this.status == 200 && this.readyState == 4) {
         document.getElementById("route_levels").setAttribute("data-json", btoa(xml.responseText));
      }
   }
   xml.open("GET",file);
   xml.send();
}

function downloadFile(data, filename) {

   var file = new Blob([data], {
     type: "application/octet-stream"
   });

   if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename.replace("GMSJ0A","GMSJ01"));
   else {
      var a = document.createElement("a"),
      url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = filename.replace("GMSJ0A","GMSJ01");
      a.click();
      setTimeout(function() { window.URL.revokeObjectURL(url); }, 500);
  }
}

function generateGCT() {

   if (document.getElementById("gameversion").value === "Choose Version") {
     alert("Select the game version!");
     return;
   }
   var data = "00D0C0DE00D0C0DE";
   var codeList = document.getElementById("checklist").getElementsByTagName("li");
   var valueSelected = false;
   for (var i = 0; i < codeList.length; i++) {
      if (codeList[i].className === "checked") {
         data += atob(codeList[i].getAttribute("data-codesrc"));
         valueSelected = true;
      }
   }

   var fastcode = getFastCode();

   if(fastcode !== false) {
      data += fastcode;
      valueSelected = true;
   }

   if (valueSelected) {
      data += "FF00000000000000";
      var rawData = new Uint8Array(data.length / 2);

      for (var x = 0; x < rawData.length; x++) {
         rawData[x] = parseInt(data.substr(x * 2, 2), 16);
      }

      downloadFile(rawData, document.getElementById("gameversion").value + ".gct");
   } else {
      alert("No cheat(s) selected!");
   }
}

function generateTXT() {

   var dolphin = (document.getElementById("downloadformat").value === "ini");

   if (document.getElementById("gameversion").value === "Choose Version") {
      alert("Select the game version!");
      return;
   }
   if (dolphin) var data = "Paste the following on top of your games .ini file:\r\n[Gecko]";
   else var data = document.getElementById("gameversion").value.replace("GMSJ0A","GMSJ01") + "\r\nSuper Mario Sunshine";
   var codeList = document.getElementById("checklist").getElementsByTagName("li");
   var valueSelected = false;
   for (var i = 0; i < codeList.length; i++) {
      if (codeList[i].className === "checked") {
         data += "\r\n";
         if (dolphin) data += "$";
         else data += "\r\n";
         data += atob(codeList[i].getAttribute("data-codename")) + " (" + atob(codeList[i].getAttribute("data-codedate")) + ") [" + atob(codeList[i].getAttribute("data-codeauthor")) + "]\r\n";
         data += (atob(codeList[i].getAttribute("data-codesrc")).match(/.{8}/g).join(" ")).replace(/(.{17})./g, "$1\r\n");
         valueSelected = true;
      }
   }

   var fastcode = getFastCode();

   if(fastcode !== false) {
      data += "\r\n";
      if (dolphin) data += "$";
      else data += "\r\n";
      data += "Stage list loader [Noki Doki]\r\n";
      data += (fastcode.match(/.{8}/g).join(" ")).replace(/(.{17})./g, "$1\r\n");
      valueSelected = true;
   }

   if (valueSelected)
   downloadFile(data, document.getElementById("gameversion").value + ".txt");
   else alert("No cheat(s) selected!");
}

function downloadCodes() {
   if (document.getElementById("downloadformat").value === "gct") generateGCT();
   else generateTXT();
}

function updateCodelist() {
   resetDescription();
   document.getElementById("gameversion").disabled = true;
   var buttons = document.getElementsByTagName("button");
   for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
   document.getElementById("checklist").innerHTML = "";
   var gameVersion = document.getElementById("gameversion").value;
   parseXML(gameVersion);
   updateFastCode(gameVersion);
   document.getElementById("home").style.display = "none";
   document.getElementById("left").style.visibility = "visible";
   document.getElementById("center").style.visibility = "visible";
   document.getElementById("right").style.visibility = "visible";
}

function updateDescription(s) {
   document.getElementById("descriptionbox").innerHTML = "<h2>" +
      atob(s.getAttribute("data-codename")) + "</h2><p style=\"margin:0\"><i>Author(s): " +
      atob(s.getAttribute("data-codeauthor")) + "</i></p><p style=\"margin:0\"><i>Version: " +
      atob(s.getAttribute("data-codeversion")) + " (" +
      atob(s.getAttribute("data-codedate")) + ")</i></p>" + "<br /><h4>Description:</h4><p>" +
      atob(s.getAttribute("data-codedesc")) + "</p>";
}

function updateUIDescription(s) {
   if (s.id === "route_notext")
      document.getElementById("descriptionbox").innerHTML = "<h2>Remove Dialogue</h2><p>Replaces all Dialogue with \"!!!\". 'Always' and 'Not in Pianta 5' will override the dialogue skip from the DPad Functions.</p>";
   else if (s.id === "route_nofmvs")
      document.getElementById("descriptionbox").innerHTML = "<h2>Skippable Cutscenes</h2><p>Makes FMVs Skippable. 'Always' has the same effect as the 'FMV Skips' code. Also, having 'FMV Skips' enabled will override 'Not in Pinna 1' - so don't use both simultaneously.</p>";
   else if (s.id === "route_random")
      document.getElementById("descriptionbox").innerHTML = "<h2>Random Level Order</h2><p>Randomizes what level is loaded next - it can be any from the levels you choose on the list. Even levels that you've finished already.</p>";
   else if (s.id === "downloadformat")
      document.getElementById("descriptionbox").innerHTML = "<h2>File Format</h2><p>You can choose between 3 file formats:</p><h4>GCT</h4><p>Download a GCT file for use with Nintendont</p><h4>Dolphin INI</h4><p>Download a textfile containing the formatted codes for use with Dolphin. Copy the contents of the file on top of your games .ini file.</p><p>You can open the .ini file by right clicking the game in Dolphin. In the context menu select 'Properties' and then 'Edit configuration'.</p><h4>Cheat Manager TXT</h4><p>Download the cheats in a textfile formatted for use with the <a target=\"_blank\" href=\"http://wiibrew.org/wiki/CheatManager\">Gecko Cheat Manager</a>. Place the txt file in SD:/txtcodes/.</p><p>A zip archive containing pregenerated txt files with all available codes on this site can be downloaded <a target=\"_blank\" href=\"files/GCMCodes.zip\">here</a>.</p>";
   else if (s.id === "stageloader")
      document.getElementById("descriptionbox").innerHTML = "<h2>Stage Loader</h2><p>Select yes if you want to use a custom stage loader, which automatically loads the levels you choose, similiar to 'Fast Any%'.</p>";
   else if (s.id === "gameversion")
      document.getElementById("descriptionbox").innerHTML = "<h2>Game Version</h2><p>Select your game version here. NTSC-U stands for the North American version of the game, PAL for the European and NTSC-J 1.0 and 1.1 for the two Japanese releases.</p>"
}

function resetDescription() {
   document.getElementById("descriptionbox").innerHTML = "<p><h3>Choose your codes from the list...</h3></p>";
}

function switchPosition() {
   document.getElementById("ph_gameversion").appendChild(document.getElementById("gameversion"));
   document.getElementById("gameversion").setAttribute("onchange","updateCodelist()");
   document.getElementById("gameversion").style.width = "100%";
   updateCodelist();
}

function updateChangelog() {
   document.getElementById("gameversion").style.visibility = "visible";
   var xml = new XMLHttpRequest();
   var file = "changelog.xml";
   xml.onload = function() {
      if (this.status == 200 && this.responseXML != null) {
         var changelogData = xml.responseXML;
         changelogData = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
         changelogData = changelogData.getElementsByTagName("update");

         document.getElementById("lastupdate").innerHTML = "Last Updated: " + changelogData[0].getElementsByTagName("date")[0].textContent;
         for (var i = 0; i < changelogData.length && i < 5; i++) {
            document.getElementById("changelog").innerHTML += "<p style=\"margin:0\"><i>" + changelogData[i].getElementsByTagName("date")[0].textContent + ":</i> " + changelogData[i].getElementsByTagName("change")[0].textContent + "</p>";
         }

         document.getElementById("changelog").innerHTML += "<a target=\"_blank\" href=\"changelog.html\"><i>more ...</i></a>";
      };
   }

   xml.open("GET", file);
   xml.send();
}

/****************************
*
*  Fastcode, https://github.com/QbeRoot/fastcodes/blob/master/script.js
*
****************************/

'strict mode'
const levels = document.querySelector("#route_levels");
const template = levels.lastElementChild;
template.ondragstart = function() { return false; };

function appendLevel(code) {
   const clone = template.cloneNode(true);
   clone.draggable = true;
   selSetHandlers(clone);
   clone.querySelector("select").value = code;
   levels.insertBefore(clone, template);
}

function clearLevels() {
   while (levels.firstChild !== template) levels.removeChild(levels.firstChild);
}

template.addEventListener("change", function () {
   appendLevel(template.querySelector("select").value);
   template.querySelector("select").value = "0F00";
})

levels.addEventListener("change", function ({target: t}) {
   if (t.value === "0F00" && t.parentNode !== template) levels.removeChild(t.parentNode);
})

levels.addEventListener("click", function ({target: t}) {
   if (t.tagName.toUpperCase() === "BUTTON") levels.removeChild(t.parentNode);
})

document.querySelector("#route_presets").addEventListener("change", function ({currentTarget: t}) {
   if (levels.childElementCount <= 1 || confirm("Loading a preset will erase your current list. Continue?")) {
      clearLevels();
      const preset = t.value;
      for (let i = 0; i <= preset.length - 4; i += 4) appendLevel(preset.substr(i, 4));
   }
   t.value = ""
})

document.querySelector("#route_clear").addEventListener("click", function () {
   confirm("Do you really want to clear the list?") && clearLevels();
})

{
   let selection;

   function selDragStart(e) {
      selection = this;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", this.querySelector("select").value);

      this.classList.add("dragelement");
   }

   function selDragOver(e) {
      if (e.preventDefault) {
         e.preventDefault();
      }

      this.classList.add("dragover");
      e.dataTransfer.dropEffect = "move";

      return false;
   }

   function selDragLeave() {
      this.classList.remove("dragover");
   }

   function selDragDrop(e) {
      if (e.stopPropagation) {
         e.stopPropagation();
      }

      if (selection != this) {
         this.parentNode.removeChild(selection);
         this.insertAdjacentHTML("afterend", template.outerHTML);
         this.nextSibling.querySelector("select").value = e.dataTransfer.getData('text/html');
         this.nextSibling.draggable = true;
         selSetHandlers(this.nextSibling);
      }

      this.classList.remove("dragover");
      return false;
   }

   function selDragEnd() {
      this.classList.remove("dragelement");
   }

   function selSetHandlers(elem) {
      elem.addEventListener('dragstart', selDragStart, false);
      elem.addEventListener('dragover', selDragOver, false);
      elem.addEventListener('dragleave', selDragLeave, false);
      elem.addEventListener('drop', selDragDrop, false);
      elem.addEventListener('dragend', selDragEnd, false);
   }
}

//Interface
function getFastCode() {

   const levelCodes = Array.prototype.map.call(levels.querySelectorAll("select"), s => s.value);

   levelCodes.pop();

   if (!(document.getElementById("usefastcode").checked) || levelCodes.length <= 1) return false;

   let game = JSON.parse(atob(document.getElementById("route_levels").getAttribute("data-json")));
   const randomize = (document.getElementById("route_random").value === "yes");
   const levelWords = Math.ceil(levelCodes.length / 2);
   const asm = [];
   asm.push("48" + ("00000" + (levelWords + 1 << 2 | 1).toString(16).toUpperCase()).slice(-6)); // bl to the code
   for (let i = 0; i < levelWords; ++i) {
      asm.push(levelCodes[2 * i] + (levelCodes[2 * i + 1] || "0000"));
   }

   //Timer compatibility
   asm.push("3C80817F"); // lis r4, 0x817F
   asm.push("38000000"); // li r0, 0
   asm.push("9004010C"); // stw r0, 0x010C(r4)
   asm.push("38000001"); // li r0, 1
   asm.push("98040101"); // stb r0, 0x0101(r4)

   asm.push("881F0012"); // lbz r0, 0x12(r31)

   if (!randomize) {
      asm.push("2C00000F"); // cmpwi r0, 15
      asm.push("40820010"); // bne- 0x10
      asm.push("38000000"); // li r0, 0
      asm.push("90040000"); // stw r0, 0(r4)
      asm.push("4800002C"); // b 0x2C
   }

   asm.push("2C000001"); // cmpwi r0, 1

   if (randomize) {
      asm.push("41810030"); // bgt- 0x30
      asm.push("7C6C42E6"); // mftbl r3
      asm.push("3880" + ("000" + (levelCodes.length * 2).toString(16).toUpperCase()).slice(-4)); // li r4, length
      asm.push("7C032396"); // divwu r0, r3, r4
      asm.push("7C0021D6"); // mullw r0, r0, r4
      asm.push("7C601850"); // sub r3, r3, r0
      asm.push("5463003C"); // rlwinm r3, r3, 0, 0, 30
   } else {
      asm.push("41810024"); // bgt- 0x24
      asm.push("80640000"); // lwz r3, 0(r4)
      asm.push("38030002"); // addi r0, r3, 2
      asm.push("90040000"); // stw r0, 0(r4)
   }

   asm.push("7C8802A6"); // mflr r4
   asm.push("7C641A2E"); // lhzx r3, r4, r3
   asm.push("B07F0012"); // sth r3, 0x12(r31)
   asm.push("808D" + game.fmOffset); // lwz r4, TFlagManager::smInstance
   asm.push("986400DF"); // stb r3, 0xDF(r4)
   asm.push("807F0020"); // lwz r3, 0x20(r31)

   if (asm.length % 2 === 0) {
      asm.push("60000000"); // nop
   }
   asm.push("00000000");

   const geckoLines = asm.length / 2;
   let gecko = "C2" + game.injectAddr + " " + ("0000000" + geckoLines.toString(16).toUpperCase()).slice(-8) + "\r\n";
   for (let i = 0; i < geckoLines; ++i) {
      gecko += asm[2 * i] + " " + asm[2 * i + 1] + "\r\n";
   }

   let codes = gecko +
      game.notext[document.getElementById("route_notext").value] +
      game.nofmvs[document.getElementById("route_nofmvs").value];

   return codes.replace(/[^0-9A-F]/g, '');
}
