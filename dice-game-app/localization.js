// Basic internationalization helper
const i18n = {
    current: 'en',
    data: {},

    async load(lang) {
        if (this.data[lang]) {
            this.current = lang;
            return;
        }
        try {
            const resp = await fetch(`langs/${lang}.json`);
            if (!resp.ok) throw new Error('failed to load language');
            this.data[lang] = await resp.json();
            this.current = lang;
        } catch (e) {
            console.warn('i18n load failed', e);
        }
    },

    t(key, vars = {}) {
        const lookup = this.data[this.current] || {};
        let str = lookup[key] || lookup[key.split('.').pop()] || key;
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
        });
        return str;
    }
};

function translateContainer(container) {
    container.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = i18n.t(key);
    });
}

// initialize language selector on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    const defaultLang = navigator.language.slice(0, 2) || 'en';
    const saved = localStorage.getItem('lang');
    const initial = saved || defaultLang;
    await i18n.load(initial);

    // translate anything that might already be present (e.g. <title>)
    translateContainer(document);

    // populate selector if present
    const sel = document.getElementById('language-selector');
    if (sel) {
        sel.value = i18n.current;
        sel.addEventListener('change', async (e) => {
            const lang = e.target.value;
            localStorage.setItem('lang', lang);
            await i18n.load(lang);
            // reload to simplify re-rendering
            location.reload();
        });
    }
});
