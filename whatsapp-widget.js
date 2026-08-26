(function () {
  'use strict';

  /* ── Configuración ─────────────────────────────────────────────── */
  var CONFIG = {
    phone:          '573004830722',
    businessName:   'Rivas Cáceres Abogados',
    avatarInitials: 'RC',
    welcomeMessage: '¡Hola! 👋 ¿En qué podemos ayudarte hoy? Cuéntanos tu caso y con gusto te orientamos.',
    inputPlaceholder: 'Escribe tu consulta...',
    statusText:     'Normalmente responde en minutos',
    typingDelay:    900
  };

  var SESSION_KEY = 'waw-seen';
  var isOpen      = false;
  var typingTimer = null;

  /* ── Utilidades ────────────────────────────────────────────────── */
  function buildLink(message) {
    var cleaned = CONFIG.phone.replace(/\D/g, '');
    var trimmed = (message || '').trim();
    return trimmed
      ? 'https://wa.me/' + cleaned + '?text=' + encodeURIComponent(trimmed)
      : 'https://wa.me/' + cleaned;
  }

  var SVG_WA = [
    '<svg class="waw-icon-wa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">',
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15',
    '-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475',
    '-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52',
    '.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207',
    '-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372',
    '-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2',
    ' 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118',
    '.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
    '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.855L.057 23.882a.5.5 0',
    ' 00.606.63l6.102-1.598A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z',
    'm0 21.9a9.876 9.876 0 01-5.031-1.378l-.36-.214-3.733.979.996-3.638-.235-.374A9.861',
    ' 9.861 0 012.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9',
    ' 0 5.467-4.433 9.9-9.9 9.9z"/>',
    '</svg>'
  ].join('');

  var SVG_X = [
    '<svg class="waw-icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="2.5" stroke-linecap="round" aria-hidden="true">',
    '<path d="M6 6l12 12M18 6L6 18"/></svg>'
  ].join('');

  var SVG_SEND = [
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">',
    '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'
  ].join('');

  var SVG_CLOSE = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="2.5" stroke-linecap="round" aria-hidden="true">',
    '<path d="M6 6l12 12M18 6L6 18"/></svg>'
  ].join('');

  /* ── HTML del widget ───────────────────────────────────────────── */
  function render() {
    var root = document.getElementById('wa-widget');
    if (!root) return;

    root.innerHTML =
      '<div class="waw-backdrop" id="waw-backdrop" aria-hidden="true"></div>' +

      '<div class="waw-card" id="waw-card" role="dialog" aria-modal="true"' +
      '     aria-label="Chat con ' + CONFIG.businessName + '" aria-hidden="true">' +

      '  <div class="waw-header">' +
      '    <div class="waw-avatar" aria-hidden="true">' +
      '      <span class="waw-initials">' + CONFIG.avatarInitials + '</span>' +
      '      <span class="waw-online-dot"></span>' +
      '    </div>' +
      '    <div class="waw-meta">' +
      '      <strong class="waw-name">' + CONFIG.businessName + '</strong>' +
      '      <span class="waw-status">' + CONFIG.statusText + '</span>' +
      '    </div>' +
      '    <button class="waw-close-btn" aria-label="Cerrar chat">' + SVG_CLOSE + '</button>' +
      '  </div>' +

      '  <div class="waw-messages" aria-live="polite" aria-label="Mensajes">' +
      '    <div class="waw-typing" id="waw-typing" role="status" aria-label="Escribiendo">' +
      '      <span class="waw-dot" aria-hidden="true"></span>' +
      '      <span class="waw-dot" aria-hidden="true"></span>' +
      '      <span class="waw-dot" aria-hidden="true"></span>' +
      '    </div>' +
      '    <div class="waw-bubble" id="waw-welcome">' + CONFIG.welcomeMessage + '</div>' +
      '  </div>' +

      '  <div class="waw-footer">' +
      '    <textarea class="waw-textarea" id="waw-textarea" rows="1"' +
      '      aria-label="Tu mensaje" placeholder="' + CONFIG.inputPlaceholder + '"></textarea>' +
      '    <button class="waw-send-btn" aria-label="Enviar mensaje por WhatsApp">' + SVG_SEND + '</button>' +
      '  </div>' +
      '</div>' +

      '<button class="waw-trigger" id="waw-trigger"' +
      '  aria-label="Abrir chat de WhatsApp"' +
      '  aria-expanded="false"' +
      '  aria-controls="waw-card">' +
      SVG_WA + SVG_X +
      '  <span class="waw-badge" id="waw-badge" hidden aria-hidden="true"></span>' +
      '</button>';
  }

  /* ── Estado ────────────────────────────────────────────────────── */
  function openChat() {
    isOpen = true;
    var card     = document.getElementById('waw-card');
    var trigger  = document.getElementById('waw-trigger');
    var backdrop = document.getElementById('waw-backdrop');
    var typing   = document.getElementById('waw-typing');
    var welcome  = document.getElementById('waw-welcome');
    var badge    = document.getElementById('waw-badge');

    card.removeAttribute('inert');
    card.setAttribute('aria-hidden', 'false');
    card.classList.add('waw-open');
    backdrop.classList.add('waw-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Cerrar chat de WhatsApp');
    trigger.classList.add('waw-active');

    if (badge) badge.hidden = true;
    sessionStorage.setItem(SESSION_KEY, '1');

    /* Reiniciar animación de mensajes */
    typing.classList.remove('waw-visible');
    welcome.classList.remove('waw-visible');

    clearTimeout(typingTimer);
    setTimeout(function () { typing.classList.add('waw-visible'); }, 60);

    typingTimer = setTimeout(function () {
      typing.classList.remove('waw-visible');
      welcome.classList.add('waw-visible');
      var ta = document.getElementById('waw-textarea');
      if (ta) ta.focus();
    }, CONFIG.typingDelay);

    document.addEventListener('keydown', handleKeyDown);
  }

  function closeChat() {
    isOpen = false;
    var card     = document.getElementById('waw-card');
    var trigger  = document.getElementById('waw-trigger');
    var backdrop = document.getElementById('waw-backdrop');

    card.setAttribute('inert', '');
    card.setAttribute('aria-hidden', 'true');
    card.classList.remove('waw-open');
    backdrop.classList.remove('waw-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Abrir chat de WhatsApp');
    trigger.classList.remove('waw-active');

    clearTimeout(typingTimer);
    document.removeEventListener('keydown', handleKeyDown);
    trigger.focus();
  }

  /* ── Focus trap + Escape ───────────────────────────────────────── */
  function handleKeyDown(e) {
    if (e.key === 'Escape') { closeChat(); return; }
    if (e.key !== 'Tab') return;

    var card = document.getElementById('waw-card');
    var focusable = Array.prototype.slice.call(
      card.querySelectorAll('button:not([disabled]), textarea:not([disabled])')
    );
    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ── Init ──────────────────────────────────────────────────────── */
  function init() {
    render();

    var card     = document.getElementById('waw-card');
    var trigger  = document.getElementById('waw-trigger');
    var backdrop = document.getElementById('waw-backdrop');
    var closeBtn = card.querySelector('.waw-close-btn');
    var sendBtn  = card.querySelector('.waw-send-btn');
    var textarea = document.getElementById('waw-textarea');
    var badge    = document.getElementById('waw-badge');

    card.setAttribute('inert', '');

    if (!sessionStorage.getItem(SESSION_KEY)) badge.hidden = false;

    trigger.addEventListener('click', function () {
      if (isOpen) closeChat(); else openChat();
    });

    closeBtn.addEventListener('click', closeChat);
    backdrop.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', function () {
      var url = buildLink(textarea.value);
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 96) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
