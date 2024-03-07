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

export const lskeyLDC = '@/lastDLCodes';

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
      if ((!this.codes || !this.codes.length) && !this.stageLoaderCode) {
        return;
      }

      const codeList = this.codes.map((c) => ({
        ...c,
        // for recording previous downloaded code
        titleEN: c.title.find((o) => o.lang === 'en-US').content,
        // for generated txt, ini
        title: translateCode(c, this.$lang).title,
      }));

      // add dependencies information to title
      const id2code = Object.fromEntries(codeList.map((c) => [c.id, c]));
      const depBys = {};
      /* depends on */
      for (const c of codeList) {
        if (c.dependencies && c.dependencies.length) {
          c.dependencies.forEach((id) => {
            depBys[id] ??= [];
            depBys[id].push(c.title);
          });
          const depList = c.dependencies.map((id) => id2code[id].title).join(', ');
          c.title += ` **(REQUIRES: ${depList})**`;
        }
      }
      /* used by */
      for (const [id, depBy] of Object.entries(depBys)) {
        id2code[id].title += ` (Used by: ${depBy.join(', ')})`;
      }

      // save downloaded code list
      try {
        const codeTitles = codeList.map((c) => c.titleEN);
        localStorage.setItem(lskeyLDC, JSON.stringify(codeTitles));
      } catch {}

      if (this.stageLoaderCode)
        codeList.push({
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
            codes: codeList.map((code) => ({
              title: code.title,
              version: code.version,
            })),
          }),
        ]);
      } catch {}

      const fileName = gameVersions.find((v) => v.identifier === this.versionIdentifier).version;

      // apply customizable codes
      for (const code of codeList) {
        const codegen = codegens[code.id];
        if (codegen) {
          code.source = codegen(this.versionIdentifier, code.source);
        }
      }

      // generate file
      const codeSize = codeList.reduce((a, e) => a + e.source.length, 0) / 2 + 16; // 8(00D0)+8(F000)
      // console.log(codeSize, codeList);
      switch (this.format) {
        case 'gct':
          this.alertGCTCodeSize(codeSize);
          this.generateGCT(codeList, fileName);
          break;
        case 'dolphin':
          this.alertDolphinCodeSize(codeSize);
          this.generateDolphinINI(codeList, fileName);
          break;
        case 'gcm':
          this.alertDolphinCodeSize(codeSize);
          this.generateCheatManagerTXT(codeList, fileName);
          break;
      }
    },
    alertGCTCodeSize(size) {
      if (size > 5000) {
        alert(translate('generatorconfig.alert.gct', this.$lang).replaceAll('{size}', size));
      }
    },
    alertDolphinCodeSize(size) {
      if (size > 3272) {
        // 0x3000-0x2338
        // excluding header+footer
        alert(
          translate('generatorconfig.alert.dolphin', this.$lang).replaceAll('{size}', size - 16),
        );
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
        data += `\r\n$${code.title} (${code.date}) [${code.author}]\r\n`;
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

        data += `\r\n\r\n${code.title} (${code.date}) [${code.author}]\r\n`;
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
