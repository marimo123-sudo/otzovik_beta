function applyTelegramTheme() {
  const tgTheme = Telegram.WebApp.colorScheme; // 'light' или 'dark'
  
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(tgTheme === 'dark' ? 'dark' : 'light');
}


window.addEventListener('DOMContentLoaded', () => {
  Telegram.WebApp.ready();
  applyTelegramTheme();
});

Telegram.WebApp.onEvent('themeChanged', applyTelegramTheme);
