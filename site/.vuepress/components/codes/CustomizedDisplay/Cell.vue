<template>
  <div>
    <TextConfig v-model="textConfig" />
    <div>
      <div>{{l.format}}</div>
      <textarea v-model="fmt" :rows="rows" :cols="cols" />
    </div>
  </div>
</template>

<script>
import labels from './labels.json';
import TextConfig from '../TextConfig.vue';
import {format2previewText} from './codegen.js';

export default {
  components: {
    TextConfig,
  },
  props: {
    value: {type: Object},
    version: {type: String},
    rows: {type: Number, default: 7},
    cols: {type: Number, default: 40},
  },
  data() {
    const {fmt, text, ...textConfig} = this.value;
    return {
      textConfig,
      fmt,
    };
  },
  computed: {
    l() {
      return labels[this.$lang] ?? labels['en-US'];
    },
    preview() {
      return format2previewText(this.fmt, this.version);
    },
  },
  methods: {
    update() {
      this.$emit('input', {fmt: this.fmt, text: this.preview, ...this.textConfig});
    },
  },
  watch: {
    textConfig() {this.update()},
    fmt() {this.update()},
  },
}
</script>
