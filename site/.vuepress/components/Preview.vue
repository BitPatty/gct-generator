<template>
  <div class="preview-root">
    <div class="preview-ctn">
      <PreviewString v-for="c in previews"
        :key="c.key" :config="c" :version="_version" />
    </div>
  </div>
</template>

<script>
import {previewIds} from './codes/preview.js';
export default {
  props: {
    config: {type: Object},
  },
  computed: {
    _version() {
      const {_version} = this.config;
      return _version;
    },
    previews() {
      return previewIds.flatMap(id => {
        const config = /**@type{any}*/(this.config)[id];
        if (config == null) return [];
        if (config instanceof Array) {
          return config.map((c, i) => ({...c, key: `${id}-${i}`}));
        } else {
          return {...config, key: id};
        }
      });
    },
  },
}
</script>

<style scoped>
.preview-root {
  position: relative;
  width: 600px;
  height: 448px;
  background: url(/img/preview/background.png);
  padding: 0;
  overflow: hidden;
}
.preview-ctn {
  position: absolute;
  top: -16px;
}
</style>
