<template>
  <section>
    <h3 id="PatternSelector-config">{{l.appearance}}</h3>
    <Preview :config="previewConfig" />
    <div class="config-spacer" />
    <TextConfig v-model="textConfig" />
  </section>
</template>

<script>
import {getConfig, defaultConfig, lskey, getPreviewText} from './codegen.js';
import labels from './labels.json';
import TextConfig from '../TextConfig.vue';
import { makeUpdateConfig } from '../utils.js';

const updateConfig = makeUpdateConfig(lskey, defaultConfig, getPreviewText);
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
