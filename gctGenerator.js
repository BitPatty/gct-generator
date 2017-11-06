if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    HTMLElement.prototype.click = function() {
        var evt = this.ownerDocument.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
    }
}

var xmlData;
function fillChecklist(i) {
    if (i < xmlData.length) {
        var li = document.createElement("li");
        var desc = xmlData[i].getElementsByTagName("title")[0].textContent;
        var t = document.createTextNode(desc);
        li.appendChild(t);
        li.setAttribute("data-codeName", xmlData[i].getElementsByTagName("title")[0].textContent);
        li.setAttribute("data-codeAuthor", xmlData[i].getElementsByTagName("author")[0].textContent);
        li.setAttribute("data-codeDesc", xmlData[i].getElementsByTagName("description")[0].textContent);
        li.setAttribute("data-codeVersion", xmlData[i].getElementsByTagName("version")[0].textContent);
        li.setAttribute("data-codeDate", xmlData[i].getElementsByTagName("date")[0].textContent);
        li.setAttribute("data-codeSrc", xmlData[i].getElementsByTagName("source")[0].textContent.replace(/[\s\n\r\t]+/gm, ""));
        li.setAttribute("onmouseover", "updateDescription(this)");
        document.getElementById("checkList").appendChild(li);
        i++;
        setTimeout(function() {
            fillChecklist(i)
        }, 16);
    } else {
        setTimeout(function() {
            button = document.getElementById("downloadButton");
            button.style.transitionDuration = "1s";
            button.style.opacity = "1";
            button.disabled = false;
            document.getElementById("gameID").disabled = false;
        }, 24);
    }
}

function parseXML(name) {
    var xml = new XMLHttpRequest();
    var file = "codes/" + name + ".xml";
    xml.onload = function() {
        if (this.status == 200 && this.responseXML != null) {
            xmlData = xml.responseXML;
            xmlData = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
            xmlData = xmlData.getElementsByTagName("code");

            fillChecklist(0);
        }
    };
    xml.open("GET", file);
    xml.send();
}

function downloadGCT(data, filename) {
    var rawData = new Uint8Array(data.length / 2);

    for (var x = 0; x < rawData.length; x++) {
        rawData[x] = parseInt(data.substr(x * 2, 2), 16);
    }

    var file = new Blob([rawData], {
        type: "application/octet-stream"
    });

    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a"),
            url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(url);
        }, 500);
    }
}

function generateGCT() {

    if (document.getElementById("gameID").value === "Choose Version") {
        alert("Select the game version!");
        return;
    }
    var data = "00D0C0DE00D0C0DE";
    var codeList = document.getElementById("checkList").getElementsByTagName("li");
    var valueSelected = false;
    for (var i = 0; i < codeList.length; i++) {
        if (codeList[i].className === "checked") {
            data += codeList[i].getAttribute("data-codeSrc");
            valueSelected = true;
        }
    }

    if (valueSelected) {
        data += "FF00000000000000";

        downloadGCT(data, document.getElementById("gameID").value + ".gct");
    } else {
        alert("No cheat(s) selected!");
    }
}

function updateCodelist() {
	resetDescription();
	document.getElementById("gameID").disabled = true;
	button = document.getElementById("downloadButton");
	button.style.visibility = "visible";
	button.style.transitionDuration = "0s";
	button.style.opacity = "0";
	button.disabled = true;
	document.getElementById("checkList").innerHTML = "";
	var gameVersion = document.getElementById("gameID").value;
	parseXML(gameVersion);
}

function updateDescription($this) {
    document.getElementById("descriptionBox").innerHTML = "<p><h2>" +
        $this.getAttribute("data-codeName") + "</h2></p><p><i>Author(s): " +
        $this.getAttribute("data-codeAuthor") + "<br />Version: " +
        $this.getAttribute("data-codeVersion") + " (" +
        $this.getAttribute("data-codeDate") + ")</i></p>" + "<p>Description:<br />" +
        $this.getAttribute("data-codeDesc") + "</p>";
}

function resetDescription() {
    document.getElementById("descriptionBox").innerHTML = "<p><h3>Select your codes from the list...</h3></p>";
}

function updateChangelog() {
    var xml = new XMLHttpRequest();
    var file = "changelog.xml";
    xml.onload = function() {
        if (this.status == 200 && this.responseXML != null) {
            var changelogData = xml.responseXML;
            changelogData = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
            changelogData = changelogData.getElementsByTagName("update");

            for (var i = 0; i < changelogData.length && i < 5; i++) {
                document.getElementById("changelog").innerHTML += "<i>" + changelogData[i].getElementsByTagName("date")[0].textContent + ":</i> " + changelogData[i].getElementsByTagName("change")[0].textContent + "<br />";
            }

            document.getElementById("changelog").innerHTML += "<a target=\"_blank\" href=\"changelog.html\">more ...</a>";
        };
    }
    xml.open("GET", file);
    xml.send();
}