<template>
  <div id="config">
    <h3>{{l('h3Config')}}</h3>
    <div>
      <span>{{l('lblButton')}}</span>
      <div v-for="info in buttonInfos" class="inline" :key="info.value">
        <input type="checkbox" :checked="button & info.value"
          @change="toggleButton($event, info.value)"><span>{{info.text}}</span>
      </div>
    </div>
    <div>
      <span>{{l('lblDPad')}}</span>
      <div v-for="info in dpadButtonInfos" class="inline" :key="info.value">
        <input type="checkbox" :checked="button & info.value"
          @change="toggleButton($event, info.value)"><span>{{info.text}}</span>
      </div>
    </div>
    <div v-if="button & buttonValues.Z" class="custom-block danger">
      <p>{{l('pCautionZ')}}</p>
    </div>
  </div>
</template>

<script>
import {getConfig, lskey, buttonValues} from './codegen.js';
import labels from './labels.json';
import {getLabels} from '../codegen.js';

export default {
  methods: {
    updateConfig() {
      localStorage.setItem(lskey, JSON.stringify({button: this.button}));
    },
    toggleButton(event, value) {
      this.button = event.target.checked ?
        this.button | value : // ON
        this.button & ~value; // OFF
      this.updateConfig();
    },
    l(id) {
      return labels[id][this.$lang] ?? labels[id]['en-US'];
    },
  },
  data() {
    const {button} = getConfig();
    return {
      button,
      // const
      buttonInfos: [
        'A', 'B', 'X', 'Y', 'L', 'R', 'Z',
      ].map(text => ({text, value: buttonValues[text]})),
      dpadButtonInfos: [
        {text: '←', value: buttonValues.DL},
        {text: '↓', value: buttonValues.DD},
        {text: '↑', value: buttonValues.DU},
        {text: '→', value: buttonValues.DR},
      ],
      buttonValues,
    };
  },
}
</script>

<style>
.inline {
  display: inline-block;
}
</style>
