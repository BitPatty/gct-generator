<template>
  <div>
    <Preview :config="previewConfig" />
    <div v-for="c,i in config" :key="i" class="textcell">
      <button @click="config.splice(i, 1)" class="textcell-remove">&#215;</button>
      <Cell :value="c" @input="$event => config.splice(i, 1, $event)" :version="version" />
    </div>
    <div>
      <button @click="config.push(defaultConfigCell)" class="textcell-add">+</button>
    </div>
  </div>
</template>

<script>
import { defaultConfig, getConfig, lskey, format2previewText } from './codegen.js';
import Cell from './Cell.vue';

export default {
  components: {
    Cell,
  },
  props: {
    version: {type: String},
    previewConfig: {type: Object},
  },
  data() {
    const config = getConfig();
    const defaultConfigCell = {
      text: format2previewText(defaultConfig[0].fmt, this.version),
      ...defaultConfig[0],
    };
    return {config, defaultConfigCell};
  },
  watch: {
    config(config) {
      // save config
      const sconf = config.map(({text, ...o}) => ({...o}));
      localStorage.setItem(lskey, JSON.stringify(sconf));
      // emit
      this.$emit('config', config);
    },
  },
}
</script>

<style scoped>
.textcell {
  border: 1px solid black;
  padding: 4px 8px;
  margin: 4px 0;
}
.textcell-remove {
  padding: 0;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: red;
  cursor: pointer;
}
</style>
