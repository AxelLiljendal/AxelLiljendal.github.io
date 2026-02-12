const i18n = {
  currentLanguage: 'sv',
  translations: {},

  async init() {
    const savedLang = localStorage.getItem('language') || 'sv';
    await this.loadLanguage(savedLang);
    this.setupLanguageToggle();
  },

  async loadLanguage(lang) {
    try {
      const response = await fetch(`translations/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      this.translations = await response.json();
      this.currentLanguage = lang;
      this.applyTranslations();
      this.updateLanguageButton();
      document.documentElement.lang = lang;
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedTranslation(key);
      if (translation) {
        element.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.getNestedTranslation(key);
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });
  },

  getNestedTranslation(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
  },

  updateLanguageButton() {
    const langOptions = document.querySelectorAll('.lang-option');
    if (!langOptions.length) return;

    langOptions.forEach(option => {
      const langCode = option.getAttribute('data-lang');
      const checkmark = option.querySelector('.lang-check');
      
      if (langCode === this.currentLanguage) {
        checkmark.style.visibility = 'visible';
        option.classList.add('active');
      } else {
        checkmark.style.visibility = 'hidden';
        option.classList.remove('active');
      }
    });
  },

  setupLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle || !langDropdown) return;

    // Toggle dropdown
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    // Select language
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');
        if (selectedLang !== this.currentLanguage) {
          this.loadLanguage(selectedLang);
        }
        langDropdown.classList.remove('show');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeSelector = document.getElementById('theme-selector');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  
  if (!toggleBtn || !themeSelector || !themeDropdown) return;
  
  const sunSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`;
  const moonSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>`;

  let currentTheme = localStorage.getItem('selectedTheme') || 'default';
  const savedMode = localStorage.getItem('darkMode') === 'true';
  
  applyTheme(currentTheme, savedMode);
  updateThemeCheckmarks();

  // Toggle theme dropdown
  themeSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('show');
  });

  // Select theme
  themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedTheme = option.getAttribute('data-theme');
      if (selectedTheme !== currentTheme) {
        currentTheme = selectedTheme;
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(currentTheme, isDark);
        updateThemeCheckmarks();
        localStorage.setItem('selectedTheme', currentTheme);
      }
      themeDropdown.classList.remove('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeSelector.contains(e.target) && !themeDropdown.contains(e.target)) {
      themeDropdown.classList.remove('show');
    }
  });

  toggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(currentTheme, isDark);
    localStorage.setItem('darkMode', isDark);
  });

  function updateThemeCheckmarks() {
    themeOptions.forEach(option => {
      const themeValue = option.getAttribute('data-theme');
      const checkmark = option.querySelector('.theme-check');
      
      if (themeValue === currentTheme) {
        checkmark.style.visibility = 'visible';
        option.classList.add('active');
      } else {
        checkmark.style.visibility = 'hidden';
        option.classList.remove('active');
      }
    });
  }

  function applyTheme(theme, darkMode) {
    document.body.classList.remove('dark-mode');
    document.body.removeAttribute('data-theme');
    
    if (theme !== 'default') {
      document.body.setAttribute('data-theme', theme);
    }
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }

    toggleBtn.innerHTML = darkMode ? sunSVG : moonSVG;

    const ariaKey = darkMode ? 'theme.lightMode' : 'theme.darkMode';
    const translation = i18n.getNestedTranslation(ariaKey);
    if (translation) {
      toggleBtn.setAttribute('aria-label', translation);
    }
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