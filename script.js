document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);

  toggleBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
  });

  function setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    toggleBtn.textContent = dark ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
});