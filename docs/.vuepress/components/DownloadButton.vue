<template>
  <ButtonComponent
    label="Download"
    :onClick="onClick"
    :disabled="(!codes || codes.length === 0) && !stageLoaderCode"
  />
</template>

<script>
import ButtonComponent from './ButtonComponent';
import CodeFormatter from './scripts/codeFormatter';

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
      switch (this.format) {
        case 'gct':
          CodeFormatter.generateGCT(c, this.versionIdentifier);
          break;
        case 'dolphin':
          CodeFormatter.generateDolphinINI(c, this.versionIdentifier);
          break;
        case 'gcm':
          CodeFormatter.generateCheatManagerTXT(c, this.versionIdentifier);
          break;
      }
    },
  },
};
</script>
