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

      const version = gameVersions.find((v) => v.identifier === this.versionIdentifier).version;

      // save download code list to local storage for retrieval (last downloaded)
      try {
        const codeTitles = codeList.map(c => c.title.find(o => o.lang === 'en-US').content);
        localStorage.setItem(lskeyLDC, JSON.stringify(codeTitles));
      } catch {}


      // apply customizable codes
      for (const code of codeList) {
        const codegen = codegens[code.id];
        if (codegen) {
          code.source = codegen(this.versionIdentifier, code.source);
        }
      }

      let format;
      const formats = this.format.split('+');

      if (formats[0] === 'gci') {
        format = formats[1];
        const codeListGCT = [];
        const codeListGCI = codeList.splice(0).flatMap(c => {
          // TODO
          if (c.id === 'IntroSkip' || c.category === 'memcardpatch') {
            codeListGCT.push(c);
            return [];
          }
          return c;
        });

        // download GCI Loader + GCT only code as remaining format
        const {codes} = gameVersions.find((v) => v.identifier === this.versionIdentifier);
        const gciLoader = codes.find(code => code.id === 'GCILoader');
        codeList.push({
          ...gciLoader,
          title: translateCode(gciLoader, this.$lang).title,
        }, ...codeListGCT);
        if (!format && codeListGCT.length) {
          const list = codeListGCT.map(c => (
            c.title.find(o => o.lang === this.$lang) ??
            c.title.find(o => o.lang === 'en-US')
          ).content).join(', ');
          alert(translate('generatorconfig.alert.gci-compatibility', this.$lang)+list);
        }
        // download GCI file
        if (codeListGCI.length) {
          this.generateGCI(codeListGCI, version);
        }
      } else {
        format = formats[0];
      }

      // 16 = 8(00D0C0DE 00D0C0DE) + 8(F0000000 00000000)
      const codeSize = codeList.reduce((a, e) => a + e.source.length, 0) / 2 + 16;
      // generate file
      switch (format) {
        case 'gct':
          this.alertGCTCodeSize(codeSize);
          this.generateGCT(codeList, version);
          break;
        case 'dolphin':
          this.alertDolphinCodeSize(codeSize);
          this.generateDolphinINI(codeList, version);
          break;
        case 'gcm':
          this.alertDolphinCodeSize(codeSize);
          this.generateCheatManagerTXT(codeList, version);
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
    getGCILoader() {
      const {codes} = gameVersions.find((v) => v.identifier === this.versionIdentifier);
      const code = codes.find(code => code.id === 'GCILoader');
      return [code];
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
    generateGCI(codes, version) {
      let code = '';
      codes.forEach((c) => (code += c.source));
      code += 'C0000000000000023C60817F81E317FC7DE478504E800020'; // return
      
      // const codeSize = code.length>>1;

      const fileName = `GCT_${this.versionIdentifier}`; // GMSJ0A
      const blockCount = 6; // Math.ceil(codeSize/0x2000); // TODO
      const headSize = 0x40;
      const gciSize = headSize+0x2000*blockCount;
      const rawData = new Uint8Array(gciSize);

      for (let iD=headSize, iC=0; iC<code.length; iD++, iC+=2) {
        rawData[iD] = parseInt(code.slice(iC, iC+2), 16);
      }

      // game id
      [...new TextEncoder().encode(version), 0xff, 0x00].forEach((e, i) => rawData[i] = e);
      // file name
      [...new TextEncoder().encode(fileName)].forEach((e, i) => rawData[0x8+i] = e);
      // block count
      rawData[0x39] = blockCount;
      // ff*6
      for (let i=0x3A; i<0x40; i++) rawData[i] = 0xff;

      this.downloadFile(rawData, `01-${version.slice(0, 4)}-${fileName}.gci`);
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
