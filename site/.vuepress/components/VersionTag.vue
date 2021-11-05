<template>
  <span :class="[true, 'true'].includes(supported) ? 'card pcard' : 'card ncard'">{{
    getLabel(version)
  }}</span>
</template>

<script>
import { translate } from '../i18n/localeHelper';

export default {
  props: ['version', 'supported'],
  data() {
    return {};
  },
  methods: {
    getLabel(version) {
      return translate(`common.${version}`, this.$lang);
    },
  },
};
</script>

<style scoped>
.card {
  font-size: 0.8em;
  display: inline-block;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  margin-top: 10px;
}

.pcard {
  background: #3eaf7c;
}

.ncard {
  background: #df4d21e0;
}
</style>
