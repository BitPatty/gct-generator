const { description } = require('../../package');

module.exports = {
  title: 'GCT Generator',
  description: description,
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'Cache-control', content: 'public,max-age=3600' }],
    ['script', { type: 'text/javascript', src: '/dna.js' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'BitPatty/gctGenerator',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: false,
    nav: [
      {
        text: 'Cookbook',
        link: '/guide.html',
      },
      {
        text: 'Code Reference',
        link: '/code-reference/index.html',
      },
      {
        text: 'Changelog',
        link: '/changelog.html',
      },
      {
        text: 'Installing IOS58',
        link: '/ios58.html',
      },
      {
        text: 'Sunshine Discord',
        link: 'https://discord.gg/9dGJWEc',
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
