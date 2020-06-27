<template>
  <SelectComponent :options="options" :onChange="onChange" />
</template>

<script>
import SelectComponent from "./SelectComponent";

import downloadFormats from "../data/downloadFormats.json";

export default {
  props: {
    selectedValue: { type: String },
    onChange: { type: Function },
  },
  mounted() {
    this.onChange(downloadFormats[0].target);
  },
  data() {
    return {
      options: downloadFormats.map((v) => ({
        value: v.target,
        label: v.name,
      })),
    };
  },
};
</script>

<style scoped></style>
