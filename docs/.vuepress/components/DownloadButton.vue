<template>
  <div
    :class="
      !codes || codes.length === 0
        ? 'download-wrapper disabled'
        : 'download-wrapper'
    "
  >
    <button @click="onClick">Download</button>
  </div>
</template>

<script>
import CodeFormatter from "./scripts/codeFormatter";

export default {
  props: {
    codes: { type: Array },
    format: { type: String },
    versionIdentifier: { type: String },
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
    },
  },
};
</script>

<style scoped>
.download-wrapper {
  position: relative;
  display: block;
  max-width: 400px;
  min-width: 180px;
  margin: 0 auto;
  text-align: center;
}

.download-wrapper.disabled button {
  background-color: rgb(165, 165, 165);
  cursor: not-allowed;
}

button {
  border: none;
  outline: none;
  background-color: #2eb9e2;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  margin: 0;
  display: block;
  width: 100%;
  padding: 6px 15px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #3fc1e9;
}
</style>
