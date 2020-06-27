<template>
  <div>
    <h4>{{ code.title }}</h4>
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
    code: { type: Object },
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
