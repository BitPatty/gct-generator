<template>
  <div>
    <section class="appearance">
      <h3>{{ l('h3.appearance') }}</h3>
      <TextConfig v-model="textConfig" />
    </section>
  </div>
</template>

<script>
import { defaultConfig, lskey, getConfig, getPreviewText } from './codegen.js';
import { makeUpdateConfig, makeGetLabel } from '../utils';
import labels from '../labels.json';
import TextConfig from '../TextConfig.vue';

const updateConfig = makeUpdateConfig(lskey, defaultConfig, getPreviewText);
export default {
  components: {
    TextConfig,
  },
  props: {
    version: { type: String },
  },
  methods: {
    updateConfig,
  },
  data() {
    const config = getConfig();
    return {...config};
  },
  computed: {
    l() {
      return makeGetLabel(labels, this.$lang);
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
    duration: updateConfig,
  },
};
</script>
