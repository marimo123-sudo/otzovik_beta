const updateViewport = () => {
    const vh = Math.min(
        window.innerHeight, 
        window.visualViewport?.height || window.innerHeight
    );
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

updateViewport();
window.addEventListener('resize', updateViewport);
window.visualViewport?.addEventListener('resize', updateViewport);

try {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
catch {

}



