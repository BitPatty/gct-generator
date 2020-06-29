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
import CodeFormatter from './scripts/codeFormatter';

// Data
import gameVersions from '../data/gameVersions.json';

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

      console.log(`Preparing download for ${this.format}`);
      const fileName = gameVersions.find(v => v.identifier === this.versionIdentifier).version;

      switch (this.format) {
        case 'gct':
          CodeFormatter.generateGCT(c, fileName);
          break;
        case 'dolphin':
          CodeFormatter.generateDolphinINI(c, fileName);
          break;
        case 'gcm':
          CodeFormatter.generateCheatManagerTXT(c, fileName);
          break;
      }
    },
  },
};
</script>
