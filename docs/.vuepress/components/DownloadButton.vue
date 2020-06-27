<template>
  <ButtonComponent label="Download" :onClick="onClick" :disabled="!codes || codes.length === 0" />
</template>

<script>
import ButtonComponent from "./ButtonComponent";
import CodeFormatter from "./scripts/codeFormatter";

export default {
  props: {
    codes: { type: Array },
    format: { type: String },
    versionIdentifier: { type: String }
  },
  methods: {
    onClick() {
      if (!this.codes || this.codes.length === 0) {
        return;
      }

      console.log(`Preparing download for ${this.format}`);
      switch (this.format) {
        case "gct":
          CodeFormatter.generateGCT(this.codes, this.versionIdentifier);
          break;
        case "dolphin":
          CodeFormatter.generateDolphinINI(this.codes, this.versionIdentifier);
          break;
        case "gcm":
          CodeFormatter.generateCheatManagerTXT(
            this.codes,
            this.versionIdentifier
          );
          break;
      }
    }
  }
};
</script>


