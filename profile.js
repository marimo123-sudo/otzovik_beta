document.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;

    tg.BackButton.hide();

    if (user) {
        document.getElementById('name').textContent = user.first_name;
        console.log(user.id);
    }

    // Переход на страницу продукта при клике
    document.getElementById("product-list").addEventListener("click", e => {
        const product = e.target.closest(".product");
        if (product?.dataset.id) {
            window.location.href = `product/product.html?id=${product.dataset.id}`;
        }
    });

    try {
        const res = await fetch(`https://otzoviktg.ru/get_products?tg_id=${user.id}`);
        if (!res.ok) {
            if (res.status === 404) return console.log("Не удалось найти список продуктов");
            throw new Error("Ошибка сервера при получении продуктов");
        }

        const products = await res.json();
        console.log("Список продуктов:", products);

        const container = document.getElementById("product-list");
        container.innerHTML = "";

        for (const p of products) {
            container.innerHTML += `
                <div class="product" data-id="${p.id}">
                    <div class="product_infos">
                        <img src="img/black_star.png" class="product_star">
                        <div class="product_mark">${p.review || "—"}</div>
                        <div class="us_and_count">
                            <div class="us">${p.username || p.name || "@unknown"}</div>
                            <div class="count">${p.members || 0} участников</div>
                        </div>
                        <img src="img/right_black.png" class="product_right">
                        <div class="product_underline"></div>
                    </div>
                </div>
            `;
        }

    } catch (err) {
        console.error("Ошибка при получении продуктов:", err);
    }
});

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
