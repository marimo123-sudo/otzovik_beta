document.addEventListener("DOMContentLoaded", function () {
    const tg = window.Telegram.WebApp;
    tg.BackButton.show();
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product_id");
    console.log(productId);
    tg.BackButton.onClick(() => {
        window.location.href = `../product/product.html?id=${productId}`;
    });

    const textarea = document.getElementById("review");

    // ❌ Блокируем Enter
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

    // ✅ Удаляем \n при вставке
    textarea.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text");
        const cleaned = pasted.replace(/[\r\n]/g, "").replace(/\t/g, " ");                  
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;

        const before = currentValue.slice(0, start);
        const after = currentValue.slice(end);

        // Рассчитываем, сколько символов можно вставить
        const maxLength = 300;
        const available = maxLength - (before.length + after.length);
        const allowedInsert = cleaned.slice(0, available); // обрезаем, если надо

        // Вставка
        textarea.value = before + allowedInsert + after;
        textarea.selectionStart = textarea.selectionEnd = before.length + allowedInsert.length;

        // Обновляем высоту
        textarea.dispatchEvent(new Event("input"));
    });


    // 📏 Автоматическое увеличение высоты (максимум 10 строк)
    textarea.addEventListener("input", () => {
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
        const maxLines = 11;
        const maxHeight = lineHeight * maxLines;

        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    });
});


async function sendReview({ tg_id, product_id, text, stars }) {
    if (stars < 1 || stars > 5) {
        throw new Error("Оценка должна быть от 1 до 5");
    }

    const response = await fetch("https://otzoviktg.ru/add_review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tg_id,
            product_id,
            text,
            stars
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Ошибка при отправке отзыва");
    }

    return data; // возвращаем, чтобы потом использовать new_avg или другое
}


var phase = 0
var is_pressed = false
const next_btn = document.querySelector(".next_button")
const stars = document.querySelectorAll('.rating span');
const ratingValue = document.querySelector('.rating-value');
let currentRating = 0;
const firstPhase = document.querySelector(".first_phase");
const secondPhase = document.querySelector(".second_phase");

stars.forEach((star, index) => {

  star.addEventListener('click', () => {
    is_pressed = true
    next_btn.classList.add("can_press")
    currentRating = index + 1;
    ratingValue.textContent = currentRating.toFixed(1);
    stars.forEach((s, i) => s.classList.toggle('active', i < currentRating));
  });
});
next_btn.addEventListener("click", async () => {
    if (!next_btn.classList.contains("can_press")) {
        return
    }
    if (phase == 0) {
        // Анимируем первую фазу вверх
        hidefirstPhase();
        // Ждём завершения анимации (600мс), затем показываем вторую
        setTimeout(() => {
            showSecondPhase();
        }, 600);
        // Показываем вторую фазу через 600мс (после завершения анимации)
        next_btn.textContent = "Опубликовать"
        phase = 1
    }
    else {
        next_btn.classList.remove("can_press")
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        const tg_id = user.id;
        const urlParams = new URLSearchParams(window.location.search);
        const product_id = parseInt(urlParams.get("product_id"));
        
        const text = document.getElementById("review").value.trim();
        
        if (!is_pressed || currentRating < 1) {
            alert("Поставьте оценку перед отправкой.");
            return;
        }
        
        if (!text) {
            alert("Напишите отзыв перед отправкой.");
            return;
        }
        
        try {
            const data = await sendReview({
                tg_id,
                product_id,
                text,
                stars: parseFloat(currentRating)
            });

            console.log("Отзыв добавлен!", data);
            window.location.href = `../product/product.html?id=${product_id}`;
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
        
    }
});


function previewImage(inputId, blockSelector) {
  const input = document.getElementById(inputId);
  const block = document.querySelector(blockSelector);

  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        block.style.backgroundImage = `url(${e.target.result})`;
        block.style.backgroundSize = 'cover';
        block.style.backgroundPosition = 'center';
        block.textContent = ''; // Убираем +
      };
      reader.readAsDataURL(input.files[0]);
    }
  });
}

previewImage("photo1", ".photo.large");
previewImage("photo2", ".small_column .photo:nth-child(1)");
previewImage("photo3", ".small_column .photo:nth-child(2)");


const element = document.querySelector('.second_phase');

function showSecondPhase() {
    element.style.display = 'flex'; // или 'block', в зависимости от нужного поведения

    // немного подождать, чтобы браузер применил display, затем добавить класс
    requestAnimationFrame(() => {
        element.classList.add('show');
    });
}

function hidefirstPhase() {
    element.classList.add('animate-up');
    
    // Ждём окончания анимации (0.6 сек), потом скрываем
    setTimeout(() => {
        firstPhase.style.display = 'none';
    }, 600);
}
