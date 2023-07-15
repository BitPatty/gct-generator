<template>
  <div class="preview-root">
    <div class="preview-ctn">
      <PreviewString :config="config.qft" :version="_version" />
      <PreviewString v-for="mdp,i in (config.CustomizedDisplay || [])"
        :key="'mdp'+i" :config="mdp" :version="_version" />
      <PreviewString :config="config.PatternSelector" :version="_version" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {type: Object},
  },
  computed: {
    _version() {
      const {_version} = this.config
      return _version;
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
