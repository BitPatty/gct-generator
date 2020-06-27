export default class CodeFormatter {
  static generateGCT(codes, version) {
    let code = "00D0C0DE00D0C0DE";
    codes.forEach((c) => (code += c.source));
    code += "FF00000000000000";

    let rawData = new Uint8Array(code.length / 2);

    for (let x = 0; x < rawData.length; x++) {
      rawData[x] = parseInt(code.substr(x * 2, 2), 16);
    }

    this.downloadFile(rawData, `${version}.gct`);
  }

  static generateDolphinINI(codes, version) {
    let data = "Paste the following on top of your games .ini file:\r\n[Gecko]";

    codes.forEach((code) => {
      data += `\r\n$${code.title} (${code.author}) [${code.date}]\r\n`;
      data += code.source
        .match(/.{8}/g)
        .join(" ")
        .replace(/(.{17})./g, "$1\r\n");
    });

    this.downloadFile(data, `${version}.txt`);
  }

  static generateCheatManagerTXT(codes, version) {
    let data = `${version}\r\nSuper Mario Sunshine`;

    codes.forEach((code) => {
      data += `\r\n\r\n${code.title} (${code.author}) [${code.date}]\r\n`;
      data += code.source
        .match(/.{8}/g)
        .join(" ")
        .replace(/(.{17})./g, "$1\r\n");
    });

    this.downloadFile(data, `${version}.txt`);
  }

  static downloadFile(data, filename) {
    var file = new Blob([data], {
      type: "application/octet-stream",
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
}
