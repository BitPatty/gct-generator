<template>
  <div>
    <ButtonComponent
      label="Download"
      :onClick="onClick"
      :disabled="(!codes || codes.length === 0) && !stageLoaderCode"
    />
  </div>
</template>

<script>
// Data
import gameVersions from '../data/gameVersions.json';

// Util
import { translate, translateCode } from '../i18n/localeHelper';

// customizable code
import codegens from './codes/codegen.js';

export default {
  props: {
    codes: { type: Array },
    stageLoaderCode: { type: String },
    format: { type: String },
    versionIdentifier: { type: String },
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      if (!(this.codes || this.codes.length === 0) && !this.stageLoaderCode) {
        return;
      }
      const c = [...(this.codes ?? [])];

      if (this.stageLoaderCode)
        c.push({
          title: 'Stage List Loader',
          author: 'Noki Doki',
          date: '-',
          version: '',
          source: this.stageLoaderCode,
        });

      try {
        window._paq.push([
          'trackEvent',
          'GCT Generator',
          'Code Download',
          JSON.stringify({
            gameVersion: this.versionIdentifier,
            format: this.format,
            codes: c.map((code) => ({
              title: code.title,
              version: code.version,
            })),
          }),
        ]);
      } catch {}

      const fileName = gameVersions.find((v) => v.identifier === this.versionIdentifier).version;

      // apply customizable codes
      for (const code of c) {
        const codegen = codegens[code.id];
        if (codegen) {
          code.source = codegen(this.versionIdentifier);
        }
      }

      // generate file
      const codeSize = c.reduce((a, e) => a+e.source.length, 0)/2 + 16; // 8(00D0)+8(F000)
      // console.log(codeSize, c);
      switch (this.format) {
        case 'gct':
          this.alertGCTCodeSize(codeSize);
          this.generateGCT(c, fileName);
          break;
        case 'dolphin':
          this.alertDolphinCodeSize(codeSize);
          this.generateDolphinINI(c, fileName);
          break;
        case 'gcm':
          this.alertDolphinCodeSize(codeSize);
          this.generateCheatManagerTXT(c, fileName);
          break;
      }
    },
    alertGCTCodeSize(size) {
      if (size > 5000) {
        alert(translate('generatorconfig.alert.gct', this.$lang).replaceAll('{size}', size));
      }
    },
    alertDolphinCodeSize(size) {
      if (size > 3272) { // 0x3000-0x2338
        // excluding header+footer
        alert(translate('generatorconfig.alert.dolphin', this.$lang).replaceAll('{size}', size-16));
      }
    },
    generateGCT(codes, version) {
      let code = '00D0C0DE00D0C0DE';
      codes.forEach((c) => (code += c.source));
      code += 'F000000000000000';

      let rawData = new Uint8Array(code.length / 2);

      for (let x = 0; x < rawData.length; x++) {
        rawData[x] = parseInt(code.substr(x * 2, 2), 16);
      }

      this.downloadFile(rawData, `${version}.gct`);
    },
    generateDolphinINI(codes, version) {
      let data = 'Paste the following on top of your games .ini file:\r\n[Gecko]';

      codes.forEach((code) => {
        const codeTitle =
          typeof code.title === 'string' ? code.title : translateCode(code, this.$lang).title;

        data += `\r\n$${codeTitle} (${code.date}) [${code.author}]\r\n`;
        data += code.source
          .match(/.{8}/g)
          .join(' ')
          .replace(/(.{17})./g, '$1\r\n');
      });

      this.downloadFile(data, `${version}.txt`);
    },
    generateCheatManagerTXT(codes, version) {
      let data = `${version}\r\nSuper Mario Sunshine`;

      codes.forEach((code) => {
        const codeTitle =
          typeof code.title === 'string' ? code.title : translateCode(code, this.$lang).title;

        data += `\r\n\r\n${codeTitle} (${code.date}) [${code.author}]\r\n`;
        data += code.source
          .match(/.{8}/g)
          .join(' ')
          .replace(/(.{17})./g, '$1\r\n');
      });

      this.downloadFile(data, `${version}.txt`);
    },
    downloadFile(data, filename) {
      var file = new Blob([data], {
        type: 'application/octet-stream',
      });

      if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        var a = document.createElement('a'),
          url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(function () {
          window.URL.revokeObjectURL(url);
        }, 500);
      }
    },
  },
};
</script>
