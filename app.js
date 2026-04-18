let T = {};
let currentLang = 'zh';

async function loadTranslations() {
    const response = await fetch('i18n.json');
    T = await response.json();
}

function detectLang() {
    const url = new URLSearchParams(window.location.search);
    if (url.get('lang') && T[url.get('lang')]) return url.get('lang');
    const saved = localStorage.getItem('prefLang');
    if (saved && T[saved]) return saved;
    return 'ja';
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('prefLang', lang);
    const t = T[lang];
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (t && t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

loadTranslations().then(() => {
    setLang(detectLang());
});