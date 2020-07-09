<template>
  <SelectComponent
    :placeholder="getLabel('generatorconfig.gameversion.placeholder')"
    :selectedValue="selectedValue"
    :options="options"
    :onChange="onChange"
  />
</template>

<script>
// Components
import SelectComponent from './SelectComponent';

// Data
import gameVersions from '../data/gameVersions.json';

// Util
import { translate } from '../i18n/localeHelper';

export default {
  props: {
    selectedValue: { type: String },
    onChange: { type: Function },
  },
  data() {
    return {
      options: gameVersions.map((v) => ({
        value: v.identifier,
        label: `common.${v.identifier}`,
      })),
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
  }
};
</script>

<style scoped></style>
