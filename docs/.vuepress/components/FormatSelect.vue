<template>
  <SelectComponent
    placeholder="Choose Format"
    :options="options"
    :selectedValue="selectedValue"
    :onChange="onChange"
  />
</template>

<script>
// Components
import SelectComponent from "./SelectComponent";

// Data
import downloadFormats from "../data/downloadFormats.json";

export default {
  props: {
    selectedValue: { type: String },
    onChange: { type: Function },
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
