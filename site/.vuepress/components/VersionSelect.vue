<template>
  <SelectComponent
    placeholder="Choose Version.."
    :selectedValue="selectedValue"
    :options="options"
    :onChange="onChange"
  />
</template>

<script>
import SelectComponent from './SelectComponent';

import gameVersions from '../data/gameVersions.json';

export default {
  props: {
    selectedValue: { type: String },
    onChange: { type: Function },
  },
  data() {
    return {
      options: gameVersions.map(v => ({
        value: v.identifier,
        label: v.name,
      })),
    };
  },
};
</script>

<style scoped></style>
