if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
   HTMLElement.prototype.click = function () {
      var evt = this.ownerDocument.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      this.dispatchEvent(evt);
   }
}

document.getElementById("codelist").addEventListener("click", function (ev) {
   if (ev.target && ev.target.nodeName.toUpperCase() === "LI")
      ev.target.classList.toggle("checked");
});

function parseXML(name) {
   var xml = new XMLHttpRequest();
   var file = "codes/" + name + ".xml";
   xml.onreadystatechange = function () {
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
            li.setAttribute("onmouseover", "updateCodeDescription(this)");
            document.getElementById("codelist").appendChild(li);
         }

         var buttons = document.getElementsByTagName("button");
         for (var i = 0; i < buttons.length; i++) buttons[i].disabled = false;

         document.getElementById("sel-gamever").disabled = false;
      }
   };

   xml.open("GET", file);
   xml.send();
}

function toggleFastCode() {
   document.getElementById("cc").classList.toggle("hidden");
}

function updateFastCode(name) {
   var xml = new XMLHttpRequest();

   xml.onreadystatechange = function () {
      if (this.status == 200 && this.readyState == 4) {
         document.getElementById("route_levels").setAttribute("data-json", btoa(xml.responseText));
      }
   }

   xml.open("GET", "codes/fast/" + name + ".json");
   xml.send();
}

function downloadFile(data, filename) {
   var file = new Blob([data], {
      type: "application/octet-stream"
   });

   if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename.replace("GMSJ0A", "GMSJ01"));
   else {
      var a = document.createElement("a"),
         url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = filename.replace("GMSJ0A", "GMSJ01");
      a.click();
      setTimeout(function () {
         window.URL.revokeObjectURL(url);
      }, 500);
   }
}

function generateGCT() {

   if (document.getElementById("sel-gamever").value === "Choose Version") {
      alert("Select the game version!");
      return;
   }
   var data = "00D0C0DE00D0C0DE";
   var codeList = document.getElementById("codelist").getElementsByTagName("li");
   var valueSelected = false;
   for (var i = 0; i < codeList.length; i++) {
      if (codeList[i].className === "checked") {
         data += atob(codeList[i].getAttribute("data-codesrc"));
         valueSelected = true;
      }
   }

   var fastcode = getFastCode();

   if (fastcode !== false) {
      data += fastcode;
      valueSelected = true;
   }

   if (valueSelected) {
      data += "FF00000000000000";
      var rawData = new Uint8Array(data.length / 2);

      for (var x = 0; x < rawData.length; x++) {
         rawData[x] = parseInt(data.substr(x * 2, 2), 16);
      }

      downloadFile(rawData, document.getElementById("sel-gamever").value + ".gct");
   } else {
      alert("No cheat(s) selected!");
   }
}

function generateTXT() {

   var dolphin = (document.getElementById("sel-format").value === "ini");

   if (document.getElementById("sel-gamever").value === "Choose Version") {
      alert("Select the game version!");
      return;
   }
   if (dolphin) var data = "Paste the following on top of your games .ini file:\r\n[Gecko]";
   else var data = document.getElementById("sel-gamever").value.replace("GMSJ0A", "GMSJ01") + "\r\nSuper Mario Sunshine";
   var codeList = document.getElementById("codelist").getElementsByTagName("li");
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

   if (fastcode !== false) {
      data += "\r\n";
      if (dolphin) data += "$";
      else data += "\r\n";
      data += "Stage list loader [Noki Doki]\r\n";
      data += (fastcode.match(/.{8}/g).join(" ")).replace(/(.{17})./g, "$1\r\n");
      valueSelected = true;
   }

   if (valueSelected)
      downloadFile(data, document.getElementById("sel-gamever").value + ".txt");
   else alert("No cheat(s) selected!");
}

function downloadCodes() {
   if (document.getElementById("sel-format").value === "gct") generateGCT();
   else generateTXT();
}

function updateCodelist() {
   disableButtons();
   document.getElementById("sel-gamever").disabled = true;

   resetDescription();
   document.getElementById("codelist").innerHTML = "";

   let gameVersion = document.getElementById("sel-gamever").value;
   parseXML(gameVersion);
   updateFastCode(gameVersion);

   toggleHiddenContainers();
}

function disableButtons() {
   var buttons = document.getElementsByTagName("button");
   for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
}

function toggleHiddenContainers() {
   let hiddenElements = document.querySelectorAll(".hidden");

   for (let i = 0; i < hiddenElements.length; i++) {
      if (hiddenElements[i].id !== "cc") hiddenElements[i].classList.remove("hidden");
   }
}

function updateCodeDescription(s) {
   document.getElementById("descriptionbox").innerHTML = "<h2>" +
      atob(s.getAttribute("data-codename")) + "</h2><p style=\"margin-top:0\"><i>Author(s): " +
      atob(s.getAttribute("data-codeauthor")) + "</i></p><p style=\"margin-top:0\"><i>Version: " +
      atob(s.getAttribute("data-codeversion")) + " (" +
      atob(s.getAttribute("data-codedate")) + ")</i></p>" + "<br /><h4>Description:</h4><p>" +
      atob(s.getAttribute("data-codedesc")) + "</p>";
}

function updateUIDescription(s) {
   if (s && s.getAttribute("data-description"))
      document.getElementById("descriptionbox").innerHTML = s.getAttribute("data-description");
}

function resetDescription() {
   document.getElementById("descriptionbox").innerHTML = "<p><h3>Choose your codes from the list...</h3></p>";
}

function updateChangelog() {
   document.getElementById("sel-gamever").style.visibility = "visible";
   var xml = new XMLHttpRequest();
   xml.onload = function () {
      if (this.status == 200 && this.responseXML != null) {
         var changelogData = xml.responseXML;
         changelogData = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
         changelogData = changelogData.getElementsByTagName("update");

         var recentchanges = "";
         try {
            document.getElementById("lastupdate").innerHTML = "Last Updated: " + changelogData[0].getElementsByTagName("date")[0].textContent;

            for (var i = 0, changeCount = 0; i < changelogData.length && changeCount < 3; i++) {
               recentchanges += "<div class=\"change\"><div><i>" + changelogData[i].getElementsByTagName("date")[0].textContent + ": </i></div><div><i>";

               var changes = changelogData[i].getElementsByTagName("change");
               for (var k = 0; k < changes.length && changeCount < 3; k++) {
                  recentchanges += changes[k].getElementsByTagName("head")[0].textContent + " ";
                  ++changeCount;
               }

               recentchanges += "</i></div></div>";
            }
         } catch (err) {}

         document.getElementById("changelog").innerHTML += recentchanges + "<div class=\"change\"><a target=\"_blank\" href=\"changelog.html\"><i>more ...</i></a></div>";
      };
   }

   xml.open("GET", "changelog.xml");
   xml.send();
}

/****************************
 *
 *  Fastcode, https://github.com/QbeRoot/fastcodes/blob/master/script.js
 *
 ****************************/

const levels = document.querySelector("#route_levels");
const template = levels.lastElementChild;
template.ondragstart = function () {
   return false;
};

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

levels.addEventListener("change", function (ev) {
   if (ev.target.value === "0F00" && ev.target.parentNode !== template) levels.removeChild(ev.target.parentNode);
})

levels.addEventListener("click", function (ev) {
   if (ev.target.tagName.toUpperCase() === "BUTTON") levels.removeChild(ev.target.parentNode);
})

document.querySelector("#route_ending").disabled = document.querySelector("#route_order").value === "random";
document.querySelector("#route_order").addEventListener("change", function (ev) {
   document.querySelector("#route_ending").disabled = ev.currentTarget.value === "random";
})

document.querySelector("#route_presets").addEventListener("change", function (ev) {
   if (levels.childElementCount <= 1 || confirm("Loading a preset will erase your current list. Continue?")) {
      clearLevels();
      const preset = ev.currentTarget.value.split(";")[0];
      const ending = ev.currentTarget.value.split(";")[1];
      for (let i = 0; i <= preset.length - 4; i += 4) appendLevel(preset.substr(i, 4));
      if (ending) document.querySelector("#route_ending").value = ending
   }
   ev.currentTarget.value = "";
})

document.querySelector("#route_clear").addEventListener("click", function () {
   confirm("Do you really want to clear the list?") && clearLevels();
})

{
   let selection;

   function selDragStart(e) {
      selection = this;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("html", this.querySelector("select").value);

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
         this.nextSibling.querySelector("select").value = e.dataTransfer.getData('html');
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
   var levelCodes = [];
   for (var c = levels.getElementsByTagName("select"), i = 0; i < c.length; i++) {
      levelCodes.push(c[i].value);
   }
   levelCodes.pop();

   if (!document.getElementById("sel-stageloader").value === "yes" || levelCodes.length === 0) return false;

   let game = JSON.parse(atob(document.getElementById("route_levels").getAttribute("data-json")));
   const order = document.getElementById("route_order").value;
   const ending = document.getElementById("route_ending").value;
   const loadStageLength = {
      'list': 0x20,
      'random': 0x2C,
      'shuffle': 0x40
   } [order]
   let codes = ''

   // Reset counter on file select
   codes += '0' + (0x04000000 + (game.fileSelect & 0x01FFFFFF)).toString(16) +
      (0x48000001 + (game.system + 0x52C - game.fileSelect & 0x03FFFFFC)).toString(16)

   // Load next stage on Shine get
   codes += '0' + (0x04000000 + (game.shineGet & 0x01FFFFFF)).toString(16) +
      (0x48000001 + (game.system + 0x53C - game.shineGet & 0x03FFFFFC)).toString(16)

   // Reload stage on exit area
   codes += '0' + (0x04000000 + (game.system & 0x01FFFFFF)).toString(16) + '48000511'

   // Set next stage on game over
   codes += '0' + (0x06000000 + (game.system + 0xB4 & 0x01FFFFFF)).toString(16) + '000000084800048948000044'

   // Reset timer on secret death
   codes += (0xC2000000 + (game.system + 0x208 & 0x01FFFFFF)).toString(16) + '000000033C60817F38000001980300FF881C00006000000000000000'

   // Reset coin count on loading main world
   codes += (0xC2000000 + (game.shineGet - 0x674 & 0x01FFFFFF)).toString(16) + '00000005887D00002C030002418000142C0300074182000C2C03000A418000087C0400406000000000000000'

   // Overwrite decideNextStage(void) with useful routines
   codes += '0' + (0x06000000 + (game.system + 0x510 & 0x01FFFFFF)).toString(16) +
      ('0000000' + (loadStageLength + 0x5C).toString(16)).slice(-8) +
      '3C60817F38000001980300FFA00300023C60' + game.gpAppHi + 'B003' + game.gpAppLo + '4E800020' + // reload current level
      '3C60817F' + (0x38800000 + (levelCodes.length * 2 & 0x0000FFFF)).toString(16) + 'B08300004E800020' + // reset counter
      '3C60817F38000001980300FFA00300002C00000038E0' + ending + // load next stage - the fun begins
      (0x40810000 + (loadStageLength & 0x0000FFFC)).toString(16) + '7C8802A6600000007CC802A67C8803A6'

   switch (order) {
      case 'list':
         codes += '3400FFFEB00300007CE6022E';
         break
      case 'random':
         codes += '7C8C42E67CA403967CA501D67C8520505484003C7CE6222E';
         break
      case 'shuffle':
         codes += '7C8C42E67CA403967CA501D67C8520505484003C3400FFFEB00300007CE6222E7CA6022E7CA6232E7CE6032E'
   }

   codes += 'B0E300023C60' + game.gpAppHi + 'B0E3' + game.gpAppLo + '806D' + game.fmOffset + '98E300DF4E800020' + (order === 'random' ? '' : '00000000')

   levelCodes.reverse()

   while (levelCodes.length % 4) levelCodes.push('0000')

   // Insert the list of levels into the loader
   codes += (0xC2000000 + (game.system + 0x55C & 0x01FFFFFF)).toString(16) +
      ('0000000' + (levelCodes.length / 4 + 1).toString(16)).slice(-8) +
      (0x48000001 + (levelCodes.length * 2 + 4 & 0x03FFFFFC)).toString(16) +
      levelCodes.join('') + '00000000'

   // Load next stage on setNextStage into main level
   codes += '0' + (0x06000000 + (game.system + 0x118C & 0x01FFFFFF)).toString(16) +
      '00000028B07D00143C80817F38000000B00400FFA0010038B01D00122C1C00094181000C4BFFF391B0E10038'

   // Setup timer
   codes += (0xC2000000 + (game.proc & 0x01FFFFFF)).toString(16) +
      '000000053CA0817F388000009085010C880500FF98050100988500FF38800001988501016000000000000000'

   codes = codes.toUpperCase()

   codes += game.notext[document.getElementById("route_notext").value] +
      game.nofmvs[document.getElementById("route_nofmvs").value];

   return codes
}