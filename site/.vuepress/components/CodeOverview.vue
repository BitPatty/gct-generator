<template>
  <div>
    <CodeInfo v-for="code in codes" :code="code" :anchor="true" />
  </div>
</template>

<script>
// Components
import CodeInfo from './CodeInfo';

// Data
import gameVersions from '../data/gameVersions.json';

export default {
  props: {
    gameVersion: { type: String },
  },
  data() {
    return {
      codes: gameVersions
        .find((v) => v.identifier === this.gameVersion)
        .codes.sort((a, b) => (a.title > b.title ? 1 : -1)),
    };
  },
  updated() {
    // Scroll to anchor
    if (window.location.hash) {
      const anchorElement = document.querySelector(window.location.hash);
      if (anchorElement) {
        const topOffset = anchorElement.getBoundingClientRect().top;
        window.scrollTo({
          top: topOffset - 100,
          behavior: 'smooth',
        });
      }
    }
  },
};
</script>

<style>
body {
  overflow-y: scroll;
}
</style>
