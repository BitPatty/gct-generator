<template>
  <div class="preview-root">
    <div class="preview-ctn">
      <PreviewString v-for="c in previews"
        :key="c.key" :config="c" :version="_version" />
      <PreviewString v-for="c,i in config.CustomizedDisplay||[]"
        :key="'CustomizedDisplay-'+i" :config="c" :version="_version" />
      <ControllerPreview v-if="config.controller" :config="config.controller" />
    </div>
  </div>
</template>

<script>
import {previewIds} from './codes/preview.js';
import ControllerPreview from './codes/controller/preview.vue';

export default {
  components: {
    ControllerPreview,
  },
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
        // special
        if (['controller', 'CustomizedDisplay'].includes(id)) return [];
        if (config == null) return [];
        return {...config, key: id};
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
