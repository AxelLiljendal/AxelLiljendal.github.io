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
      this.updateFlag();
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
    const flagIcon = document.getElementById('flag-icon');
    
    if (!langToggle || !langDropdown) return;

    this.updateFlag();
    this.updateLanguageCheckmarks();

    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');
        if (selectedLang !== this.currentLanguage) {
          this.loadLanguage(selectedLang);
          this.updateFlag();
          this.updateLanguageCheckmarks();
        }
        langDropdown.classList.remove('show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
      }
    });
  },

  updateLanguageCheckmarks() {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      const checkmark = option.querySelector('.lang-check');
      
      if (lang === this.currentLanguage) {
        checkmark.style.visibility = 'visible';
        option.classList.add('active');
      } else {
        checkmark.style.visibility = 'hidden';
        option.classList.remove('active');
      }
    });
  },

  updateFlag() {
    const flagIcon = document.getElementById('flag-icon');
    if (!flagIcon) return;

    if (this.currentLanguage === 'sv') {
      flagIcon.innerHTML = `
        <rect width="32" height="24" fill="#006AA7"/>
        <rect x="9" y="0" width="4" height="24" fill="#FECC00"/>
        <rect x="0" y="10" width="32" height="4" fill="#FECC00"/>
      `;
    } else {
      flagIcon.innerHTML = `
        <defs>
          <clipPath id="uk-clip">
            <rect width="32" height="24" rx="2"/>
          </clipPath>
        </defs>
        <g clip-path="url(#uk-clip)">
          <rect width="32" height="24" fill="#012169"/>
          <path d="M0,0 L32,24 M32,0 L0,24" stroke="#FFF" stroke-width="5.3"/>
          <path d="M0,0 L32,24 M32,0 L0,24" stroke="#C8102E" stroke-width="3.2"/>
          <path d="M16,0 L16,24 M0,12 L32,12" stroke="#FFF" stroke-width="8"/>
          <path d="M16,0 L16,24 M0,12 L32,12" stroke="#C8102E" stroke-width="4.8"/>
        </g>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');
  
  if (!toggleBtn) return;
  
  const sunSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`;
  const moonSVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>`;

  const savedMode = localStorage.getItem('darkMode') === 'true';
  
  applyDarkMode(savedMode);

  toggleBtn.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    applyDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
  });

  function applyDarkMode(darkMode) {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
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
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const closeModalBtn = document.getElementById('close-modal');
  const seeMoreBtns = document.querySelectorAll('.see-more-btn');

  const projectDetails = {
    schackeriet: {
      key: 'project7',
      tags: ['TypeScript', 'React', 'Vercel', 'Shopify', 'E-commerce', 'HTML/CSS'],
      live: 'https://www.schackeriet.se/sv',
      repo: null
    },
    claims: {
      key: 'project8',
      tags: ['Java', 'Spring Boot', 'React', 'Supabase', 'MongoDB', 'ERP Integration', 'Testing'],
      live: 'https://claims-handler.vercel.app/',
      repo: null
    },
    'personality-miner': {
      key: 'project6',
      tags: ['Python', 'LLM', 'RAG', 'Machine Learning', 'Ethics'],
      live: null,
      repo: null
    },
    'finance-tracker': {
      key: 'project5',
      tags: ['Java', 'Spring Boot', 'React', 'MongoDB', 'Spring Security', 'CI/CD', 'Testing'],
      live: null,
      repos: [
        { labelKey: 'backendRepo', url: 'https://github.com/AxelLiljendal/finance-tracker-backend' }
      ]
    },
    healthcaresdlc: {
      key: 'project4',
      tags: ['Java', 'React', 'PostgreSQL', 'Docker', 'CI/CD', 'SonarQube'],
      live: null,
      repos: [
        { labelKey: 'backendRepo', url: 'https://github.com/Larsin15/HealthCareSDLC-CodeNerds' },
        { labelKey: 'frontendRepo', url: 'https://github.com/Larsin15/HealthCareSDLC-CodeNerds-Frontend' }
      ]
    },
    homi: {
      key: 'project3',
      tags: ['Java', 'Spring Boot', 'React', 'MongoDB', 'Security'],
      live: null,
      repos: [
        { labelKey: 'backendRepo', url: 'https://github.com/Leo-J-Skola/Backend_Grupp' },
        { labelKey: 'frontendRepo', url: 'https://github.com/Leo-J-Skola/Frontend_Grupp' }
      ]
    },
    plantswap: {
      key: 'project2',
      tags: ['Java', 'Spring Boot'],
      live: null,
      repo: 'https://github.com/AxelLiljendal/plantswap'
    },
    'budget-tracker': {
      key: 'project1',
      tags: ['Java', 'Spring Boot'],
      live: null,
      repo: 'https://github.com/AxelLiljendal/Uppgift-2'
    }
  };

  function renderModalContent(projectKey) {
    const data = projectDetails[projectKey];
    if (!data) return '<div>Project details not found.</div>';
    const t = (key) => i18n.getNestedTranslation(key) || key;
    let html = `<h2>${t('sections.projects.' + data.key + '.title')}</h2>`;
    html += `<p>${t('sections.projects.' + data.key + '.description')}</p>`;
    if (data.tags && data.tags.length) {
      html += '<div class="project-tags">' + data.tags.map(tag => `<span class="tag">${tag}</span>`).join('') + '</div>';
    }
    html += '<div style="margin-top:1.5em;display:flex;gap:1em;flex-wrap:wrap;">';
    if (data.live) {
      html += `<a href="${data.live}" target="_blank" class="project-link" style="margin-bottom:0.5em;">${t('sections.projects.viewLiveSite')}</a>`;
    }
    if (data.repos && Array.isArray(data.repos)) {
      data.repos.forEach(repoObj => {
        let label = t('sections.projects.' + (repoObj.labelKey || 'repo'));
        if (label === 'sections.projects.' + (repoObj.labelKey || 'repo')) {
          if (repoObj.labelKey === 'backendRepo') label = t('sections.projects.backendRepo') || 'Backend Repository';
          if (repoObj.labelKey === 'frontendRepo') label = t('sections.projects.frontendRepo') || 'Frontend Repository';
        }
        html += `<a href="${repoObj.url}" target="_blank" class="project-link" style="margin-bottom:0.5em;">${label}</a>`;
      });
    } else if (data.repo) {
      html += `<a href="${data.repo}" target="_blank" class="project-link" style="margin-bottom:0.5em;">${t('sections.projects.viewProject')}</a>`;
    }
    html += '</div>';
    return html;
  }

  seeMoreBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const projectKey = btn.getAttribute('data-project');
      if (btn.classList.contains('disabled')) return;
      modalBody.innerHTML = renderModalContent(projectKey);
      modal.classList.add('show');
      modal.style.display = 'flex';
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      modal.classList.remove('show');
      setTimeout(() => { modal.style.display = 'none'; }, 200);
    });
  }
  // Close modal on outside click
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 200);
      }
    });
  }
});