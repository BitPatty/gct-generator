window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();

  if (now.getMonth() === 2 && now.getDate() === 31) {
    document.body.classList.add('fool');
  }
});
