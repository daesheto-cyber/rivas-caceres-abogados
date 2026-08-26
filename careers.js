/* =========================================================================
   Trabaja con Nosotros · Modal de candidatura
   Abre/cierra el modal, gestiona el adjunto PDF (validación + drag&drop)
   y simula el envío. No depende de ningún servicio externo.
   ========================================================================= */
(function () {
  'use strict';

  var modal = document.getElementById('careers');
  if (!modal) return;

  var dialog = modal.querySelector('.careers__dialog');
  var form = modal.querySelector('.careers__form');
  var drop = modal.querySelector('.cdrop');
  var fileInput = modal.querySelector('#cv-file');
  var nameEl = modal.querySelector('.cdrop__name');
  var sizeEl = modal.querySelector('.cdrop__size');
  var errEl = modal.querySelector('.cdrop__error');
  var lastFocus = null;
  var MAX_MB = 10;

  /* ---------- abrir / cerrar ---------- */
  function open() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.classList.remove('is-sent');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // foco al primer campo tras la transición
    setTimeout(function () {
      var first = form && form.querySelector('input, select');
      if (first) first.focus();
    }, 60);
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Disparadores de apertura (cualquier elemento con [data-careers-open])
  document.querySelectorAll('[data-careers-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  // Cierre (backdrop, botón X, cualquier [data-careers-close])
  modal.querySelectorAll('[data-careers-close]').forEach(function (b) {
    b.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  /* ---------- adjunto PDF ---------- */
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
  function setFile(file) {
    errEl.textContent = '';
    if (!file) return;
    var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      errEl.textContent = 'El archivo debe estar en formato PDF.';
      clearFile();
      return;
    }
    if (file.size > MAX_MB * 1048576) {
      errEl.textContent = 'El archivo supera el máximo de ' + MAX_MB + ' MB.';
      clearFile();
      return;
    }
    nameEl.textContent = file.name;
    sizeEl.textContent = fmtSize(file.size) + ' · PDF';
    drop.classList.add('has-file');
  }
  function clearFile() {
    if (fileInput) fileInput.value = '';
    drop.classList.remove('has-file');
    nameEl.textContent = '';
    sizeEl.textContent = '';
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      setFile(fileInput.files && fileInput.files[0]);
    });
  }
  // botón quitar
  var removeBtn = modal.querySelector('.cdrop__remove');
  if (removeBtn) removeBtn.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation(); clearFile();
  });

  // drag & drop sobre la zona
  if (drop) {
    ['dragenter', 'dragover'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-drag'); });
    });
    ['dragleave', 'dragend', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-drag'); });
    });
    drop.addEventListener('drop', function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && fileInput) {
        try { fileInput.files = e.dataTransfer.files; } catch (err) {}
        setFile(f);
      }
    });
  }

  /* ---------- envío real vía webhook (Make.com) ---------- */
  var WEBHOOK_URL = 'https://hook.us2.make.com/akj9apjxvimbkfx3iw2i97igeazajt4o';
  var submitBtn = form ? form.querySelector('[type="submit"]') : null;

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var fd = new FormData(form);
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Enviando…'; }
    errEl.textContent = '';

    fetch(WEBHOOK_URL, { method: 'POST', body: fd })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        modal.classList.add('is-sent');
      })
      .catch(function () {
        errEl.textContent = 'No se pudo enviar la candidatura. Intenta de nuevo.';
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label; }
      });
  });

  // Reabrir limpio tras enviar
  var againBtn = modal.querySelector('[data-careers-reset]');
  if (againBtn) againBtn.addEventListener('click', function () {
    form.reset(); clearFile(); errEl.textContent = '';
    modal.classList.remove('is-sent');
  });
})();
