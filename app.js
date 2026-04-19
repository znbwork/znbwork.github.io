let T = {};
let currentLang = 'zh';

async function loadTranslations() {
    const response = await fetch('i18n.json?' + new Date().getTime());
    T = await response.json();
    console.log('loadTranslations complete, T keys:', Object.keys(T), 'en keys:', Object.keys(T.en || {}).slice(0,10));
}

function detectLang() {
    const url = new URLSearchParams(window.location.search);
    if (url.get('lang') && T[url.get('lang')]) return url.get('lang');
    const saved = localStorage.getItem('prefLang');
    if (saved && T[saved]) return saved;
    return 'en';
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('prefLang', lang);
    const t = T[lang];
    console.log('setLang lang=', lang, 't available:', t ? 'yes' : 'no', 't keys count:', t ? Object.keys(t).length : 0);
    console.log('pr2 in t:', t && 'pr2' in t, 'value:', t && t['pr2']);
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (t && t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    renderSkillTags(t);
}

function renderSkillTags(t) {
    const fields = ['skill_lang', 'skill_os', 'skill_db', 'skill_middleware', 'skill_fw', 'skill_cloud', 'skill_tools', 'skill_comm'];
    fields.forEach(field => {
        const el = document.querySelector(`.skill-items[data-tags="${field}"]`);
        if (el && t[field]) {
            const items = t[field].split(',').map(s => s.trim());
            el.innerHTML = items.map(item => `<span class="skill-tag">${item}</span>`).join('');
        }
    });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

loadTranslations().then(() => {
    console.log('All langs loaded:', Object.keys(T));
    setLang(detectLang());
});