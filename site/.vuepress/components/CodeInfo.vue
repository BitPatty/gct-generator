<template>
  <div>
    <h3>{{ translatedCode.title }}</h3>
    <div class="metadata">
      <span>
        {{ getLabel('codeinfo.version') }} {{ translatedCode.version }} ({{ translatedCode.date }})
      </span>
      <span v-if="code.author.includes(',')"
        >{{ getLabel('codeinfo.authors') }} {{ translatedCode.author }}</span
      >
      <span v-else>{{ getLabel('codeinfo.author') }} {{ translatedCode.author }}</span>
    </div>
    <Preview v-if="showPreview" :config="previewConfig" />
    <p class="description" v-html="translatedCode.description"></p>
    <component v-if="configUI" :is="configUI" :version="version"
      :previewConfig="previewConfig" @config="$emit('config', {[code.id]: $event})" />
  </div>
</template>

<script>
import { translate, translateCode } from '../i18n/localeHelper';
import configUIs from './codes/ui.js';

export default {
  props: {
    anchor: { type: Boolean },
    code: { type: Object },
    version: { type: String },
    previewConfig: { type: Object },
  },
  computed: {
    translatedCode: function () {
      return translateCode(this.code, this.$lang);
    },
    configUI: function () {
      return configUIs[this.code.id];
    },
    showPreview() {
      return [
        'PatternSelector',
        'CustomizedDisplay',
        'qft',
        'qfst',
      ].includes(this.code.id); // TODO
    },
  },
  data() {
    return {};
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
  },
};
</script>

<style scoped>
.metadata span {
  display: block;
  font-style: italic;
  font-size: 0.9rem;
}

.description td {
  padding: 0;
}
</style>
