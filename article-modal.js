/* =========================================================================
   Artículos & Insights · Modal de lectura
   Abre una ventana emergente con el contenido completo del artículo.
   Mismo patrón que careers.js — no depende de servicios externos.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- datos de artículos (fuente de verdad) ---------- */
  var ARTICLES = {
    'art-1': {
      cat: 'Corporativo',
      date: '15 mayo 2026',
      read: '6 min de lectura',
      title: 'La reforma del control de concentraciones: qué cambia para las fusiones en 2026',
      body: [
        'Las nuevas reglas de competencia aprobadas a principios de 2026 redefinen de forma significativa los umbrales de notificación obligatoria en operaciones de fusión y adquisición. El impacto es especialmente relevante para transacciones de mediano tamaño que hasta ahora quedaban fuera del radar regulatorio.',
        'La reforma eleva el escrutinio sobre operaciones en sectores digitales, energéticos y farmacéuticos, introduciendo criterios adicionales basados en el valor de la transacción —no solo en la facturación de las partes—. Esto supone que operaciones que antes no requerían notificación pueden ahora estar sujetas a revisión previa por parte de las autoridades de competencia.',
        '<b>Principales cambios normativos</b>',
        'En primer lugar, se reducen los umbrales de facturación combinada que activan la obligación de notificación. En segundo lugar, se introduce el denominado "criterio de valor de transacción", aplicable cuando el precio supera los 150 millones de euros y la empresa adquirida tiene actividad significativa en el mercado nacional. Por último, se amplían los plazos de revisión para operaciones en sectores considerados estratégicos.',
        'Para las empresas que estén considerando operaciones de M&A en el corto plazo, resulta imprescindible revisar si la estructura de la transacción proyectada queda comprendida dentro del nuevo marco normativo. Un análisis previo adecuado evitará sanciones y retrasos que pueden comprometer el éxito de la operación.',
        '<b>Recomendaciones prácticas</b>',
        'Desde Rivas &amp; Asociados recomendamos iniciar el análisis de concentración en las fases más tempranas del proceso de M&A, antes de firmar el acuerdo vinculante. Asimismo, es aconsejable mantener comunicación activa con las autoridades regulatorias en operaciones que presenten elementos novedosos, a fin de obtener orientación informal que reduzca la incertidumbre sobre el resultado del proceso de aprobación.'
      ]
    },
    'art-2': {
      cat: 'Litigios',
      date: '28 abril 2026',
      read: '8 min de lectura',
      title: 'Arbitraje internacional: las cláusulas que su contrato debería incluir',
      body: [
        'Una cláusula de resolución de disputas bien redactada puede marcar la diferencia entre un proceso ágil y predecible y años de incertidumbre procesal. Sin embargo, en la práctica, muchos contratos internacionales contienen cláusulas deficientes o directamente patológicas que generan conflictos adicionales sobre el propio mecanismo de resolución.',
        'El arbitraje internacional ofrece ventajas innegables frente a la jurisdicción ordinaria en contextos transfronterizos: neutralidad del foro, confidencialidad, ejecutabilidad internacional del laudo y libertad para elegir árbitros especializados. No obstante, estas ventajas solo se materializan si la cláusula arbitral está correctamente redactada.',
        '<b>Elementos esenciales de una cláusula arbitral eficaz</b>',
        'En primer lugar, la cláusula debe identificar con precisión la institución arbitral elegida (CCI, LCIA, CAM, CEA, entre otras) o establecer claramente que el arbitraje será ad hoc bajo las Reglas UNCITRAL. En segundo lugar, debe especificar el número de árbitros, el idioma del procedimiento y la sede del arbitraje, pues esta última determina la ley procesal aplicable y el tribunal de apoyo competente.',
        'Es igualmente recomendable incluir previsiones sobre la ley sustantiva aplicable al contrato, distinguiéndola de la ley que rige el procedimiento arbitral. La omisión de este elemento es fuente frecuente de debates preliminares que dilatan innecesariamente el proceso.',
        '<b>Cláusulas complementarias recomendables</b>',
        'Además de la cláusula arbitral principal, conviene contemplar mecanismos escalonados de resolución de disputas que obliguen a las partes a intentar una negociación directa o una mediación antes de acudir al arbitraje. Estos mecanismos reducen la conflictividad y preservan las relaciones comerciales. En contratos de alta complejidad, también puede ser útil prever la figura del árbitro de emergencia para la adopción de medidas cautelares urgentes.'
      ]
    },
    'art-3': {
      cat: 'Penal Económico',
      date: '09 abril 2026',
      read: '5 min de lectura',
      title: 'Responsabilidad penal de la persona jurídica: claves de un buen programa de compliance',
      body: [
        'La responsabilidad penal de las personas jurídicas lleva ya más de una década en nuestro ordenamiento, pero la jurisprudencia reciente ha dotado de contenido concreto a los requisitos que debe cumplir un programa de cumplimiento normativo para ser considerado eximente o atenuante de responsabilidad.',
        'El Tribunal Supremo ha consolidado una doctrina exigente: no basta con tener un documento de compliance aprobado formalmente. El programa debe estar efectivamente implantado, ser adecuado a los riesgos específicos de la organización y contar con mecanismos reales de supervisión y actualización periódica.',
        '<b>Elementos que exige la jurisprudencia actual</b>',
        'Los tribunales valoran especialmente la existencia de un mapa de riesgos penales actualizado y específico para la actividad de la empresa; protocolos de actuación claros para las áreas de mayor exposición; un canal de denuncias interno que garantice confidencialidad y protección al denunciante; y la designación de un órgano de cumplimiento con autonomía y recursos suficientes.',
        'La formación continua de empleados y directivos, así como la realización periódica de auditorías internas, son también factores que los jueces consideran a la hora de evaluar la eficacia real del modelo de prevención.',
        '<b>Consejo práctico</b>',
        'Un programa de compliance no puede ser un documento estático. Debe evolucionar con la empresa y con el marco normativo. Recomendamos revisar el modelo de prevención al menos una vez al año y siempre que se produzcan cambios significativos en la estructura corporativa, en la actividad de la empresa o en la legislación aplicable. La prevención es, invariablemente, más eficiente que la defensa.'
      ]
    },
    'ins-1': {
      cat: 'Derecho Corporativo',
      date: 'Enero 2026',
      read: '5 min de lectura',
      title: 'Tendencias en gobierno corporativo para empresas en crecimiento',
      body: [
        'El gobierno corporativo ha dejado de ser una preocupación exclusiva de las grandes compañías cotizadas. Las empresas en fase de crecimiento —especialmente aquellas que reciben financiación de capital riesgo o que se preparan para una operación de M&A— enfrentan una presión creciente por parte de inversores y socios para adoptar estructuras de gobierno más robustas y transparentes.',
        'Los nuevos estándares internacionales de gobernanza hacen hincapié en tres ejes: la composición y funcionamiento del consejo de administración, la gestión de conflictos de interés y la transparencia en la información financiera y no financiera. En las empresas de rápido crecimiento, estos tres elementos suelen estar insuficientemente desarrollados, lo que genera riesgos reputacionales y legales de consideración.',
        '<b>El consejo de administración como palanca de valor</b>',
        'Un consejo bien estructurado no es solo un requisito formal: es un activo estratégico. La incorporación de consejeros independientes con experiencia sectorial, la separación clara entre las funciones ejecutivas y las de supervisión, y la adopción de reglamentos internos que regulen el funcionamiento del órgano son pasos que incrementan la confianza de inversores y socios comerciales.',
        'Recomendamos a las empresas en crecimiento iniciar la profesionalización de su gobierno corporativo antes de que sea exigida externamente, aprovechando el margen que ofrece la etapa de expansión para construir estructuras sólidas sin la presión de un proceso de due diligence o de una crisis en curso.'
      ]
    },
    'ins-2': {
      cat: 'Derecho Laboral',
      date: 'Enero 2026',
      read: '6 min de lectura',
      title: 'Cambios normativos que impactan la contratación empresarial',
      body: [
        'El panorama normativo en materia laboral ha experimentado cambios de calado en los últimos meses, con impacto directo sobre las políticas de contratación de las empresas. Desde la modificación de los límites a la contratación temporal hasta los nuevos requisitos en materia de registro de jornada, las obligaciones de los empleadores se han ampliado de forma significativa.',
        'La contratación indefinida ha ganado centralidad en el sistema, reduciendo los supuestos en que resulta legítima la utilización de contratos de duración determinada. Las empresas que mantienen estructuras de plantilla con alto porcentaje de temporalidad deben revisar urgentemente su modelo de contratación para evitar exposición a sanciones y reclamaciones.',
        '<b>Nuevas exigencias en materia de registro y transparencia</b>',
        'La obligación de registro horario se ha extendido y reforzado, con requisitos más precisos sobre el formato y la accesibilidad de los registros para la Inspección de Trabajo. Adicionalmente, los convenios colectivos de nueva generación incorporan cláusulas sobre desconexión digital y trabajo a distancia que las empresas deben integrar en sus políticas internas.',
        'Desde nuestro departamento de Derecho Laboral recomendamos realizar una auditoría preventiva de las prácticas de contratación y gestión de la jornada, como paso previo a cualquier proceso de reestructuración o crecimiento de plantilla. La prevención en este ámbito tiene un coste muy inferior al de la resolución de conflictos laborales o inspecciones sancionadoras.'
      ]
    },
    'ins-3': {
      cat: 'Propiedad Intelectual',
      date: 'Enero 2026',
      read: '5 min de lectura',
      title: 'Protección estratégica de marcas y activos intangibles',
      body: [
        'En un entorno competitivo caracterizado por la digitalización y la globalización de los mercados, los activos intangibles —marcas, patentes, derechos de autor, know-how, bases de datos— representan una proporción creciente del valor de las empresas. Sin embargo, muchas organizaciones no cuentan con una estrategia coherente de protección de estos activos, lo que los deja expuestos a usurpaciones, copias e imitaciones.',
        'El registro de marcas sigue siendo el instrumento más eficaz para proteger la identidad comercial de una empresa. No obstante, su eficacia depende de una estrategia registral bien diseñada: elección correcta de clases de productos y servicios, cobertura geográfica adecuada a los mercados actuales y futuros, y vigilancia activa frente a marcas confundibles de terceros.',
        '<b>Marcas y activos digitales: nuevos desafíos</b>',
        'La proliferación de marcas en entornos digitales —nombres de dominio, perfiles en redes sociales, aplicaciones móviles— ha generado nuevas formas de conflicto que requieren una respuesta jurídica especializada. El squatting de dominios, la falsificación en plataformas de comercio electrónico y el uso no autorizado de marcas en campañas de publicidad digital son problemas recurrentes que afectan a empresas de todos los tamaños.',
        'Recomendamos abordar la protección de la propiedad intelectual como una inversión estratégica, no como un gasto reactivo. Un inventario actualizado de activos intangibles, combinado con una política de registro y vigilancia activa, reduce significativamente la exposición a litigios costosos y preserva el valor de la marca a largo plazo.'
      ]
    }
  };

  /* ---------- referencias DOM ---------- */
  var modal   = document.getElementById('art-modal');
  if (!modal) return;

  var backdrop = modal.querySelector('.art-modal__backdrop');
  var dialog   = modal.querySelector('.art-modal__dialog');
  var catEl    = modal.querySelector('.art-modal__cat');
  var dateEl   = modal.querySelector('.art-modal__date');
  var titleEl  = document.getElementById('art-modal-title');
  var bodyEl   = modal.querySelector('.art-modal__body');
  var lastFocus = null;

  /* ---------- populate ---------- */
  function populate(id) {
    var a = ARTICLES[id];
    if (!a) return;
    catEl.textContent  = a.cat;
    dateEl.textContent = a.date + (a.read ? '  ·  ' + a.read : '');
    titleEl.textContent = a.title;
    bodyEl.innerHTML = a.body.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');
  }

  /* ---------- abrir / cerrar ---------- */
  function open(id) {
    populate(id);
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { dialog.focus(); }, 60);
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- disparadores ---------- */
  document.querySelectorAll('[data-article-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      open(btn.getAttribute('data-article-open'));
    });
  });

  /* ---------- cierre ---------- */
  modal.querySelectorAll('[data-art-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
