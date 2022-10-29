<template>
  <section>
    <h3 id="PatternSelector-config">{{l.appearance}}</h3>
    <Preview :config="previewConfig" />
    <div class="config-spacer" />
    <TextConfig v-model="textConfig" />
    <div>
      {{l.label}} <input v-model="label">
    </div>
  </section>
</template>

<script>
import {getConfig, lskey} from './codegen.js';
import labels from './labels.json';
import TextConfig from '../TextConfig.vue';

function updateConfig() {
  const {x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, label} = this;
  const config = {
    x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, label,
  };
  localStorage.setItem(lskey, JSON.stringify(config));
  this.$emit('config', config);
}

export default {
  components: {
    TextConfig,
  },
  props: {
    version: {type: String},
    previewConfig: {type: Object},
  },
  data() {
    const config = getConfig();
    return {...config};
  },
  methods: {
    updateConfig,
  },
  computed: {
    l() {
      return labels[this.$lang] ?? labels['en-US'];
    },
    textConfig: {
      get() {
        return this;
      },
      set(value) {
        Object.assign(this, value);
        this.updateConfig();
      },
    },
  },
  watch: {
    label: updateConfig,
  },
};
</script>

<style scoped>
div.config-spacer {
  height: 1em;
}
input {
  width: 6em;
}
</style>
