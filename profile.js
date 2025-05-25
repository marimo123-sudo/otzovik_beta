async function parseHashParams() {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    
    const formData = new FormData();
    formData.append('tg_id', user.id);
    formData.append('name', user.first_name);
    await fetch('https://otzoviktg.ru/create_user', {
        method: 'POST',
        body: formData,
    })
    const hash = decodeURIComponent(window.location.hash.substring(1)); // убираем #
    var params = {};
    // делим по &
    const parts = hash.split('&');
    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key && value) {
            params[key] = value;
        }
    }

    return params;
}

async function redirectIfProduct() {
    const hashParams = await parseHashParams();

    const startParam = hashParams["start_param"] || hashParams["tgWebAppStartParam"];
    if (startParam && startParam.startsWith("product_")) {
        const productId = startParam.split("_")[1];
        if (productId) {
            window.location.href = `/product/product.html?id=${productId}`;
        }
    }
}

window.addEventListener("load", redirectIfProduct);





document.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;

    tg.BackButton.hide();

    if (user) {
        document.getElementById('name').textContent = user.first_name;
        console.log(user.id);
    }
    else {
        window.close();
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
        var list_of_data = await res.json();
        const products = list_of_data[1];
        var avatar = list_of_data[0]
        var avatar_html = document.getElementsByClassName("avatars")
        for (let i = 0; i < avatar_html.length; i++) {
            avatar_html[i].src = avatar;
        }
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
                            <div class="us">@${p.username || p.name || "@unknown"}</div>
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




Telegram.WebApp.ready();