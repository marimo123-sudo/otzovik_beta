const updateViewport = () => {
    const vh = Math.min(
        window.innerHeight, 
        window.visualViewport?.height || window.innerHeight
    );
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

updateViewport();
// window.addEventListener('resize', updateViewport);
// window.visualViewport?.addEventListener('resize', updateViewport);

Telegram.WebApp.setHeaderColor('#ffffff'); // любой hex-цвет

Telegram.WebApp.ready();
Telegram.WebApp.expand();