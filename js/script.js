$(document).ready(function() {
    // ----------------------------------------------------
    // 1. ВЫПАДАЮЩЕЕ МЕНЮ (Toggle Menu)
    // ----------------------------------------------------
    $('#menu-toggle').on('click', function() {
        // Используем slideToggle для плавной анимации (Требование 5: Анимация)
        $('#main-nav-list').slideToggle(200);
    });

    // Скрытие меню при изменении размера экрана (для десктопа)
    $(window).resize(function() {
        if ($(window).width() > 767) {
            $('#main-nav-list').show();
        }
    });


    // ----------------------------------------------------
    // 2. ДИНАМИЧЕСКАЯ ГАЛЕРЕЯ (Загрузка из JSON)
    // ----------------------------------------------------
    const portfolioContainer = $('#portfolio-output');

    // $.getJSON для загрузки данных (Требование 4)
    $.getJSON('data/portfolio.json', function(data) {
        let htmlContent = '';

        $.each(data, function(index, item) {
            // Генерация HTML-карточки
            const itemClass = (index === 2) ? 'portfolio-item big-item' : 'portfolio-item';

            // Используем item.image для подстановки изображения
            htmlContent += `
                <div class="${itemClass}" style="opacity: 0;"> 
                    <img src="${item.image}" alt="${item.title}" class="project-preview">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p class="tags">${item.tags.join(', ')}</p>
                    <a href="${item.link}" target="_blank">ПОСМОТРЕТЬ</a>
                </div>
            `;
        });

        // Вставка сгенерированного контента в DOM
        portfolioContainer.append(htmlContent);

        // Плавное появление элементов после загрузки (Требование 5: Анимация)
        $('.portfolio-item').each(function(i) {
            $(this).delay(i * 100).animate({ opacity: 1 }, 300);
        });

    }).fail(function() {
        portfolioContainer.html('<p>Ошибка загрузки данных портфолио.</p>');
    });


    // ----------------------------------------------------
    // 3. ФОРМА ОБРАТНОЙ СВЯЗИ (Модальное окно, Валидация, Ajax)
    // ----------------------------------------------------
    const modal = $('#contact-modal');
    const form = $('#contact-form');
    const formMessage = $('#form-message');

    // 3a. Модальное окно (Требование 3)

    // Открытие
    $('#open-contact-modal').on('click', function(e) {
        e.preventDefault();
        modal.fadeIn(300); // Плавное появление (Требование 5)
    });

    // Закрытие по крестику
    $('.close-button').on('click', function() {
        modal.fadeOut(300);
    });

    // Закрытие по оверлею (клику вне окна)
    $(window).on('click', function(e) {
        if ($(e.target).is(modal)) {
            modal.fadeOut(300);
        }
    });

    // 3b. Валидация (Требование 5)

    function validateField(field) {
        const value = field.val().trim();
        const name = field.attr('name');
        const errorMessageDiv = $(`.${name}-error`);
        let isValid = true;

        errorMessageDiv.text('');
        field.removeClass('invalid-field');

        if (field.prop('required') && value === '') {
            errorMessageDiv.text('Это обязательное поле.');
            isValid = false;
        } else if (name === 'email' && value !== '' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            errorMessageDiv.text('Введите корректный email.');
            isValid = false;
        }

        if (!isValid) {
            field.addClass('invalid-field');
        }
        return isValid;
    }

    // Валидация при потере фокуса
    form.find('input, textarea').on('blur', function() {
        validateField($(this));
    });

    // 3c. Симуляция отправки формы через $.ajax() (Требование 2)

    form.on('submit', function(e) {
        e.preventDefault();
        let isFormValid = true;

        // Полная валидация перед отправкой
        form.find('input, textarea').each(function() {
            if (!validateField($(this))) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            formMessage.removeClass('success error').text('Отправка...');
            $('#submit-btn').prop('disabled', true);

            // Симуляция AJAX-запроса
            $.ajax({
                url: 'simulate_send.php', // Фактически не используется, только для симуляции
                method: 'POST',
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    // Симулируем успешный ответ через 1 секунду
                    setTimeout(function() {
                        formMessage.addClass('success').text('Сообщение успешно отправлено!');
                        form.trigger('reset'); // Очистка формы
                        $('#submit-btn').prop('disabled', false);

                        // Закрытие модального окна через 2 секунды
                        setTimeout(() => modal.fadeOut(300), 2000);

                    }, 1000);
                },
                error: function() {
                    // Симулируем ошибку
                    setTimeout(function() {
                        formMessage.addClass('error').text('Ошибка сервера. Попробуйте позже.');
                        $('#submit-btn').prop('disabled', false);
                    }, 1000);
                }
            });
        }
    });

    // ----------------------------------------------------
    // 4. КНОПКА "ВВЕРХ" (Плавный скролл)
    // ----------------------------------------------------
    const backToTopButton = $('#back-to-top');

    // Появление/скрытие кнопки
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            backToTopButton.fadeIn(200);
        } else {
            backToTopButton.fadeOut(200);
        }
    });

    // Плавный скролл (Требование 5)
    backToTopButton.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });

    // ----------------------------------------------------
    // 5. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ
    // ----------------------------------------------------
    const sections = $('section');
    const navLinks = $('.nav-link');

    $(window).on('scroll', function() {
        let currentScroll = $(window).scrollTop();

        sections.each(function() {
            const sectionTop = $(this).offset().top - 100; // Смещение для точности
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                navLinks.removeClass('active');
                // Ищем ссылку, соответствующую текущей секции
                $(`a[href="#${sectionId}"]`).addClass('active');
            }
        });

        // Если скролл в самом верху, подсвечиваем 'О СЕБЕ'
        if(currentScroll < $('#about').offset().top) {
            navLinks.removeClass('active');
            $('a[href="#about"]').addClass('active');
        }
    });

    // ----------------------------------------------------
    // 6. КАРОУСЕЛЬ (Слайдер в секции SKILLS)
    // ----------------------------------------------------
    const skillsList = $('#skills .skills-list');
    let skillIndex = 0;
    const skills = skillsList.find('div');
    const skillCount = skills.length;
    const intervalTime = 4000; // Автопрокрутка каждые 4 секунды

    // Обертываем навыки для создания слайдера
    skills.wrapAll('<div class="skills-slider"></div>');
    const sliderWrapper = $('.skills-slider');

    // Настраиваем CSS для слайдера (нужны стили в styles.css)
    skills.css({
        'flex': '0 0 100%',
        'margin-right': '0'
    });
    sliderWrapper.css({
        'display': 'flex',
        'overflow': 'hidden',
        'width': '100%'
    });

    // Создаем кнопки навигации
    skillsList.prepend('<button class="slider-btn prev-btn">←</button>');
    skillsList.append('<button class="slider-btn next-btn">→</button>');

    // Функция для перехода к слайду
    function goToSkill(index) {
        if (index >= skillCount) {
            skillIndex = 0;
        } else if (index < 0) {
            skillIndex = skillCount - 1;
        } else {
            skillIndex = index;
        }

        // Анимация сдвига (Требование 6)
        const offset = -skillIndex * skills.outerWidth(true);
        sliderWrapper.animate({ 'margin-left': offset }, 300);
    }

    // Автопрокрутка (Требование 6)
    let autoScroll = setInterval(() => goToSkill(skillIndex + 1), intervalTime);

    // Сброс таймера при взаимодействии
    function resetAutoScroll() {
        clearInterval(autoScroll);
        autoScroll = setInterval(() => goToSkill(skillIndex + 1), intervalTime);
    }

    // Обработчики кнопок
    $('.next-btn').on('click', function() {
        goToSkill(skillIndex + 1);
        resetAutoScroll();
    });

    $('.prev-btn').on('click', function() {
        goToSkill(skillIndex - 1);
        resetAutoScroll();
    });

});