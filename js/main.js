/* АэроСпас-ДВ — интерактив сайта */
(function () {
  'use strict';

  /* ---------- мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- появление блоков при прокрутке ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- активный пункт меню ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- обратный отсчёт до приёма заявок ---------- */
  var cd = document.getElementById('countdown');
  var cdValue = document.getElementById('countdownValue');

  if (cd && cdValue) {
    var deadline = new Date(cd.getAttribute('data-deadline')).getTime();

    var tick = function () {
      var diff = deadline - Date.now();

      if (diff <= 0) {
        cdValue.textContent = 'приём заявок завершён';
        return;
      }

      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      var plural = function (n, forms) {
        var n10 = n % 10, n100 = n % 100;
        if (n10 === 1 && n100 !== 11) return forms[0];
        if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
        return forms[2];
      };

      cdValue.textContent =
        d + ' ' + plural(d, ['день', 'дня', 'дней']) + ' ' +
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0');
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- форма обратной связи (демо-обработка) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll('[required]');
      var valid = true;

      fields.forEach(function (f) {
        var ok = f.value.trim() !== '' && (f.type !== 'email' || /.+@.+\..+/.test(f.value));
        f.style.borderColor = ok ? '' : '#ff5722';
        if (!ok) valid = false;
      });

      if (!valid) {
        note.textContent = 'Пожалуйста, заполните все поля корректно.';
        note.classList.remove('is-ok');
        return;
      }

      note.textContent = 'Спасибо! Сообщение отправлено — команда ответит в течение 1–2 дней.';
      note.classList.add('is-ok');
      form.reset();
    });
  }
})();
