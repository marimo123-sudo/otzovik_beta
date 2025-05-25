function setupTelegramThemeListener() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.warn("Telegram WebApp API не найден");
    return;
  }

  // Функция для применения темы по текущему состоянию
  function applyTheme() {
    if (tg.colorScheme === "dark") {
        Telegram.WebApp.setHeaderColor('#000000'); // любой hex-цвет
        Telegram.WebApp.setBackgroundColor('#000000'); // любой hex-цвет
        document.body.classList.add("dark");
    } else {
        Telegram.WebApp.setHeaderColor('#ffffff'); // любой hex-цвет
        Telegram.WebApp.setBackgroundColor('#ffffff'); // любой hex-цвет
        document.body.classList.remove("dark");
    }
  }

  // Применяем сразу при загрузке
  applyTheme();

  // Подписываемся на событие смены темы в Telegram
  tg.onEvent("themeChanged", () => {
    applyTheme();
  });
}

// Запускаем при загрузке страницы
document.addEventListener("DOMContentLoaded", setupTelegramThemeListener);
