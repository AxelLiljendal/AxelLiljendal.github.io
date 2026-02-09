document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const sunSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#fff"/><g stroke="#fff" stroke-width="2"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`;
  const moonSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#000"/></svg>`;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);

  toggleBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
  });

  function setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    toggleBtn.innerHTML = dark ? sunSVG : moonSVG;
    toggleBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('header-dropdown');
  const middle = document.getElementById('header-middle');
  if (!dropdown || !middle) return;

  function updateDropdownVisibility() {
    if (window.innerWidth <= 600) {
      dropdown.style.display = '';
      middle.classList.remove('mobile-active');
    } else {
      dropdown.style.display = 'none';
      middle.classList.remove('mobile-active');
      middle.style.display = '';
    }
  }

  dropdown.addEventListener('click', function (e) {
    e.stopPropagation();
    middle.classList.toggle('mobile-active');
  });
  
  document.addEventListener('click', function (e) {
    if (window.innerWidth > 600) return;
    if (!middle.contains(e.target) && !dropdown.contains(e.target)) {
      middle.classList.remove('mobile-active');
    }
  });

  window.addEventListener('resize', updateDropdownVisibility);
  updateDropdownVisibility();
});