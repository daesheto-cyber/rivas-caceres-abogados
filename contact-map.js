/* =========================================================================
   Contacto · Mapa interactivo — Google Maps embed dinámico
   --------------------------------------------------------------------------
   ►► PARA EDITAR LOS DATOS DE SEDE, SOLO TOCA EL OBJETO `locations` ◄◄

   FUTURA INTEGRACIÓN CON GOOGLE MAPS JS API
   ------------------------------------------
   1. Pon `provider: 'google'` y tu clave en `googleMapsApiKey`.
   2. El array `locations` alimenta ambos modos automáticamente.
   ========================================================================= */

window.RIVAS_MAP_CONFIG = {
  provider: 'embed',               // 'embed' | 'google'
  googleMapsApiKey: '',

  /* Embed sin API key — centrado en coordenadas exactas de la sede.
     t=m → mapa de calles   |   t=k → satélite/híbrido                    */
  gmapsEmbedBase: 'https://maps.google.com/maps?ie=UTF8&iwloc=&output=embed&hl=es',

  /* Enlace directo "Abrir en Google Maps" */
  gmapsDirectUrl: 'https://www.google.com/maps/place/Cl.+146+%237-64,+Bogot%C3%A1/@4.7419,-74.0330,17z',

  /* Encuadre inicial */
  defaultView: { lat: 4.7419, lng: -74.0330, zoom: 16 },

  locations: [
    {
      id: 'sede-bogota',
      name: 'Sede Principal',
      address: 'CL 146 # 7-64 OF 403\nBogotá, D.C. 110111\nColombia',
      city: 'Bogotá · Colombia',
      phone: '+57 (601) 000 0000',
      note: 'Cobertura nacional · los 32 departamentos de Colombia',
      lat: 4.7419,
      lng: -74.0330
    }
  ]
};

/* ====================  LÓGICA (no requiere edición)  =================== */
(function () {
  'use strict';

  var CFG = window.RIVAS_MAP_CONFIG || {};
  var LOC = (CFG.locations || [])[0] || {};

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
  }
  function buildEmbedUrl(type) {
    var base = CFG.gmapsEmbedBase || '';
    var dv   = CFG.defaultView || { lat: 4.7419, lng: -74.0330, zoom: 16 };
    var q    = dv.lat + ',' + dv.lng;
    return base + '&q=' + encodeURIComponent(q) +
           '&z=' + (dv.zoom || 16) +
           '&t=' + (type === 'satellite' ? 'k' : 'm');
  }

  /* ── embed map ───────────────────────────────────────────────────────── */
  function initEmbedMap(root) {
    var stage   = root.querySelector('.cmap__stage');
    var noteEl  = root.querySelector('.cmap__note');
    var countEl = root.querySelector('.cmap__count');
    var listEl  = root.querySelector('.cmap__list');
    if (!stage) return;

    var currentType = 'map';

    /* Limpia el stage y coloca iframe + controles flotantes */
    stage.innerHTML = '';
    stage.style.background = '#0f1f1f';

    /* Loading skeleton */
    var loader = el('div', 'cmap-loader',
      '<span class="cmap-loader__spin"></span>' +
      '<span class="cmap-loader__txt">Cargando mapa…</span>');
    stage.appendChild(loader);

    /* Iframe de Google Maps */
    var iframe = document.createElement('iframe');
    iframe.src = buildEmbedUrl(currentType);
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;opacity:0;transition:opacity .4s ease;';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('title', 'Mapa sede Rivas & Asociados — ' + (LOC.address || ''));
    iframe.addEventListener('load', function () {
      iframe.style.opacity = '1';
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    });
    stage.appendChild(iframe);

    /* Toggle mapa / satélite */
    var toggle = el('div', 'cmap-toggle');
    toggle.innerHTML =
      '<button type="button" class="cmap-toggle__btn is-active" data-t="map">Mapa</button>' +
      '<button type="button" class="cmap-toggle__btn" data-t="satellite">Satélite</button>';
    toggle.querySelectorAll('.cmap-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-t');
        if (t === currentType) return;
        currentType = t;
        toggle.querySelectorAll('.cmap-toggle__btn').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        /* muestra loader brevemente al cambiar */
        loader.style.opacity = '1';
        loader.style.pointerEvents = 'auto';
        iframe.style.opacity = '0';
        iframe.src = buildEmbedUrl(currentType);
      });
    });
    stage.appendChild(toggle);

    /* Badge "Live" */
    var badge = el('div', 'cmap__badge',
      '<span class="cmap__live"></span>Google Maps');
    stage.appendChild(badge);

    /* ── Directorio lateral ─────────────────────────────────────────── */
    if (countEl) {
      countEl.innerHTML = '<b>1</b> sede · <b>Bogotá, Colombia</b>';
    }

    if (listEl && LOC.name) {
      var card = el('div', 'cmap-card is-active');
      card.innerHTML =
        '<span class="cmap-card__marker">1</span>' +
        '<span class="cmap-card__body">' +
          '<span class="cmap-card__name">' + esc(LOC.name) + '</span>' +
          '<span class="cmap-card__city">' + esc(LOC.city) + '</span>' +
          (LOC.address
            ? '<span class="cmap-card__addr">' + esc(LOC.address) + '</span>'
            : '') +
          (LOC.note
            ? '<span class="cmap-card__note">' + esc(LOC.note) + '</span>'
            : '') +
          '<span class="cmap-card__status active">Ubicación activa</span>' +
        '</span>';
      listEl.appendChild(card);
    }

    /* ── Nota inferior con CTAs ─────────────────────────────────────── */
    if (noteEl) {
      var direct = CFG.gmapsDirectUrl || '#';
      noteEl.innerHTML =
        '<div class="cmap-actions">' +
          '<a href="' + direct + '" target="_blank" rel="noopener" class="cmap-actions__btn cmap-actions__btn--primary">' +
            '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/></svg>' +
            'Abrir en Google Maps' +
          '</a>' +
          '<a href="https://www.google.com/maps/dir/?api=1&destination=' +
            encodeURIComponent((CFG.defaultView ? CFG.defaultView.lat + ',' + CFG.defaultView.lng : '')) +
            '" target="_blank" rel="noopener" class="cmap-actions__btn">' +
            '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h9.59L8.3 11.3l1.4 1.4 5-5-5-5-1.4 1.4 3.3 3.3H2v2z" fill="currentColor"/></svg>' +
            'Cómo llegar' +
          '</a>' +
        '</div>';
    }
  }

  /* ── Google Maps JS API (activar con provider:'google' + apiKey) ───── */
  function initGoogleMaps(root) {
    var stage = root.querySelector('.cmap__stage');
    stage.innerHTML = '';
    window.__rivasGMapInit = function () {
      var dv = CFG.defaultView || { lat: 4.7419, lng: -74.0330, zoom: 16 };
      var map = new google.maps.Map(stage, {
        center: { lat: dv.lat, lng: dv.lng },
        zoom: dv.zoom,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR }
      });
      (CFG.locations || []).forEach(function (loc) {
        if (!loc.lat || !loc.lng) return;
        new google.maps.Marker({ position: { lat: loc.lat, lng: loc.lng }, map: map, title: loc.name });
      });
    };
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' +
            encodeURIComponent(CFG.googleMapsApiKey) + '&callback=__rivasGMapInit';
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  /* ── Bootstrap ──────────────────────────────────────────────────────── */
  function boot() {
    document.querySelectorAll('.cmap[data-cmap]').forEach(function (root) {
      if (root.__cmapInit) return;
      root.__cmapInit = true;
      if (CFG.provider === 'google' && CFG.googleMapsApiKey) {
        initGoogleMaps(root);
      } else {
        initEmbedMap(root);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
