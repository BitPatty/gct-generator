const { description } = require('../../package');
const customContainers = require('./data/customContainers.json');

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
   * Markdown Extensions
   */
  markdown: {
    extendMarkdown: (md) => {
      md.use(require('markdown-it-attrs'));
    },
  },

  /**
   * Theme Configuration
   */
  themeConfig: {
    repo: 'BitPatty/gctGenerator',
    editLinks: true,
    docsDir: 'site',
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
    plugins: customContainers,
  },

  /**
   * VuePress Plugins
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
