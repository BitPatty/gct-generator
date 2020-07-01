<template>
  <div class="wrapper">
    <div v-for="version in gameVersions" class="card" @click="onCardClick(version)">
      <h3>{{ version.name }}</h3>
    </div>
  </div>
</template>

<script>
// Data
import gameVersions from '../data/gameVersions.json';

export default {
  data() {
    return {
      gameVersions,
    };
  },
  methods: {
    onCardClick(v) {
      window.location.href = `/code-reference/${v.identifier.toLowerCase()}.html`;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.card {
  width: 300px;
  max-width: 100%;
  margin: 5px;
  padding: 15px;
  background-color: #f3f5f7;
  border-left: 0.5rem solid #42b983;
  cursor: pointer;
  text-align: center;
  color: #3eaf7c;
}

.card:hover {
  background-color: #e5f0eb;
}
</style>
