<template>
  <div id="config">
    <section class="appearance">
      <h3>{{ l.h3 }}</h3>
      <TextConfig v-model="textConfig" />
    </section>
    <section class="freeze">
      <h3>{{ l.freeze.h3 }}</h3>
      <div>
        {{ l.freeze.duration }}<input type="number" min="0" max="32767" v-model="freezeDuration" />
        {{ l.freeze.frame }} = {{ ((freezeDuration * 1001) / 30000).toFixed(2) }} {{ l.freeze.sec }}
      </div>
      <table>
        <tbody>
          <tr v-for="key in freezeKeys" :key="key">
            <td>{{ l.freeze.rows[key] }}</td>
            <td>
              <input type="checkbox" :checked="freeze[key]" @change="onChangeFreeze($event, key)" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import { defaultConfig, lskey, getConfig, getPreviewText, codes, statusKeys } from './codegen.js';
import { makeUpdateConfig } from '../utils';
import labels from './labels.json';
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
    onChangeFreeze($event, key) {
      this.freeze[key] = $event.target.checked;
      this.updateConfig();
    },
    updateConfig,
  },
  data() {
    const config = getConfig();
    return {
      ...config,
      // const
      freezeKeys: [
        ...Object.keys(codes[this.version]?.freezeCodeHooks ?? {}),
        ...statusKeys,
      ],
    };
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
    freezeDuration: updateConfig,
  },
};
</script>

<style scoped>
input[type='number'],
td.right {
  text-align: right;
}
input[type='number'] {
  width: 3em;
  margin: 0 2px;
}
.appearance > div {
  padding: 0 0 4px;
}

input[type='number'] {
  -moz-appearance: textfield;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
