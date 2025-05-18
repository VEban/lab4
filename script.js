// Функція для збору та збереження інформації
function saveBrowserAndOSInfo() {
    // Інформація про браузер
    const browserInfo = {
        appName: navigator.appName,
        appCodeName: navigator.appCodeName,
        appVersion: navigator.appVersion,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        vendor: navigator.vendor,
        cookiesEnabled: navigator.cookieEnabled
    };

    // Інформація про операційну систему (частково з userAgent та platform)
    // Більш детальна інформація про ОС напряму з браузера обмежена з міркувань безпеки
    const osInfo = {
        platform: navigator.platform,
        userAgentContainsWindows: navigator.userAgent.toLowerCase().includes("windows"),
        userAgentContainsMac: navigator.userAgent.toLowerCase().includes("macintosh"),
        userAgentContainsLinux: navigator.userAgent.toLowerCase().includes("linux")
    };

    // Зберігаємо у localStorage
    // localStorage може зберігати тільки рядки, тому об'єкти треба перетворити в JSON
    localStorage.setItem('browserInfo', JSON.stringify(browserInfo));
    localStorage.setItem('osInfo', JSON.stringify(osInfo));

    console.log('Інформація про браузер та ОС збережена в localStorage.');
}


function displayLocalStorageData() {
    const dataContainer = document.getElementById('localstorage-data');
    if (!dataContainer) {
        console.error('Елемент localstorage-data не знайдено');
        return;
    }
    dataContainer.innerHTML = ''; // Очищуємо попередній вміст

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<strong>${key}:</strong> <pre>${value}</pre>`; // <pre> для кращого форматування JSON
        dataContainer.appendChild(itemElement);
    }
}

// Викликаємо функцію для відображення після збереження
// Краще викликати її після того, як DOM повністю завантажений
document.addEventListener('DOMContentLoaded', () => {
    saveBrowserAndOSInfo(); // Збереження інформації
    displayLocalStorageData(); // Відображення інформації
});


async function fetchAndDisplayComments() {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) {
        console.error('Елемент comments-container не знайдено');
        return;
    }

    const variantNumber = 4;
    const apiUrl = `https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const comments = await response.json();

        // 2b. Відобразити отримані коментарі у порядку їх отримання
        commentsContainer.innerHTML = ''; // Очистити попередні коментарі
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment'); // Для можливих стилів
            commentElement.innerHTML = `
                <h3>${comment.name} (ID: ${comment.id})</h3>
                <p><strong>Email:</strong> ${comment.email}</p>
                <p>${comment.body}</p>
                <hr>
            `;
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Не вдалося завантажити коментарі:', error);
        commentsContainer.innerHTML = '<p>Помилка завантаження коментарів.</p>';
    }
}

// У блоці 'DOMContentLoaded':
document.addEventListener('DOMContentLoaded', () => {
    saveBrowserAndOSInfo();
    displayLocalStorageData();
    fetchAndDisplayComments();
    setupModal();
    setupThemeSwitcher(); // <--- Додаємо виклик функції
});


function setupModal() {
    const modal = document.getElementById('feedback-modal');
    const closeButton = document.querySelector('.close-button');

    if (!modal || !closeButton) {
        console.error('Елементи модального вікна не знайдено');
        return;
    }

    // Показати модальне вікно через 1 хвилину (60000 мілісекунд)
    setTimeout(() => {
        modal.style.display = 'flex'; // або 'block', залежно від стилів
    }, 60000); // 1 хвилина

    // Закрити модальне вікно по кліку на хрестик
    closeButton.onclick = function () {
        modal.style.display = 'none';
    }

    // Закрити модальне вікно по кліку поза ним
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}


function setupThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (!themeToggleButton) {
        console.error('Кнопка перемикання теми не знайдена');
        return;
    }

    function applyTheme(theme) {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            if (themeToggleButton) themeToggleButton.textContent = '☀️'; // Показати сонце
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            if (themeToggleButton) themeToggleButton.textContent = '🌙'; // Показати місяць
        }
    }


    // Перевірка збереженої теми при завантаженні
    const savedTheme = localStorage.getItem('theme');

    // 4b. Автоматичне перемикання теми залежно від часу доби
    const currentHour = new Date().getHours();
    let autoTheme = 'light'; // Денна тема за замовчуванням
    if (currentHour < 7 || currentHour >= 21) { // Нічний час (до 7 ранку або після 21 вечора)
        autoTheme = 'dark';
    }

    // Надаємо пріоритет збереженій темі користувача над автоматичною
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(autoTheme); // Якщо немає збереженої, застосовуємо автоматичну
    }


    // Обробник для кнопки
    themeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    });
}

