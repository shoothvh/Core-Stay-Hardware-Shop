function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
}

function toggleTheme() {
    const current = getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', getTheme() === 'dark' ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

// Init immediately to prevent flash
initTheme();

// Also on load
document.addEventListener('DOMContentLoaded', initTheme);
