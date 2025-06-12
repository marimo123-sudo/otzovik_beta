const select = document.querySelector('.select_type');
const input = document.querySelector('.username_input');
const nextBtn = document.querySelector('.next_button');

function validateForm() {
    const isSelectFilled = select.value !== "";
    const inputValue = input.value.trim();
    const isInputValid = inputValue.length >= 5;

    if (isSelectFilled && isInputValid) {
        nextBtn.disabled = false;
        nextBtn.classList.add("enabled");
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove("enabled");
    }
}


const updateViewport = () => {
    const vh = Math.min(
        window.innerHeight, 
        window.visualViewport?.height || window.innerHeight
    );
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

updateViewport();


select.addEventListener('change', validateForm);
input.addEventListener('input', validateForm);

// Проверка при загрузке
validateForm();


const firstPhase = document.querySelector('.first_phase');
const secondPhase = document.querySelector('.second_phase');
const question = document.querySelector('.question');
const hint = document.querySelector('.ten_nim_hint');

nextBtn.addEventListener('click', async function () {
    if (!nextBtn.disabled) {
        // Анимация: скрываем первую фазу
        firstPhase.classList.add('hide');
        
        var type = select.value
        var username = input.value.trim();
        username = username.replace(/^https?:\/\/t\.me\/?/, "");


        const user = Telegram.WebApp.initDataUnsafe.user;
        var tg_id = user.id
        try {
            // Отправляем POST-запрос на сервер
            const response = await fetch(`https://otzoviktg.ru/add_product?type=${type}&username=${username}&tg_id=${tg_id}`);

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ответ сервера:', result);

            // Показываем вторую фазу с информацией
            question.textContent = "Отлично!";
            hint.textContent = "Проверка и добавление могут занять до 5 минут";

        } catch (error) {
            // Обработка ошибок запроса
            question.textContent = "Ошибка при отправке данных";
            hint.textContent = error.message;
            // Можно показать вторую фазу с сообщением об ошибке или иначе
        }

        // Заполняем вторую фазу текстом
        question.textContent = "Отлично!";
        hint.textContent = "Проверка и добавление могут занять до 5 минут";

        // Показываем вторую фазу с задержкой (после анимации hide)
        setTimeout(() => {
                secondPhase.classList.add('active');
            }, 500); // Должно совпадать с transition-duration
        }
        setTimeout(() => {
        secondPhase.classList.add('active');

        // Меняем текст кнопки и включаем переход на главную
        nextBtn.textContent = "На главную";

        // Удалим старый обработчик и добавим новый
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        const newBtn = document.querySelector('.next_button');
        newBtn.addEventListener('click', () => {
            window.location.href = "../index.html"; // замени на свою главную страницу
                });
        }, 500);
});


document.addEventListener("DOMContentLoaded", function () {
    const tg = window.Telegram.WebApp;
    tg.BackButton.show();

    tg.BackButton.onClick(() => {
        window.location.href = '../index.html';
    });
});
