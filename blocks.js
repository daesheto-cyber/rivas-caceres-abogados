/* =========================================================================
   Editor de Secciones — arquitectura modular en runtime
   --------------------------------------------------------------------------
   Cada hijo directo de <main> con [data-block] es un bloque independiente.
   Este script permite, sin tocar el menú principal ni el resto de la página:
     · Reordenar      (arrastrar en el panel · flechas ↑ ↓)
     · Duplicar       (clona el bloque, contenido incluido)
     · Ocultar        (lo quita de la vista pública, lo conserva editable)
     · Eliminar       (lo retira; los originales se pueden volver a añadir)
     · Añadir          (inserta una sección desde la biblioteca de plantillas)
   El estado se guarda en localStorage. La edición de textos/imágenes nativa
   sigue funcionando con normalidad sobre los bloques originales.
   ========================================================================= */
(function () {
  'use strict';
  if (window.__rivasBlocks) return;
  window.__rivasBlocks = true;

  var LS = 'rivas-blocks-v1';
  var main = document.querySelector('main');
  if (!main) return;

  var ICON = {
    grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
    dup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeoff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6 0 10 8 10 8a18 18 0 0 1-2.3 3.3M6.6 6.6A18 18 0 0 0 2 12s4 8 10 8a10.8 10.8 0 0 0 5.4-1.4M3 3l18 18"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  };

  /* ---- helpers ---- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function blockEls() {
    return Array.prototype.filter.call(main.children, function (n) {
      return n.nodeType === 1 && n.hasAttribute('data-block');
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Activa un bloque recién insertado: revela y finaliza contadores */
  function activate(node) {
    var revs = node.matches && node.matches('.reveal') ? [node] : [];
    revs = revs.concat(Array.prototype.slice.call(node.querySelectorAll('.reveal')));
    revs.forEach(function (r) { r.classList.add('in'); });
    node.querySelectorAll('[data-count]').forEach(function (c) {
      var t = parseFloat(c.dataset.count);
      var dec = c.dataset.count.indexOf('.') > -1 ? 1 : 0;
      c.textContent = (dec ? t.toFixed(1) : Math.round(t)).toLocaleString('es-ES');
    });
  }

  /* Hace únicos los ids internos de un clon (anclas, slots, campos de form) */
  var saltSeq = 0;
  function uniquify(node, salt) {
    node.removeAttribute('id'); // el ancla de sección no debe duplicarse
    var withId = node.querySelectorAll('[id]');
    var remap = {};
    withId.forEach(function (n) {
      var old = n.getAttribute('id');
      var nw = old + '-' + salt;
      remap[old] = nw;
      n.setAttribute('id', nw);
    });
    node.querySelectorAll('label[for]').forEach(function (l) {
      var f = l.getAttribute('for');
      if (remap[f]) l.setAttribute('for', remap[f]);
    });
  }

  /* Quita el chrome del editor de un nodo (para clonar/serializar limpio) */
  function stripChrome(node) {
    node.querySelectorAll('[data-block-chrome]').forEach(function (c) { c.remove(); });
  }

  /* =======================================================================
     1 · Inventario de originales + plantillas pristinas
     ===================================================================== */
  var templates = {};   // type -> { name, html }
  var typeOrder = [];   // orden de aparición de los tipos (para el menú)
  blockEls().forEach(function (b) {
    var type = b.getAttribute('data-block');
    if (!b.getAttribute('data-block-id')) b.setAttribute('data-block-id', type);
    if (!templates[type]) {
      templates[type] = { name: b.getAttribute('data-block-name') || type, html: b.outerHTML };
      typeOrder.push(type);
    }
  });

  /* =======================================================================
     2 · Estado persistente
     ===================================================================== */
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
  }
  var removedSet = {};

  function makeInstance(type, salt) {
    var t = templates[type];
    if (!t) return null;
    var wrap = el('div', null, t.html.trim());
    var node = wrap.firstElementChild;
    stripChrome(node);
    uniquify(node, salt != null ? salt : ('s' + (++saltSeq)));
    node.setAttribute('data-block-clone', '1');
    node.setAttribute('data-block-id', type + '__' + (salt != null ? salt : saltSeq));
    return node;
  }

  function applyState() {
    var st = loadState();
    removedSet = st.removed || {};

    // 2a · retirar originales eliminados (la plantilla ya quedó guardada)
    Object.keys(removedSet).forEach(function (id) {
      var node = main.querySelector('[data-block-id="' + cssEsc(id) + '"]');
      if (node && node.getAttribute('data-block-clone') !== '1') node.remove();
    });

    // 2b · recrear clones / secciones añadidas
    if (st.clones) {
      Object.keys(st.clones).forEach(function (id) {
        var c = st.clones[id];
        var wrap = el('div', null, (c.html || '').trim());
        var node = wrap.firstElementChild;
        if (!node) return;
        stripChrome(node);
        node.setAttribute('data-block-id', id);
        node.setAttribute('data-block-clone', '1');
        if (c.hidden) node.setAttribute('data-block-hidden', '1');
        main.appendChild(node);
        activate(node);
        var m = id.match(/__(\w+)$/);
        if (m) saltSeq = Math.max(saltSeq, 1);
      });
    }

    // 2c · reordenar según el orden guardado
    if (st.order && st.order.length) {
      var map = {};
      blockEls().forEach(function (b) { map[b.getAttribute('data-block-id')] = b; });
      st.order.forEach(function (id) { if (map[id]) { main.appendChild(map[id]); delete map[id]; } });
      // Secciones nuevas no incluidas en el orden guardado → insertar en su posición natural
      Object.keys(map).forEach(function (id) {
        var node = map[id];
        var type = node.getAttribute('data-block');
        var ni = typeOrder.indexOf(type);
        var inserted = false;
        for (var i = ni + 1; i < typeOrder.length; i++) {
          var next = main.querySelector('[data-block="' + typeOrder[i] + '"]');
          if (next) { main.insertBefore(node, next); inserted = true; break; }
        }
        if (!inserted) main.appendChild(node);
      });
    }

    // 2d · aplicar ocultos
    var hidden = st.hidden || {};
    blockEls().forEach(function (b) {
      if (hidden[b.getAttribute('data-block-id')]) b.setAttribute('data-block-hidden', '1');
    });
  }

  function cssEsc(s) { return String(s).replace(/(["\\])/g, '\\$1'); }

  function persist() {
    var st = { order: [], hidden: {}, removed: removedSet, clones: {} };
    blockEls().forEach(function (b) {
      var id = b.getAttribute('data-block-id');
      st.order.push(id);
      if (b.getAttribute('data-block-hidden') === '1') st.hidden[id] = true;
      if (b.getAttribute('data-block-clone') === '1') {
        var clean = b.cloneNode(true);
        stripChrome(clean);
        clean.removeAttribute('data-block-hidden');
        st.clones[id] = {
          type: b.getAttribute('data-block'),
          name: b.getAttribute('data-block-name'),
          hidden: b.getAttribute('data-block-hidden') === '1',
          html: clean.outerHTML
        };
      }
    });
    try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {}
  }

  /* =======================================================================
     3 · Operaciones
     ===================================================================== */
  function move(node, dir) {
    if (dir < 0 && node.previousElementSibling && node.previousElementSibling.hasAttribute('data-block')) {
      main.insertBefore(node, node.previousElementSibling);
    } else if (dir > 0 && node.nextElementSibling && node.nextElementSibling.hasAttribute('data-block')) {
      main.insertBefore(node.nextElementSibling, node);
    }
    renderAll(); persist();
  }
  function duplicate(node) {
    var clone = node.cloneNode(true);
    stripChrome(clone);
    clone.removeAttribute('data-block-hidden');
    uniquify(clone, 's' + (++saltSeq));
    clone.setAttribute('data-block-clone', '1');
    clone.setAttribute('data-block-id', node.getAttribute('data-block') + '__' + saltSeq);
    node.after(clone);
    activate(clone);
    renderAll(); persist();
  }
  function toggleHidden(node) {
    if (node.getAttribute('data-block-hidden') === '1') node.removeAttribute('data-block-hidden');
    else node.setAttribute('data-block-hidden', '1');
    renderAll(); persist();
  }
  function remove(node) {
    var name = node.getAttribute('data-block-name') || 'esta sección';
    if (!window.confirm('¿Eliminar “' + name + '”? Podrás volver a añadirla desde la biblioteca.')) return;
    if (node.getAttribute('data-block-clone') !== '1') removedSet[node.getAttribute('data-block-id')] = true;
    node.remove();
    renderAll(); persist();
  }
  function addType(type, before) {
    var node = makeInstance(type);
    if (!node) return;
    // si era un original eliminado, lo "resucitamos" en vez de marcarlo clon
    if (removedSet[type]) {
      delete removedSet[type];
      node.removeAttribute('data-block-clone');
      node.setAttribute('data-block-id', type);
      node.setAttribute('id', '');
      node.removeAttribute('id');
    }
    if (before && before.parentNode === main) main.insertBefore(node, before);
    else main.appendChild(node);
    activate(node);
    renderAll(); persist();
    closeAddMenu();
  }

  /* =======================================================================
     4 · Chrome por bloque (etiqueta + herramientas + puntos de inserción)
     ===================================================================== */
  function renderAll() {
    // limpia chrome anterior
    main.querySelectorAll('[data-block-chrome]').forEach(function (c) { c.remove(); });

    var blocks = blockEls();
    blocks.forEach(function (b, i) {
      var name = b.getAttribute('data-block-name') || b.getAttribute('data-block');
      var isClone = b.getAttribute('data-block-clone') === '1';
      var isHidden = b.getAttribute('data-block-hidden') === '1';

      var tag = el('div', 'block-tag');
      tag.setAttribute('data-block-chrome', '1');
      tag.setAttribute('contenteditable', 'false');
      if (isClone) tag.setAttribute('data-clone', '1');
      tag.innerHTML = '<span class="block-tag__i">' + pad(i + 1) + '</span>' + name;

      var tools = el('div', 'block-tools');
      tools.setAttribute('data-block-chrome', '1');
      tools.setAttribute('contenteditable', 'false');
      tools.appendChild(toolBtn(ICON.up, 'Subir', function () { move(b, -1); }, i === 0));
      tools.appendChild(toolBtn(ICON.down, 'Bajar', function () { move(b, 1); }, i === blocks.length - 1));
      tools.appendChild(sep());
      tools.appendChild(toolBtn(ICON.dup, 'Duplicar', function () { duplicate(b); }));
      tools.appendChild(toolBtn(isHidden ? ICON.eyeoff : ICON.eye, isHidden ? 'Mostrar' : 'Ocultar', function () { toggleHidden(b); }));
      tools.appendChild(sep());
      var del = toolBtn(ICON.trash, 'Eliminar', function () { remove(b); });
      del.classList.add('is-danger');
      tools.appendChild(del);

      b.insertBefore(tools, b.firstChild);
      b.insertBefore(tag, b.firstChild);
    });

    renderInserts(blocks);
    renderPanel(blocks);
  }

  function toolBtn(icon, label, fn, disabled) {
    var b = el('button', null, icon);
    b.type = 'button';
    b.title = label;
    b.setAttribute('aria-label', label);
    if (disabled) b.disabled = true;
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(); });
    return b;
  }
  function sep() { var s = el('span', 'sep'); return s; }

  function renderInserts(blocks) {
    function mkInsert(before) {
      var ins = el('div', 'block-insert');
      ins.setAttribute('data-block-chrome', '1');
      ins.setAttribute('contenteditable', 'false');
      var b = el('button', null, ICON.plus + ' Añadir sección aquí');
      b.type = 'button';
      b.addEventListener('click', function (e) { e.preventDefault(); openAddMenu(before); });
      ins.appendChild(b);
      return ins;
    }
    if (blocks[0]) main.insertBefore(mkInsert(blocks[0]), blocks[0]);
    blocks.forEach(function (b) { main.insertBefore(mkInsert(b.nextElementSibling), b.nextElementSibling); });
  }

  /* =======================================================================
     5 · Panel lateral (árbol de la página) con drag-reorder
     ===================================================================== */
  var panel, panelList;
  function buildPanel() {
    panel = el('aside', 'blocks-panel');
    panel.setAttribute('data-block-chrome', '1');
    var head = el('div', 'blocks-panel__head',
      '<h4>Secciones de Inicio</h4><p>Arrastra para reordenar · duplica, oculta o elimina cada bloque.</p>');
    panelList = el('div', 'blocks-panel__list');
    var foot = el('div', 'blocks-panel__foot');
    var add = el('button', 'btn-add', ICON.plus + ' Añadir sección'); add.type = 'button';
    add.addEventListener('click', function () { openAddMenu(null); });
    var reset = el('button', 'btn-reset', 'Restablecer'); reset.type = 'button';
    reset.addEventListener('click', function () {
      if (window.confirm('¿Restablecer la estructura original? Se perderán los cambios de secciones.')) {
        localStorage.removeItem(LS); location.reload();
      }
    });
    foot.appendChild(add); foot.appendChild(reset);
    panel.appendChild(head); panel.appendChild(panelList); panel.appendChild(foot);
    document.body.appendChild(panel);
  }

  var dragId = null;
  function renderPanel(blocks) {
    if (!panelList) return;
    panelList.innerHTML = '';
    blocks.forEach(function (b, i) {
      var id = b.getAttribute('data-block-id');
      var name = b.getAttribute('data-block-name') || b.getAttribute('data-block');
      var isClone = b.getAttribute('data-block-clone') === '1';
      var isHidden = b.getAttribute('data-block-hidden') === '1';

      var row = el('div', 'blocks-row' + (isHidden ? ' is-hidden' : ''));
      row.setAttribute('draggable', 'true');
      row.dataset.id = id;
      row.innerHTML =
        '<span class="blocks-row__grip">' + ICON.grip + '</span>' +
        '<span class="blocks-row__i">' + pad(i + 1) + '</span>' +
        '<span class="blocks-row__name">' + name +
          (isClone ? '<span class="tagcopy">copia</span>' : '') + '</span>';

      var acts = el('span', 'blocks-row__acts');
      acts.appendChild(rowBtn(ICON.dup, 'Duplicar', function () { duplicate(b); }));
      acts.appendChild(rowBtn(isHidden ? ICON.eyeoff : ICON.eye, isHidden ? 'Mostrar' : 'Ocultar', function () { toggleHidden(b); }));
      var d = rowBtn(ICON.trash, 'Eliminar', function () { remove(b); }); d.classList.add('is-danger');
      acts.appendChild(d);
      row.appendChild(acts);

      row.addEventListener('dragstart', function () { dragId = id; row.classList.add('dragging'); });
      row.addEventListener('dragend', function () {
        dragId = null; row.classList.remove('dragging');
        panelList.querySelectorAll('.drop-before,.drop-after').forEach(function (r) { r.classList.remove('drop-before', 'drop-after'); });
      });
      row.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (dragId === id) return;
        var rect = row.getBoundingClientRect();
        var after = e.clientY > rect.top + rect.height / 2;
        row.classList.toggle('drop-after', after);
        row.classList.toggle('drop-before', !after);
      });
      row.addEventListener('dragleave', function () { row.classList.remove('drop-before', 'drop-after'); });
      row.addEventListener('drop', function (e) {
        e.preventDefault();
        if (!dragId || dragId === id) return;
        var src = main.querySelector('[data-block-id="' + cssEsc(dragId) + '"]');
        var rect = row.getBoundingClientRect();
        var after = e.clientY > rect.top + rect.height / 2;
        if (src) {
          if (after) b.after(src); else main.insertBefore(src, b);
          renderAll(); persist();
        }
      });

      panelList.appendChild(row);
    });
  }
  function rowBtn(icon, label, fn) {
    var b = el('button', null, icon); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
    b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
    return b;
  }

  /* =======================================================================
     6 · Menú "Añadir sección"
     ===================================================================== */
  var addMenu, addTarget = null;
  function buildAddMenu() {
    addMenu = el('div', 'blocks-addmenu');
    addMenu.setAttribute('data-block-chrome', '1');
    var card = el('div', 'blocks-addmenu__card');
    var head = el('div', 'blocks-addmenu__head',
      '<div><h4>Añadir sección</h4><p>Elige una plantilla. Se inserta lista para editar.</p></div>');
    var close = el('button', 'blocks-addmenu__close', ICON.close); close.type = 'button';
    close.addEventListener('click', closeAddMenu);
    head.appendChild(close);
    var grid = el('div', 'blocks-addmenu__grid');
    var subtitles = {
      hero: 'Portada principal con imagen y llamado a la acción.',
      marquee: 'Cinta animada de áreas o palabras clave.',
      about: 'Quiénes somos · relato y valores de la firma.',
      stats: 'Cifras destacadas con contador animado.',
      team: 'Rejilla de socios y perfiles del equipo.',
      areas: 'Áreas de práctica en tarjetas numeradas.',
      trust: 'Credibilidad · reconocimientos y afiliaciones.',
      tests: 'Testimonios de clientes en formato cita.',
      articles: 'Artículos de interés / blog en tarjetas.',
      contact: 'Formulario de contacto y datos de las sedes.'
    };
    typeOrder.forEach(function (type) {
      var t = templates[type];
      var item = el('button', 'blocks-addmenu__item');
      item.type = 'button';
      item.innerHTML = '<b>' + t.name + '</b><span>' + (subtitles[type] || 'Sección de la página.') + '</span>';
      item.addEventListener('click', function () { addType(type, addTarget); });
      grid.appendChild(item);
    });
    card.appendChild(head); card.appendChild(grid);
    addMenu.appendChild(card);
    addMenu.addEventListener('click', function (e) { if (e.target === addMenu) closeAddMenu(); });
    document.body.appendChild(addMenu);
  }
  function openAddMenu(before) { addTarget = before || null; addMenu.classList.add('open'); }
  function closeAddMenu() { addMenu.classList.remove('open'); addTarget = null; }

  /* =======================================================================
     7 · Botón flotante de modo edición
     ===================================================================== */
  function buildToggle() {
    var btn = el('button', 'blocks-toggle',
      '<span class="dot"></span>' + ICON.layers + '<span class="lbl">Editar secciones</span>');
    btn.type = 'button';
    btn.setAttribute('data-block-chrome', '1');
    btn.addEventListener('click', function () {
      var on = document.body.classList.toggle('blocks-editing');
      btn.querySelector('.lbl').textContent = on ? 'Listo' : 'Editar secciones';
      try { localStorage.setItem(LS + ':edit', on ? '1' : '0'); } catch (e) {}
      if (!on) closeAddMenu();
    });
    document.body.appendChild(btn);
    if (localStorage.getItem(LS + ':edit') === '1') {
      document.body.classList.add('blocks-editing');
      btn.querySelector('.lbl').textContent = 'Listo';
    }
  }

  /* =======================================================================
     Init
     ===================================================================== */
  applyState();
  buildPanel();
  buildAddMenu();
  buildToggle();
  renderAll();
  window.addEventListener('beforeunload', persist);
})();
