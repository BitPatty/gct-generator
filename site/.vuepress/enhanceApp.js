export default ({ isServer }) => {
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
