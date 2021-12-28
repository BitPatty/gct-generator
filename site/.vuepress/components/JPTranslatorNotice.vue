<template>
  <div v-if="!dismissed" class="custom-block tip">
    <p class="custom-block-title">
      Looking for Japanese translators <a href="#" v-on:click="onDismiss">[dismiss]</a>
    </p>
    <p>
      If you can help us with updating the translations please message psy#1363 on discord or open
      an issue/PR on
      <a href="https://github.com/BitPatty/gctGenerator" target="_blank" rel="noopener noreferrer"
        >GitHub<span
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            width="15"
            height="15"
            class="icon outbound"
          >
            <path
              fill="currentColor"
              d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
            ></path>
            <polygon
              fill="currentColor"
              points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
            ></polygon>
          </svg>
          <span class="sr-only">(opens new window)</span></span
        ></a
      >
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dismissed: true,
    };
  },
  mounted() {
    try {
      if (localStorage.getItem('jp-translator-notice-dismissed') !== 'y') {
        this.dismissed = false;
      }
    } catch {}
  },
  methods: {
    onDismiss() {
      try {
        localStorage.setItem('jp-translator-notice-dismissed', 'y');
        this.dismissed = true;
      } catch {}
    },
  },
};
</script>
