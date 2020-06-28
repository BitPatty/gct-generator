<template>
  <div>
    <h3 v-if="anchor" :id="headerId">
      <a :href="`#${headerId}`" class="header-anchor">#</a>
      {{ code.title }}
    </h3>
    <h3 v-else>{{ code.title }}</h3>
    <div class="metadata">
      <span>Version: {{ code.version }} ({{ code.date }})</span>
      <span v-if="code.author.includes(',')">Authors: {{ code.author }}</span>
      <span v-else>Author: {{ code.author }}</span>
    </div>
    <p class="description" v-html="code.description"></p>
  </div>
</template>

<script>
export default {
  props: {
    anchor: { type: Boolean },
    code: { type: Object },
  },
  data() {
    return {
      headerId: this.code.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    };
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
