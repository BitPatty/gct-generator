window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();

  if (now.getMonth() === 3 && now.getDate() === 1) {
    document.body.classList.add('fool');
  }
});
