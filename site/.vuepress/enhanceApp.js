/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer,
}) => {
  if (isServer) return;

  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      if (location.hash && location.hash.length > 0) {
        const { hash } = location;

        const decoded = decodeURIComponent(hash);
        const targetAnchor = document.querySelector(decoded) ?? document.querySelector(hash);

        if (targetAnchor && targetAnchor.offsetTop) {
          window.scrollTo({ top: targetAnchor.offsetTop, behavior: 'smooth' });
        }
      }
    }
  };
};
