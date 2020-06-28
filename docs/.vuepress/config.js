const { description } = require("../../package");

module.exports = {
  title: "GCT Generator",
  description: description,
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "BitPatty/gctGenerator",
    editLinks: true,
    docsDir: "docs",
    editLinkText: "Edit this page on GitHub",
    lastUpdated: false,
    nav: [
      {
        text: "Cookbook",
        link: "/guide.html",
      },
      {
        text: "Changelog",
        link: "/changelog.html",
      },
      {
        text: "Installing IOS58",
        link: "/ios58.html",
      },
      {
        text: "Sunshine Discord",
        link: "https://discord.gg/9dGJWEc",
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],
};
