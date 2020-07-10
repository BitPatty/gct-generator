<template>
  <div>
    <h3>{{ translatedCode.title }}</h3>
    <div class="metadata">
      <span>
        {{ getLabel('codeinfo.version') }} {{ translatedCode.version }} ({{ translatedCode.date }})
      </span>
      <span v-if="code.author.includes(',')"
        >{{ getLabel('codeinfo.authors') }} {{ translatedCode.author }}</span
      >
      <span v-else>{{ getLabel('codeinfo.author') }} {{ translatedCode.author }}</span>
    </div>
    <p class="description" v-html="translatedCode.description"></p>
  </div>
</template>

<script>
import locales from '../i18n/locales.json';
import { translate, translateCode } from '../i18n/localeHelper';

export default {
  props: {
    anchor: { type: Boolean },
    code: { type: Object },
  },
  computed: {
    translatedCode: function () {
      return translateCode(this.code, this.$lang);
    },
  },
  data() {
    return {};
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
  },
};
</script>

<style scoped>
.metadata span {
  display: block;
  font-style: italic;
  font-size: 0.9rem;
}

.description td {
  padding: 0;
}
</style>
