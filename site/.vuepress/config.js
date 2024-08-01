const { description } = require('../../package');
const themePlugins = require('./data/themePlugins.json');
const locales = require('./i18n/locales.json');

module.exports = {
  title: 'GCT Generator',
  description: description,
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'Cache-control', content: 'public,max-age=3600' }],
    ['script', { type: 'text/javascript', src: '/april.js' }],
  ],

  /**
   * Markdown Extensions
   */
  markdown: {
    extendMarkdown: (md) => {
      md.use(require('@sup39/markdown-it-inline-tag'));
      md.use(require('@sup39/markdown-it-attr'));
    },
  },

  /**
   * Locales
   */
  locales,

  /**
   * Theme Configuration
   */
  themeConfig: {
    repo: 'BitPatty/gct-generator',
    editLinks: true,
    docsDir: 'site',
    docsBranch: 'master',
    lastUpdated: false,
    locales,
    plugins: themePlugins,
    activeHeaderLinks: false,
  },

  /**
   * VuePress Plugins
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
