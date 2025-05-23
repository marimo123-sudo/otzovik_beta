document.addEventListener("DOMContentLoaded", function () {
    const tg = window.Telegram.WebApp;
    tg.BackButton.show();

    tg.BackButton.onClick(() => {
        window.location.href = '../index.html';
    });
});


document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    console.log(productId);
    
    if (!productId) {
        console.error("Нет ID продукта в URL");
        return;
    }
    const btn = document.getElementById("create")

    btn.addEventListener("click", () => {
        window.location.href = `../create_review/create_review.html?product_id=${productId}`
    });
    try {
        const response = await fetch(`https://otzoviktg.ru/get_reviews?product_id=${productId}`);
        if (!response.ok) throw new Error("Ошибка при получении отзывов");

        const data = await response.json();
        console.log("Отзывы:", data);

        // Заполняем шапку (название, средний рейтинг)
        if (data.product) {
            document.querySelector(".product_name").textContent = data.product.name || "Без названия";
            document.querySelector(".product_review").textContent = data.product.review || "—";
            const container = document.getElementById("product_profile_container");
            if (data.product.avatar) {
                container.style.backgroundImage = `url('${data.product.avatar}')`;
            }

        }

        // Отзывы
        const reviewsContainer = document.querySelector(".reviews_container");
        reviewsContainer.innerHTML = ""; // очищаем шаблонные отзывы

        if (data.reviews && data.reviews.length > 0) {
            data.reviews.forEach(review => {
                const reviewDiv = document.createElement("div");
                reviewDiv.className = "review";

                // Создание блока с фотографиями
                let photosHTML = "";
                if (review.photos && Array.isArray(review.photos)) {
                    const limitedPhotos = review.photos.slice(0, 3); // максимум 3 фото
                    photosHTML = `
                        <div class="photo_scontainer">
                            ${limitedPhotos.map(photo => `<img src="${photo}" alt="photo" class="review_photo">`).join("")}
                        </div>
                    `;
                }

                reviewDiv.innerHTML = `
                    <div class="us_and_date_container">
                        <div class="us_and_date">
                            <div class="us">${review.username || "Anonim"}</div>
                            <div class="date">${review.days_ago}d</div>
                            <div class="for_right_side">
                                <div class="star_and_count">
                                    <img src="../img/black_star.png" alt="" class="black_star_review">
                                    <div class="count">${review.stars || "5"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="review_container">
                        <div class="review_text">${review.text || "None"}</div>
                    </div>
                    ${photosHTML}
                    <div class="underline"></div>
                `;

                reviewsContainer.appendChild(reviewDiv);
            });
        } else {
            reviewsContainer.innerHTML = "<p>Пока нет отзывов.</p>";
        }

    } catch (err) {
        console.error("Ошибка при загрузке отзывов:", err);
    }
});


