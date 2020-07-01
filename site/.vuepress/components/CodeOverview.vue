<template>
  <div>
    <div v-if="codes.length === 0 && !hasError">Loading...</div>
    <div v-if="codes.length === 0 && hasError">Failed to load codes.</div>
    <CodeInfo v-for="code in codes" :code="code" :anchor="true" />
  </div>
</template>

<script>
// Components
import CodeInfo from './CodeInfo';

// Data
import gameVersions from '../data/gameVersions.json';

// Util
import parseXml from './scripts/parseXml';

// Libs
import axios from 'axios';

export default {
  props: {
    gameVersion: { type: String },
  },
  mounted() {
    if (localStorage.getItem('codes') != null) {
      try {
        const data = JSON.parse(localStorage.getItem('codes')).find(
          c => c.identifier === this.gameVersion,
        );
        if (data) {
          this.codes = data.cheats.sort((a, b) => (a.title > b.title ? 1 : -1));
          console.log(this.codes);
          return;
        }
      } catch {}
    }

    axios
      .get(`/codes/${this.gameVersion}.xml`)
      .then(response => {
        const xmlData = parseXml(response.data);
        this.codes = xmlData.sort((a, b) => (a.title > b.title ? 1 : -1));
      })
      .catch(() => (this.hasError = true));
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
  data() {
    return {
      codes: [],
      hasError: false,
    };
  },
};
</script>

<style>
body {
  overflow-y: scroll;
}
</style>
