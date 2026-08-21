/* =========================================================
Perfecto Group — анимации и интерактив
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Появление элементов при скролле ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // задержка из data-delay (для каскадного появления)
          const delay = el.dataset.delay || 0;
          el.style.setProperty('--delay', `${delay}ms`);

          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  }


  /* ---------- 2. Анимация счётчиков ---------- */
  const counters = document.querySelectorAll('.counter');

  if (counters.length) {
    const runCounter = (el) => {
      const target = Number(el.dataset.target) || 0;
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);

        // easeOutExpo — быстро в начале, плавно в конце
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.6
    });

    counters.forEach((counter) => counterObserver.observe(counter));
  }


  /* ---------- 3. Навбар при скролле ---------- */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ---------- 4. Мобильное меню ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burger.classList.toggle('active');
    });

    // закрываем меню после клика по ссылке
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
      });
    });
  }


  /* ---------- 5. Лёгкий параллакс за курсором ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;   // -1 .. 1
    }, { passive: true });

    const animateParallax = () => {
      // плавное приближение к цели (lerp)
      curX += (mouseX - curX) * 0.06;
      curY += (mouseY - curY) * 0.06;

      parallaxEls.forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) * 100;
        el.style.transform = `translate(${curX * depth}px, ${curY * depth}px)`;
      });

      requestAnimationFrame(animateParallax);
    };

    // параллакс только на десктопе
    animateParallax();
  }


/* ---------- 6. Переключатель языков (с редиректом) ---------- */
  const langBurger = document.getElementById('langBurger');
  const langMenu = document.getElementById('langMenu');

  if (langBurger && langMenu) {
    // 1. Открытие / закрытие выпадающего меню по клику на кнопку
    langBurger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langMenu.classList.toggle('open');
      langBurger.classList.toggle('active', isOpen);
      langBurger.setAttribute('aria-expanded', isOpen);
    });

    // 2. Закрытие меню при клике в любую точку за его пределами
    document.addEventListener('click', (e) => {
      const switcher = document.querySelector('.lang-switcher');
      if (switcher && !switcher.contains(e.target)) {
        langMenu.classList.remove('open');
        langBurger.classList.remove('active');
        langBurger.setAttribute('aria-expanded', 'false');
      }
    });

    // 3. Обработка клика по языку в меню
    const langItems = document.querySelectorAll('.lang-switcher__item');
    langItems.forEach((item) => {
      item.addEventListener('click', () => {
        const selectedLang = item.getAttribute('data-lang');

        if (selectedLang === 'he') {
          window.location.href = 'index.html';
        } else if (selectedLang === 'ru') {
          window.location.href = 'index-ru.html';
        } else if (selectedLang === 'en') {
          window.location.href = 'index-en.html';
        }
      });
    });
  }

  /* ---------- Галерея фото из GitHub ---------- */
  const galleryContainer = document.getElementById('telegramGallery');

  if (galleryContainer) {
    galleryContainer.innerHTML = ''; // Очищаем надпись "Загрузка..."

    const totalImages = 5; // Количество фото
    const baseUrl = 'https://kayoosh2009.github.io/Perfecto-Group-Israel/images/';

    for (let i = 1; i <= totalImages; i++) {
      // Преобразуем 1 -> '001', 2 -> '002' и т.д.
      const num = String(i).padStart(3, '0');
      const imgUrl = `${baseUrl}${num}.jpg`;

      const item = document.createElement('div');
      item.className = 'gallery__item img-placeholder reveal visible';
      item.innerHTML = `<img src="${imgUrl}" alt="Работа Perfecto Group №${num}" loading="lazy">`;

      galleryContainer.appendChild(item);
    }
  }
  
  /* ---------- 7. Текущий год в футере ---------- */
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});