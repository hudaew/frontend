const root     = document.documentElement;
const btn      = document.getElementById('theme-btn');
const icon     = document.getElementById('theme-icon');
const label    = document.getElementById('theme-label');

// ── Detect initial theme ──
const saved = localStorage.getItem('theme');
const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = saved ?? (sysDark ? 'dark' : 'light');

applyTheme(initial);

// ── Toggle on click ──
btn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (theme === 'dark') {
    icon.textContent  = '☀️';
    label.textContent = 'Light Mode';
  } else {
    icon.textContent  = '🌙';
    label.textContent = 'Dark Mode';
  }
}
