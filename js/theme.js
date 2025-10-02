const THEME_KEY = 'stellar-theme';
const ACCENT_COLOR_KEY = 'stellar-accent-color';

/**
 * Applies the selected theme (dark/light) to the document.
 * @param {string} theme - The theme to apply ('dark' or 'light').
 */
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
};

/**
 * Applies the selected accent color to the document.
 * @param {string} color - The CSS variable string of the color to apply.
 */
const applyAccentColor = (color) => {
    if (!color) return;
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem(ACCENT_COLOR_KEY, color);

    // Update active class on swatches to reflect the change
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color === color);
    });
};

/**
 * Toggles between dark and light themes.
 */
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleLanding = document.getElementById('theme-toggle-landing');
    const themeToggleApp = document.getElementById('theme-toggle-app');

    // Apply saved theme on load
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    // Apply saved accent color on load
    const savedAccentColor = localStorage.getItem(ACCENT_COLOR_KEY) || 'var(--accent-blue)';
    applyAccentColor(savedAccentColor);

    // Attach listeners to theme toggles
    if (themeToggleLanding) themeToggleLanding.addEventListener('click', toggleTheme);
    if (themeToggleApp) themeToggleApp.addEventListener('click', toggleTheme);

    // --- Mouse Glow Effect ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }
});