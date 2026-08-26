# Handoff: Rivas Cáceres Abogados — Sitio institucional

## Overview

Landing page institucional de una sola página para una firma de abogados en Bogotá, Colombia. Estructura AIDA (Atención → Interés → Deseo → Acción): hero con carrusel, presentación de la firma, equipo, áreas de práctica, especialidad corporativa, credenciales, artículos y contacto con mapa. Incluye dos formularios conectados a webhooks de Make.com y dos modales (candidatura laboral y lectura de artículos).

Idioma: español (Colombia). El sitio es 100% estático — no hay backend propio.

## About the Design Files

**Los archivos de este paquete son referencias de diseño creadas en HTML/CSS/JS vanilla.** Son un prototipo funcional que muestra la apariencia y el comportamiento pretendidos, no código de producción para copiar tal cual.

La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Next.js, Astro, Vue, etc.) usando sus patrones y librerías establecidas. Si no existe un codebase todavía, elegir el framework apropiado — para un sitio institucional de este tipo, **Astro o Next.js estático son la mejor opción** por SEO y peso.

Lo que sí se puede tomar literal:
- Los tokens de diseño (`:root` en `styles.css`) — son la fuente de verdad del sistema visual.
- El copy en español — está revisado y aprobado por el cliente.
- El JSON-LD de `LegalService` en el `<head>` de `index.html`.

Lo que hay que reescribir:
- Todo el JS imperativo (`app.js`, `careers.js`, etc.) — está escrito en ES5 con IIFEs y manipulación directa del DOM.
- `blocks.js` y los archivos `tweaks-*.jsx` — son herramientas del entorno de prototipado, **no van a producción** (ver «Archivos» abajo).

## Fidelity

**Alta fidelidad (hifi).** Colores, tipografía, espaciado, animaciones y estados finales están definidos. El desarrollador debe recrear la UI con precisión usando las librerías del codebase destino. Los valores exactos están en la sección «Design Tokens».

Única excepción: la sección «Nuestra Especialidad» tiene un placeholder de imagen pendiente (ver «Assets»).

---

## Screens / Views

El sitio es una sola página con 10 bloques en este orden de DOM. Cada `<section>` lleva `data-block="<id>"`.

### Header (fijo)

- **Propósito:** navegación persistente y CTA principal.
- **Layout:** `position: fixed`, ancho completo. Grid de 3 columnas: marca izquierda, nav centro, CTA derecha. Padding horizontal `var(--gutter)`.
- **Comportamiento:** al hacer scroll más de ~40px gana fondo sólido `--navy-900` y una hairline inferior `--navy-line`; antes es transparente sobre el hero.
- **Marca:** `Rivas` en `--serif` 1.42rem peso 500, `&` en `--gold` italic, `Asociados` en `--serif`. Debajo, `small` en `--sans` 0.56rem peso 600, `letter-spacing: 0.34em`, uppercase, color `--on-navy-mut`.
- **Nav:** enlaces en `--sans`, con índice numérico (`.idx`) en `--gold`.
- **Móvil (< 860px):** hamburguesa que abre `.mobile-menu` — panel full-screen que entra con `transform: translateY(0)`, enlaces en `--serif` `clamp(1.8rem, 7vw, 2.6rem)`.

### 1. Hero — `data-block="hero"` · `id="inicio"`

- **Propósito:** captar atención y llevar a solicitar consulta.
- **Layout:** altura completa de viewport. Media de fondo absoluto, contenido centrado con `max-width` y `text-align: center`.
- **Carrusel de fondo:** 15 imágenes en `assets/hero-*.png` que rotan **cada 3 segundos** con fade cruzado y efecto Ken Burns (zoom lento). El array de fuentes está en `app.js`. Overlay oscuro encima controlado por `--hero-overlay: 0.62`.
- **Badge:** estrellas en `--gold-soft` (`letter-spacing: 2px`, 0.7rem) + texto en `--serif` 0.95rem + subtítulo uppercase 0.6rem.
- **Título:** clase `.display`, `--serif`, `clamp(2.6rem, 6.2vw, 5.1rem)`, peso 500, `line-height: 1.08`, `letter-spacing: -0.01em`.
- **CTAs:** flex con gap. Primario `.btn.btn--gold`, secundario `.btn.btn--ghost-light` que abre el modal de candidatura (`data-careers-open`).
- **Meta inferior:** 3 estadísticas. Números en `--serif` `clamp(1.7rem, 3vw, 2.4rem)`, etiquetas uppercase 0.74rem `letter-spacing: 0.14em` color `--on-navy-mut`. Los números **cuentan hacia arriba al cargar**, con retardo escalonado (`data-count` en el HTML, lógica en `app.js`).

### 2. Marquesina — `data-block="marquee"`

- **Propósito:** listar áreas y términos de reconocimiento en movimiento continuo.
- **Layout:** franja de ancho completo, `overflow: hidden`. Track en `display: flex`, `gap: 64px`, `width: max-content`.
- **Animación:** `translateX(-50%)` en loop de **38s lineal infinito**. El contenido está duplicado en el HTML para que el loop sea invisible. **Se pausa en hover** (`animation-play-state: paused`).
- **Tipografía:** `--serif` 1.05rem italic, color `--on-navy-soft`. Separador `·` en `--gold` vía `::after`.
- `aria-hidden="true"` — es decorativo.

### 3. Quiénes Somos — `data-block="about"` · `id="nosotros"`

- **Propósito:** presentar la firma y sus valores.
- **Layout:** contenido centrado, `max-width: 880px`, `margin-inline: auto`, `text-align: center`. Hay un `.about__bg` decorativo detrás.
- **Título:** `--serif`, `clamp(3.2rem, 9vw, 7rem)`, peso 500, `line-height: 1.02`, color `#fff`.
- **Valores:** grid de tarjetas `.v`, cada una con `border-top: 1px solid rgba(255,255,255,0.14)` y `text-align: left`. El `h4` va en `--sans` 0.96rem peso 700 y lleva un **rombo de 7×7px** en `--gold` (`transform: rotate(45deg)`) como viñeta vía `::before`. Cuerpo 0.9rem color `--on-navy-soft`.

### 4. Cifras — `data-block="stats"`

- **Layout:** grid de **4 columnas iguales** con `gap: 1px` y fondo `--navy-700`, lo que produce líneas divisorias de 1px sin bordes explícitos. Cada celda tiene fondo `--navy-900` y padding `clamp(28px, 4vw, 48px) clamp(20px, 3vw, 36px)`.
- **Número:** `--serif`, `clamp(2.6rem, 5vw, 3.9rem)`, peso 500, `line-height: 1`, color `#fff`. El sufijo (`.u`: `+`, `%`) va en `--gold-soft`.
- **Etiqueta:** 0.82rem, uppercase, `letter-spacing: 0.1em`, color `--on-navy-soft`, `margin-top: 14px`.
- **Responsive:** colapsa a 2 columnas en tablet.

### 5. Equipo — `data-block="team"` · `id="equipo"`

- **Propósito:** dar cara humana a la firma.
- **Layout:** `.section-head` arriba, luego grid de tarjetas de perfil.
- **Cada tarjeta:** retrato, nombre en `--serif`, cargo en `--sans` uppercase pequeño color `--gold-soft`, y una línea de especialidad (`<p class="spec">`).
- ⚠️ **Nota de nomenclatura:** la clase `.spec` de este bloque **no tiene relación** con la sección «Nuestra Especialidad», cuyo prefijo es `.esp__`. Se renombró justamente para evitar la colisión. No volver a unificarlas.

### 6. Áreas de Práctica — `data-block="areas"` · `id="areas"`

- **Layout:** grid de tarjetas `.area` en `display: flex; flex-direction: column`.
- **Cada tarjeta:**
  - Icono SVG `.area__ico` de 46×46px, color `--gold-soft` → **hover: `--gold`** con transición `.4s var(--ease)`.
  - Número de orden `.area__num` en `position: absolute`, esquina superior derecha, offset `clamp(30px, 3.4vw, 46px)`, en `--serif` 0.95rem color `--on-navy-mut`.
  - `h3` de 1.32rem, `margin-top: 26px`, color `#fff`.
  - Párrafo 0.95rem color `--on-navy-soft`, `margin-top: 14px`, `flex: 1` para que las tarjetas queden a la misma altura.

### 7. Nuestra Especialidad — `data-block="especialidad"` · `id="especialidad"`

- **Propósito:** posicionar la firma en derecho corporativo, usando su experiencia con colegios privados como prueba de versatilidad — **no como el foco**. El mensaje es corporativo primero.
- **Fondo:** `--navy-800` (distinto de sus vecinos, que son `--navy-900`).
- **Layout:** `.esp__split` — grid `1fr 1fr` con `gap: clamp(48px, 7vw, 96px)`, `align-items: center`. Imagen izquierda, texto derecha.
- **Imagen:** `<image-slot>` con `aspect-ratio: 4/5`, `border-radius: var(--radius)`. A su izquierda, en `left: -24px`, una **línea vertical de 2px** con gradiente `transparent → --gold → transparent` al 80% de altura. Caption debajo: 0.72rem uppercase `letter-spacing: 0.1em` color `--on-navy-mut`, centrado.
- **Título:** `.esp__title` — `--serif`, `clamp(2rem, 3.8vw, 3rem)`, peso 500, `line-height: 1.06`. El `<em>` va italic en `--gold-soft`.
- **Puntos clave:** `.esp__points` en `display: flex; flex-direction: column; gap: 28px`, con `border-top: 1px solid var(--navy-line)` y `padding-top: clamp(28px, 3vw, 40px)`.
  - Cada `.esp__point` es flex con `gap: 18px`, `align-items: flex-start`.
  - Icono: caja de **36×36px**, `border-radius: 8px`, fondo `--gold-tint`, borde `1px solid rgba(168,124,66,0.22)`, SVG interno de 16×16px en `--gold-soft`.
  - Título del punto: `--sans` 0.9rem peso 700 color `--on-navy`, `margin-bottom: 6px`.
  - Cuerpo: 0.88rem color `--on-navy-soft`, `line-height: 1.6`.
- **CTA:** `.btn.btn--gold` → `#contacto`.
- **Responsive (< 860px):** una columna, la línea dorada se oculta, la imagen pasa a `aspect-ratio: 16/9`.

### 8. Confianza — `data-block="trust"`

- **Layout superior:** `.trust__top` grid `1fr 1fr`, `gap: clamp(36px, 5vw, 72px)`, `align-items: end`, `margin-bottom: clamp(44px, 5vw, 64px)`.
- **Credenciales:** `.trust__creds` grid de 2×2, `gap: 28px`. Números en `--serif` `clamp(2.2rem, 3.6vw, 3rem)`, sufijo `.u` en `--gold`. Etiquetas 0.8rem uppercase color `--on-navy-mut`.
- **Video:** `.trust__video-frame` contiene un `<video>` nativo con `controls`, `playsinline`, `preload="metadata"`, posicionado `absolute; inset: 0` con `object-fit: cover`. Fuente: `assets/trust-video.mp4`.
  - Contexto: se intentó con embed de YouTube y falló por error 153 (el video estaba marcado como «contenido para niños», lo que desactiva embeds). Se resolvió alojando el archivo localmente. **En producción, mover este video a un CDN o a Mux/Cloudflare Stream** — no servirlo desde el mismo origen.
- **Columnas inferiores:** `h4` de sección en `--sans` 0.74rem peso 700 `letter-spacing: 0.18em` uppercase color `--on-navy-mut`, `margin-bottom: 22px`.
  - `.assoc-list`: flex wrap con `gap: 12px`, ítems tipo chip.
  - `.award-list`: ítems flex con `gap: 16px`, `padding: 14px 0`, `border-bottom: 1px solid var(--navy-line)` (el último sin borde), `align-items: baseline`. Año `.yr` en `--serif` color `--gold`, ancho fijo 52px. Título en `--sans` 0.96rem peso 600 color `#fff`, descripción 0.84rem color `--on-navy-mut`.

### 9. Artículos — `data-block="articles"` · `id="articulos"`

- **Layout:** `.articles__head` con título y (opcionalmente) enlace, luego grid de tarjetas.
- **Comportamiento:** cada tarjeta abre un **modal de lectura** (`article-modal.js` + `article-modal.css`) con el contenido completo del artículo. El contenido vive en el HTML, oculto, y el modal lo clona.
- Cierre por botón, click en backdrop y tecla `Escape`.

### 10. Contacto — `data-block="contact"` · `id="contacto"`

- **Layout:** `.contact__intro` arriba; abajo, formulario y panel de oficinas/mapa.
- **Formulario:** campos `.field` con `<label>` en 0.72rem uppercase `letter-spacing: 0.14em` color `--on-navy-mut`. Inputs sin caja: `background: transparent`, sin borde salvo `border-bottom: 1px solid var(--navy-line)`, `padding: 12px 0`, texto 0.98rem color `#fff`. En focus el `border-color` pasa a `--gold` con transición `.3s var(--ease)`.
  - Campos: nombre, teléfono, email, área de práctica (select), mensaje.
  - Botón: `Agendar Consulta` con flecha `→`.
- **Oficinas:** cada `.office` es grid `auto 1fr` con `gap: 20px`, `padding: 22px 0`, `border-top: 1px solid var(--navy-line)` (el primero sin borde ni padding superior). Ciudad en `--serif` 1.15rem con **rombo de 7×7px** en `--gold` rotado 45° como viñeta. Dirección en 0.9rem color `--on-navy-soft`, `line-height: 1.7`.
- **Mapa:** ver «Mapa de sede» abajo.

### Footer

- **Layout:** `.footer__top` grid `1.4fr 1fr 1fr 1fr`, `gap: clamp(28px, 3vw, 56px)`, `padding-bottom: 48px`, `border-bottom: 1px solid var(--navy-line)`. Fondo `#0a1b1b` (más oscuro que `--navy-900`).
- **Marca:** `--serif` 1.5rem color `#fff`, `&` en `--gold` italic. Párrafo 0.9rem `max-width: 34ch` color `--on-navy-mut`.
- **Social:** un único enlace a **WhatsApp** (SVG inline, 16×16, `fill: currentColor`). Antes había LinkedIn / X / Instagram; fueron eliminados a pedido del cliente — **la firma solo usa WhatsApp**.

---

## Componentes transversales

### Botón flotante de WhatsApp — `.wa-fab`

- `position: fixed`, `right: 20px`, `bottom: 20px`, `z-index: 9000`. Es el espejo derecho del botón de edición que vive a la izquierda en el prototipo.
- Pill: `padding: 10px 18px 10px 14px`, `border-radius: 100px`, fondo `rgba(22,44,44,0.92)`, borde `1px solid rgba(37,211,102,0.35)`, `backdrop-filter: blur(8px)`, sombra `0 4px 24px rgba(0,0,0,0.35)`.
- Color de marca WhatsApp: `#25d366`. Icono SVG 18×18. La etiqueta «WhatsApp» se inyecta por `::after` con `content`.
- **Hover:** `translateY(-2px)`, fondo `rgba(37,211,102,0.12)`, borde `rgba(37,211,102,0.6)`.
- **< 480px:** se oculta la etiqueta y queda solo el icono con `padding: 12px`.
- `@media print`: `display: none`.
- **Destino:** `https://web.whatsapp.com/send?phone=573004830722`, abierto con `onclick` que detecta user-agent móvil y usa el esquema `whatsapp://send?phone=` en su lugar.
  - ⚠️ **Recomendación para producción:** reemplazar ese `onclick` por un `<a href="https://wa.me/573004830722">` simple. `wa.me` es el formato oficial y maneja la bifurcación app/web del lado de WhatsApp. La detección por user-agent que quedó en el prototipo es frágil.

### Mapa de sede — `contact-map.js` + `contact-map.css`

Sistema con dos proveedores conmutables por config. **Toda la configuración editable vive en el objeto `window.RIVAS_MAP_CONFIG` al inicio de `contact-map.js`** — coordenadas, dirección, teléfono, zoom.

- **Modo `embed` (activo):** iframe de Google Maps sin API key, centrado en coordenadas fijas de la sede (`4.7419, -74.0330`, zoom 16). Dirección: CL 146 # 7-64 Of. 403, Bogotá.
  - **Toggle Mapa/Satélite:** `position: absolute`, `top/right: 14px`. Alterna el parámetro `&t=m` / `&t=k` del iframe. Pill de 2 botones, `border-radius: 8px`, fondo `rgba(6,14,14,0.72)`, `backdrop-filter: blur(8px)`. Botones en 0.68rem peso 600 uppercase `letter-spacing: 0.08em`; el activo va en `--gold-soft` sobre `rgba(168,124,66,0.12)`.
  - **Loading skeleton:** spinner de 32px, borde 2.5px, `border-top-color: --gold-soft`, girando `0.8s linear infinite`. Texto «Cargando mapa…» en 0.74rem uppercase. El iframe entra con `opacity` en transición `.4s`; el loader se desvanece en su `load`.
  - **Badge:** esquina inferior izquierda, pill con punto de 7px en `--gold` que pulsa (`cmapBlink`, 2.2s) y la palabra «Google Maps».
  - **CTAs:** «Abrir en Google Maps» (primario, en tinte dorado) y «Cómo llegar» (que arma una URL `dir/?api=1&destination=`).
- **Modo `google`:** implementado y listo. Se activa poniendo `provider: 'google'` y una API key en `googleMapsApiKey`. Carga el SDK, centra el mapa y pinta marcadores desde el array `locations`.
- Todas las animaciones están envueltas en `@media (prefers-reduced-motion: no-preference)`.

### Modal de candidatura — `careers.js` + `careers.css`

- Se abre con cualquier elemento `[data-careers-open]`; se cierra con `[data-careers-close]`, click en backdrop o `Escape`.
- Estructura: `.careers__backdrop` + `.careers__dialog` con `role="dialog"` y `aria-modal="true"`.
- Campos: nombre, correo, teléfono, cargo de interés, mensaje y **adjunto de CV en PDF**.
- **Envío:** `FormData` por `POST` a `https://hook.us2.make.com/akj9apjxvimbkfx3iw2i97igeazajt4o`.
  - Estados: el botón se deshabilita y muestra «Enviando…»; al resolver, el diálogo gana la clase `is-sent` y aparece `.careers__success` (check SVG + mensaje de confirmación); si falla, se restaura el botón y se escribe el error en el nodo de error sin romper el modal.

### `<image-slot>` — `image-slot.js`

Web component de placeholder de imagen: el usuario arrastra un archivo y la imagen persiste en `localStorage` por `id`. **Es una herramienta de prototipado.** En producción se reemplaza por un `<img>`/`<picture>` normal (o el componente de imagen del framework, ej. `next/image`).

---

## Interactions & Behavior

| Interacción | Detalle |
|---|---|
| Reveal on scroll | Elementos con `.reveal` entran al viewport y aparecen. Clases `.d1`, `.d2`, `.d3` escalonan el retardo. Implementado con `IntersectionObserver` en `app.js`. |
| Contadores | `[data-count]` en el hero animan de 0 al valor final al cargar la página, escalonados. |
| Header en scroll | Gana fondo sólido pasados ~40px de scroll. |
| Carrusel de hero | Cambio cada **3000 ms**, fade cruzado + Ken Burns. |
| Marquesina | Loop de 38s, **pausa en hover**. |
| Toggle de mapa | Cambia el `src` del iframe y reproyecta el loader. |
| Modales | Cierre por botón, backdrop y `Escape` en ambos casos. |
| Smooth scroll | `scroll-behavior: smooth` en `html`, desactivado bajo `prefers-reduced-motion: reduce`. |
| Formularios | Validación nativa vía `checkValidity()` + `reportValidity()`. Sin librería. |

**Accesibilidad ya cubierta que hay que preservar:** `prefers-reduced-motion` respetado en todas las animaciones; `aria-label` en enlaces de icono; `aria-hidden` en decorativos; `role="dialog"` + `aria-modal` en modales; `aria-labelledby` apuntando al título del modal.

## State Management

Estado mínimo, todo local. En un framework moderno:

| Estado | Alcance | Disparador |
|---|---|---|
| `isScrolled` | Header | scroll > 40px |
| `activeSlide` | Hero | intervalo de 3s |
| `mobileMenuOpen` | Header | click en hamburguesa |
| `mapType` | Mapa | click en toggle (`'map' \| 'satellite'`) |
| `mapLoading` | Mapa | `load` del iframe |
| `careersOpen` / `careersSent` / `careersError` | Modal candidatura | interacción + respuesta del webhook |
| `activeArticle` | Modal artículos | click en tarjeta |
| `contactSubmitting` / `contactSent` / `contactError` | Form contacto | submit + respuesta del webhook |

Ninguno requiere store global. `useState` local o equivalente es suficiente.

### Integraciones externas

Dos webhooks de Make.com. **Mover a variables de entorno** — hoy están hardcodeados en el JS y son públicamente visibles.

| Formulario | Endpoint | Payload |
|---|---|---|
| Contacto (`app.js`) | `https://hook.us2.make.com/5kk4ygczna1tmo26pi7c2hzbkztkimha` | `URLSearchParams` con `Content-Type: application/x-www-form-urlencoded` — elegido a propósito para **evitar el preflight CORS**. |
| Candidatura (`careers.js`) | `https://hook.us2.make.com/akj9apjxvimbkfx3iw2i97igeazajt4o` | `FormData` (incluye el PDF adjunto). |

⚠️ Un endpoint de webhook expuesto en el cliente es spameable. En producción, proxear a través de una API route / serverless function y añadir rate limiting y captcha (Turnstile o hCaptcha).

Hay una integración de **WhatsApp Cloud API** planeada pero no implementada, documentada en `Guia WhatsApp Cloud API.html`. La decisión de arquitectura relevante: **la Cloud API nunca se llama desde el cliente** (requiere un token secreto permanente); se invoca desde el escenario de Make.com que ya recibe los formularios.

## Design Tokens

Copiar de `:root` en `styles.css`. Es la fuente de verdad.

### Color

```
/* Verdes — superficies */
--navy-900: #0f2424   /* fondo por defecto de secciones */
--navy-800: #162c2c   /* fondo alterno (Especialidad) */
--navy-700: #1D4141   /* color principal de marca */
--navy-600: #255252
--navy-500: #2e6565
                       /* #0a1b1b — footer, no tokenizado */

/* Papel — variantes claras */
--paper:    #f5f3ee
--paper-2:  #faf8f3
--line:     #e2ded4
--line-2:   #d4cfc2

/* Tinta — texto sobre claro */
--ink:      #1a201e
--ink-soft: #465450
--ink-mut:  #687470

/* Dorado — acento */
--gold:      #a87c42
--gold-soft: #c09656
--gold-tint: rgba(168,124,66,0.14)

/* Texto sobre verde */
--on-navy:      #edf2f0
--on-navy-soft: #a8bfb8
--on-navy-mut:  #6e8e84
--navy-line:    rgba(255,255,255,0.12)

/* Externo */
WhatsApp: #25d366
```

Regla de uso: máximo dos fondos por vista (`--navy-900` y `--navy-800`). El dorado es acento, nunca superficie grande.

### Tipografía

```
--serif: 'Spectral', Georgia, 'Times New Roman', serif
--sans:  'Hanken Grotesk', system-ui, -apple-system, sans-serif
```

Google Fonts — pesos cargados: Spectral 300/400/500/600 + italic 400/500; Hanken Grotesk 400/500/600/700.

⚠️ El `<link>` de fuentes en `index.html` también carga **Cormorant Garamond** y otras familias que **no se usan**. Limpiar en producción: son bytes muertos.

Escala:

| Rol | Familia | Tamaño | Peso | Otros |
|---|---|---|---|---|
| Display (hero) | serif | `clamp(2.6rem, 6.2vw, 5.1rem)` | 500 | `lh 1.08`, `ls -0.01em` |
| H1 about | serif | `clamp(3.2rem, 9vw, 7rem)` | 500 | `lh 1.02` |
| H2 sección | serif | `clamp(2rem, 3.8vw, 3rem)` | 500 | `lh 1.06` |
| Cifra grande | serif | `clamp(2.6rem, 5vw, 3.9rem)` | 500 | `lh 1` |
| H3 tarjeta | serif | 1.32rem | 500 | — |
| Eyebrow | sans | 0.72rem | 600 | uppercase, `ls 0.16em` |
| Body | sans | 0.9–0.98rem | 400 | `lh 1.6` |
| Etiqueta uppercase | sans | 0.72–0.82rem | 400–600 | `ls 0.1–0.18em` |
| Botón | sans | 0.84rem | 600 | uppercase, `ls 0.06em` |

Todos los `h1–h4` van en `--serif` peso **500** con `letter-spacing: -0.01em`. Nunca 700 en serif.

### Geometría y movimiento

```
--maxw:   1240px
--gutter: clamp(20px, 5vw, 64px)
--radius: 4px                          /* muy sutil, casi cuadrado */
--ease:   cubic-bezier(0.22, 0.61, 0.36, 1)
--hero-overlay: 0.62
```

Radios fuera del token: `8px` en cajas de icono y toggle, `100px` en pills, `50%` en avatares y puntos.

Duraciones observadas: `0.15–0.18s` en micro-interacciones (hover de botón), `0.3s` en focus de input, `0.4s` en hover de icono y fade de iframe, `0.8s` en el spinner, `2.2s` en el pulso del badge, `38s` en la marquesina.

Breakpoints: **860px** (el principal — colapsa grids a una columna), **480px** (ajustes finos del FAB).

Espaciado: no hay escala numérica; se usa `clamp()` con mínimo/preferido/máximo por contexto. Al portar, considerar normalizar a una escala de 4px.

## Assets

### Imágenes del hero — `assets/hero-*.png`

15 archivos, provistos por el cliente. Orden de rotación definido en `app.js`, alternando a propósito arquitectura → derecho → personas para dar variedad visual:

```
hero-glass-towers, hero-justicia, hero-library, hero-city-sunset,
hero-scales-gavel, hero-courthouse, hero-city-night, hero-consultation,
hero-twin-towers, hero-work-meeting, hero-pen-paper, hero-white-building,
hero-lawyer-suit, hero-woman-lawyer, hero-professionals
```

⚠️ **Están en PNG.** Para producción: convertir a **WebP/AVIF**, generar variantes responsive y precargar solo la primera. 15 PNG a resolución completa es un costo de carga inaceptable en móvil.

### Video — `assets/trust-video.mp4`

Provisto por el cliente. Servir desde CDN o plataforma de video en producción, no desde el origen.

### Logo — `logo.png`

### Pendiente

La sección «Nuestra Especialidad» tiene un `<image-slot id="spec-main">` **sin imagen definitiva**. Se necesita una foto corporativa (reunión de directivos, firma de contrato o sala de juntas) en formato **4:5 vertical**.

Nota: se descartaron dos candidatas por traer marca de agua de Adobe Stock. **Cualquier imagen que se use debe tener licencia.**

## Files

### Van a producción — recrear

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura completa, copy en español, JSON-LD de `LegalService`, metadatos OG |
| `styles.css` | Sistema visual completo: tokens, reset, tipografía, todas las secciones (~764 líneas) |
| `contact-map.css` / `contact-map.js` | Mapa de sede con doble proveedor |
| `careers.css` / `careers.js` | Modal de candidatura + envío a webhook |
| `article-modal.css` / `article-modal.js` | Modal de lectura de artículos |
| `app.js` | Reveal on scroll, contadores, header, carrusel, menú móvil, form de contacto |
| `assets/` | Imágenes del hero y video |
| `logo.png` | Logo |

### NO van a producción — herramientas del prototipo

| Archivo | Qué es |
|---|---|
| `blocks.css` / `blocks.js` | Editor de secciones: permite reordenar bloques en vivo y persiste en `localStorage`. Andamio de prototipado. |
| `tweaks-panel.jsx` / `tweaks-app.jsx` | Panel de ajuste de tokens en vivo. Requiere React + Babel por CDN — la única razón por la que el prototipo carga React. **Al portar, React vía CDN desaparece.** |
| `image-slot.js` | Placeholders de imagen arrastrables. |
| `index-standalone.html` | Build de un solo archivo autocontenido. |
| `_vidcheck.html` | Scratch de pruebas del video. |
| `Rivas & Asociados.html` | Versión anterior, conservada como referencia. |
| `screenshots/`, `uploads/` | Material de trabajo. |

### Documentación

| Archivo | Contenido |
|---|---|
| `Guia WhatsApp Cloud API.html` | Guía de 11 fases para la integración de WhatsApp Cloud API vía Make.com: requisitos, tokens, plantillas de mensaje con sus ejemplos, tabla de errores. Documento imprimible. |

---

## Prioridades sugeridas al portar

1. **Elegir framework.** Astro o Next.js estático. El sitio es 95% contenido estático con islas de interactividad.
2. **Portar los tokens primero.** A CSS custom properties o al `theme` de Tailwind. Todo lo demás cuelga de ahí.
3. **Optimizar imágenes.** Es la mejora de rendimiento más grande disponible: 15 PNG → WebP/AVIF responsive con carga diferida.
4. **Asegurar los formularios.** Los webhooks a variables de entorno, proxeados por serverless function, con rate limiting y captcha.
5. **Limpiar las fuentes.** Cargar solo Spectral y Hanken Grotesk, solo los pesos usados.
6. **Simplificar el botón de WhatsApp.** `<a href="https://wa.me/573004830722">` en lugar de la detección por user-agent.
7. **Mover el video** a un CDN o plataforma de streaming.
8. **Preservar la accesibilidad** ya existente: `prefers-reduced-motion`, roles de diálogo, `aria-label` en iconos.

## Datos del cliente

- **Firma:** Rivas Cáceres Abogados (Rivas & Asociados)
- **Sede:** CL 146 # 7-64 Oficina 403, Bogotá D.C. 110111, Colombia
- **Coordenadas:** 4.7419, -74.0330
- **WhatsApp:** +57 300 483 0722
- **Cobertura:** nacional — 32 departamentos
- **Fundación:** 1987 (según el JSON-LD)
