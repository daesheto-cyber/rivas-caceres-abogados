/* Rivas Cáceres Abogados — interacciones */
(function () {
  'use strict';

  /* ---- Nav scroll state ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  function toggleMenu(force) {
    var open = force !== undefined ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  menu && menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- Count-up stats ---- */
  function animateCount(el, delay) {
    delay = delay || 0;
    var target = parseFloat(el.dataset.count);
    var dec = (el.dataset.count.indexOf('.') > -1) ? 1 : 0;
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var val = target * eased;
      el.textContent = (dec ? val.toFixed(1) : Math.round(val)).toLocaleString('es-ES');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (dec ? target.toFixed(1) : Math.round(target)).toLocaleString('es-ES');
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay);
  }

  /* Contadores en Hero: se activan al cargar, con retardo escalonado */
  var heroCounters = document.querySelectorAll('.hero__meta [data-count]');
  heroCounters.forEach(function (el, i) {
    animateCount(el, 600 + i * 150);
  });

  /* Contadores fuera del Hero: se activan al entrar en viewport */
  var counted = new Set();
  heroCounters.forEach(function (el) { counted.add(el); });
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animateCount(e.target, 0);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    if (!counted.has(el)) countIO.observe(el);
  });

  /* ---- Active link: scroll-spy robusto + click inmediato ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  // Empareja cada enlace con su sección destino (solo anclas internas existentes)
  var targets = navLinks
    .map(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return null;
      var sec = document.getElementById(href.slice(1));
      return sec ? { link: link, sec: sec } : null;
    })
    .filter(Boolean);

  function setActive(link) {
    navLinks.forEach(function (l) { l.classList.toggle('active', l === link); });
  }

  var clickLock = 0;
  function updateActive() {
    if (!targets.length) return;
    // Ordena por posición real en la página (el orden del menú no siempre coincide)
    var ordered = targets.slice().sort(function (a, b) { return a.sec.offsetTop - b.sec.offsetTop; });
    // Línea de referencia cerca de la parte superior (bajo la barra de navegación)
    var line = window.scrollY + window.innerHeight * 0.30;
    var current = ordered[0];
    ordered.forEach(function (t) {
      if (t.sec.offsetTop <= line) current = t;
    });
    // Al final de la página, fuerza la última sección
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = ordered[ordered.length - 1];
    }
    setActive(current.link);
  }

  // Clic: marca de inmediato el enlace pulsado y evita que el scroll lo pise durante el desplazamiento
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setActive(link);
      clickLock = Date.now() + 700;
    });
  });

  window.addEventListener('scroll', function () {
    if (Date.now() < clickLock) return;
    updateActive();
  }, { passive: true });
  window.addEventListener('resize', updateActive, { passive: true });
  updateActive();

  /* ---- Form (demo) ---- */
  var form = document.querySelector('.form');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.innerHTML = 'Solicitud enviada ✓';
    btn.disabled = true;
    setTimeout(function () { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2600);
  });

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Hero: carrusel automático de imágenes (fade + Ken Burns) ---- */
  (function heroSlideshow() {
    var stage = document.getElementById('hero-slides');
    if (!stage) return;

    // Todas las imágenes hero- disponibles en /assets, ordenadas para alternar
    // arquitectura y personas, liderando con las de mayor resolución.
    // (En el export standalone se sirven desde window.__resources con fallback.)
    var R = window.__resources || {};
    var sources = [
      R.heroGlassTowers   || 'assets/hero-glass-towers.png',
      R.heroJusticia      || 'assets/hero-justicia.png',
      R.heroLibrary       || 'assets/hero-library.png',
      R.heroCitySunset    || 'assets/hero-city-sunset.png',
      R.heroScalesGavel   || 'assets/hero-scales-gavel.png',
      R.heroCourthouse    || 'assets/hero-courthouse.png',
      R.heroCityNight     || 'assets/hero-city-night.png',
      R.heroConsultation  || 'assets/hero-consultation.png',
      R.heroTwinTowers    || 'assets/hero-twin-towers.png',
      R.heroWorkMeeting   || 'assets/hero-work-meeting.png',
      R.heroPenPaper      || 'assets/hero-pen-paper.png',
      R.heroWhiteBuilding || 'assets/hero-white-building.png',
      R.heroLawyerSuit    || 'assets/hero-lawyer-suit.png',
      R.heroWomanLawyer   || 'assets/hero-woman-lawyer.png',
      R.heroProfessionals || 'assets/hero-professionals.png'
    ];

    var INTERVAL = 3000; // cambia cada 3 s
    var slides = sources.map(function (src, i) {
      var img = document.createElement('img');
      img.className = 'hero__slide';
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      img.loading = i === 0 ? 'eager' : 'lazy';
      if (i === 0) img.classList.add('is-active');
      stage.appendChild(img);
      return img;
    });

    if (slides.length < 2) return;

    var idx = 0;
    function next() {
      var prev = slides[idx];
      idx = (idx + 1) % slides.length;
      var cur = slides[idx];
      // Reinicia la animación Ken Burns en la nueva imagen
      cur.classList.remove('is-active');
      void cur.offsetWidth; // reflow para reiniciar la animación
      cur.classList.add('is-active');
      prev.classList.remove('is-active');
    }

    var timer = setInterval(next, INTERVAL);

    // Pausa el ciclo cuando la pestaña no está visible (ahorra recursos)
    document.addEventListener('visibilitychange', function () {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(next, INTERVAL);
    });
  })();

  /* ---- Prefijo +57 en campo teléfono del formulario de contacto ---- */
  (function () {
    var tel = document.getElementById('f-tel');
    if (!tel) return;
    var PREFIX = '+57 ';
    function enforce() {
      if (!tel.value.startsWith(PREFIX)) {
        tel.value = PREFIX + tel.value.replace(/^\+\d+\s?/, '');
      }
    }
    tel.addEventListener('input', enforce);
    tel.addEventListener('keydown', function (e) {
      var pos = tel.selectionStart;
      if ((e.key === 'Backspace' || e.key === 'Delete') && pos <= PREFIX.length) {
        e.preventDefault();
      }
    });
    tel.addEventListener('focus', function () {
      if (tel.value === PREFIX) {
        // Coloca el cursor al final del prefijo
        setTimeout(function () { tel.setSelectionRange(PREFIX.length, PREFIX.length); }, 0);
      }
    });
  })();

  /* ---- Formulario de contacto → Webhook Make.com ---- */
  (function () {
    var WEBHOOK = 'https://hook.us2.make.com/5kk4ygczna1tmo26pi7c2hzbkztkimha';
    var form = document.querySelector('.form[novalidate]');
    if (!form) return;

    var btn = form.querySelector('button[type="submit"]');
    var successBox = form.parentElement.querySelector('.form__success');

    // Crear caja de éxito si no existe
    if (!successBox) {
      successBox = document.createElement('div');
      successBox.className = 'form__success';
      successBox.style.cssText = 'display:none;padding:32px 24px;text-align:center;';
      successBox.innerHTML = '<svg style="width:48px;height:48px;stroke:var(--gold-soft);fill:none;stroke-width:1.6;margin-bottom:16px" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg><h3 style="font-family:var(--serif);font-size:1.4rem;margin-bottom:8px">Mensaje enviado</h3><p style="color:var(--on-navy-mut);font-size:.9rem">Gracias por contactarnos. Un socio revisará su caso y le responderá en un máximo de 24 horas hábiles.</p>';
      form.parentElement.appendChild(successBox);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica
      if (!form.checkValidity()) {
        form.querySelectorAll(':invalid').forEach(function (el) {
          el.classList.add('field--error');
        });
        return;
      }

      // Recoger datos del formulario como campos separados
      var data = {
        nombre:   form.querySelector('[name="nombre"]').value.trim(),
        telefono: form.querySelector('[name="telefono"]').value.trim(),
        email:    form.querySelector('[name="email"]').value.trim(),
        area:     form.querySelector('[name="area"]').value,
        mensaje:  form.querySelector('[name="mensaje"]').value.trim(),
        fecha:    new Date().toISOString()
      };

      // Estado de carga en el botón
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      // URLSearchParams envía cada campo por separado (sin preflight CORS)
      fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
        mode: 'no-cors'
      })
      .then(function () {
        // Con no-cors la respuesta es opaca (no se puede leer),
        // pero si llegamos aquí el navegador envió la solicitud correctamente.
        form.style.display = 'none';
        successBox.style.display = 'block';
      })
      .catch(function () {
        btn.disabled = false;
        btn.innerHTML = 'Agendar Consulta <span class="arr">→</span>';
        var errMsg = form.querySelector('.form__error-msg');
        if (!errMsg) {
          errMsg = document.createElement('p');
          errMsg.className = 'form__error-msg';
          errMsg.style.cssText = 'color:#e05c5c;font-size:.82rem;margin-top:10px;text-align:center';
          form.querySelector('.form__submit').appendChild(errMsg);
        }
        errMsg.textContent = 'Hubo un problema al enviar. Por favor inténtelo de nuevo o contáctenos directamente.';
      });
    });

    // Limpiar clase de error al escribir
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('field--error'); });
    });
  })();
})();
