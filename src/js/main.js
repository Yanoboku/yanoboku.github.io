/**
 * Main JavaScript file
 * Includes: Burger menu, Benefits slider, Form validation
 */

// ===== Burger Menu =====
const initBurgerMenu = () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    burger.setAttribute('aria-expanded', !isExpanded);
    burger.setAttribute('aria-label', isExpanded ? 'Открыть меню' : 'Закрыть меню');
  });

  // Закрытие меню при клике на ссылку
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
};

// ===== Benefits Slider =====
const initBenefitsSlider = () => {
  const track = document.getElementById('benefitsTrack');
  const prevBtn = document.getElementById('benefitsPrev');
  const nextBtn = document.getElementById('benefitsNext');
  
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.benefit-card');
  if (cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  const totalCards = cards.length;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalCards - cardsPerView);
  }

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // 1.5rem = 24px
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    
    // Обновление состояния кнопок
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  // Обновление при ресайзе
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      currentIndex = Math.min(currentIndex, getMaxIndex());
      updateSlider();
    }
  });

  // Инициализация
  updateSlider();
};

// ===== Contact Form Validation =====
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    firstName: {
      element: form.querySelector('#firstName'),
      errorElement: form.querySelector('#firstNameError'),
      validate: (value) => value.trim() !== '',
      errorMessage: 'Введите имя'
    },
    lastName: {
      element: form.querySelector('#lastName'),
      errorElement: form.querySelector('#lastNameError'),
      validate: (value) => value.trim() !== '',
      errorMessage: 'Введите фамилию'
    },
    email: {
      element: form.querySelector('#email'),
      errorElement: form.querySelector('#emailError'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: 'Введите корректный email'
    },
    message: {
      element: form.querySelector('#message'),
      errorElement: form.querySelector('#messageError'),
      validate: (value) => value.trim() !== '',
      errorMessage: 'Введите сообщение'
    }
  };

  const successElement = form.querySelector('#formSuccess');

  function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.element.value;
    const isValid = field.validate(value);

    if (isValid) {
      field.element.classList.remove('error');
      field.errorElement.textContent = '';
    } else {
      field.element.classList.add('error');
      field.errorElement.textContent = field.errorMessage;
    }

    return isValid;
  }

  // Валидация при потере фокуса
  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].element.addEventListener('blur', () => {
      validateField(fieldName);
    });
  });

  // Обработка отправки формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Валидация всех полей
    let isFormValid = true;
    Object.keys(fields).forEach(fieldName => {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) isFormValid = false;
    });

    if (!isFormValid) return;

    // Сбор данных формы
    const formData = {
      firstName: fields.firstName.element.value,
      lastName: fields.lastName.element.value,
      email: fields.email.element.value,
      message: fields.message.element.value
    };

    try {
      // Имитация отправки на сервер
      // Замените на реальный API endpoint
      await submitForm(formData);

      // Успешная отправка
      successElement.hidden = false;
      form.reset();

      // Скрыть сообщение через 5 секунд
      setTimeout(() => {
        successElement.hidden = true;
      }, 5000);

    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      // Здесь можно показать сообщение об ошибке
    }
  });
};

/**
 * Mock функция для отправки формы
 * Замените на реальный API вызов
 */
async function submitForm(data) {
  // Имитация задержки сети
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form submitted:', data);
      resolve({ success: true });
    }, 500);
  });

  // Пример реального API вызова:
  // const response = await fetch('/api/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // if (!response.ok) throw new Error('Failed to submit form');
  // return response.json();
}

// ===== Smooth Scroll for Anchor Links =====
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80; // Высота шапки
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initBenefitsSlider();
  initContactForm();
  initSmoothScroll();
});
