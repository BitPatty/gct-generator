<template>
  <div>
    <Preview :config="previewConfig" />
    <div v-for="c,i in config" :key="c.key" class="textcell">
      <button class="textcell-remove" @click="deletionConfirm(i)">&#215;</button>
      <Cell :value="c" @input="$event => config.splice(i, 1, {...$event, key: c.key})" :version="version" />
    </div>
    <div class="btn-ctn">
      <button @click="append(db.PAS)">{{l('add.PAS')}}</button>
      <button @click="append(db.speed)">{{l('add.speed')}}</button>
      <button @click="append(db.detailed)">{{l('add.detailed')}}</button>
      <button @click="append(db.rect)">{{l('add.rect')}}</button>
    </div>
  </div>
</template>

<script>
import labels from './labels.json';
import { defaultConfig, getConfig, lskey, format2previewText } from './codegen.js';
import configDB from './configDB.js';
import { makeUpdateConfig, makeGetLabel } from '../utils.js';
import Cell from './Cell.vue';

/** @typedef {'GMSJ01'|'GMSJ0A'|'GMSE01'|'GMSP01'} GameVersion */
export default {
  components: {
    Cell,
  },
  props: {
    version: {type: String},
    previewConfig: {type: Object},
  },
  computed: {
    l() {
      return makeGetLabel(labels, this.$lang);
    },
    db() {
      const version = /**@type{GameVersion}*/(this.version);
      return Object.fromEntries(Object.entries(configDB).map(([k, v]) => [
        k,
        {...v, text: format2previewText(v.fmt, version)},
      ]));
    },
  },
  data() {
    const version = /**@type{GameVersion}*/(this.version);
    const config = getConfig(version);
    const defaultConfigCell = {
      text: format2previewText(defaultConfig[0].fmt, version),
      ...defaultConfig[0],
    };
    const keys = config.map((e, i) => i);
    return {config, defaultConfigCell, keys, nextKey: keys.length};
  },
  watch: {
    config: makeUpdateConfig(lskey, defaultConfig),
  },
  methods: {
    /** @param {number} i */
    deletionConfirm(i) {
      // if (window.confirm(this.l('deletionConfirm'))) {
      this.config.splice(i, 1);
    },
    /** @param {any} c */
    append(c) {
      this.config.push({...c, key: this.nextKey++});
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
.btn-ctn button {
  display: block;
}
</style>
