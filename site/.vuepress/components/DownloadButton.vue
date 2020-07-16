<template>
  <ButtonComponent
    label="Download"
    :onClick="onClick"
    :disabled="(!codes || codes.length === 0) && !stageLoaderCode"
  />
</template>

<script>
// Components
import ButtonComponent from './ButtonComponent';

// Data
import gameVersions from '../data/gameVersions.json';

// Util
import { translateCode } from '../i18n/localeHelper';

export default {
  props: {
    codes: { type: Array },
    stageLoaderCode: { type: String },
    format: { type: String },
    versionIdentifier: { type: String },
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

      console.log(`Preparing download for ${this.format}`);
      const fileName = gameVersions.find((v) => v.identifier === this.versionIdentifier).version;

      switch (this.format) {
        case 'gct':
          this.generateGCT(c, fileName);
          break;
        case 'dolphin':
          this.generateDolphinINI(c, fileName);
          break;
        case 'gcm':
          this.generateCheatManagerTXT(c, fileName);
          break;
      }
    },
    generateGCT(codes, version) {
      let code = '00D0C0DE00D0C0DE';
      codes.forEach((c) => (code += c.source));
      code += 'FF00000000000000';

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
