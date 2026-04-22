/**
 * background.js
 * Genera los elementos decorativos SVG del fondo.
 * Separado de ui.js para mantener responsabilidades únicas.
 */

'use strict';

/** Definición de los iconos decorativos de fondo */
const DECORACIONES = [
  /* Cruces médicas */
  { type: 'cross', top: '7%',  left: '4%',   size: 36 },
  { type: 'cross', top: '20%', left: '11%',  size: 26 },
  { type: 'cross', top: '62%', left: '5%',   size: 32 },
  { type: 'cross', top: '40%', left: '1%',   size: 22 },
  { type: 'cross', top: '5%',  right: '10%', size: 34 },
  { type: 'cross', top: '48%', right: '6%',  size: 26 },
  { type: 'cross', bottom: '12%', right: '12%', size: 30 },
  { type: 'cross', bottom: '28%', left: '8%',   size: 20 },
  /* Gráficos de barras */
  { type: 'bar',   bottom: '10%', left: '2%',   size: 40 },
  { type: 'bar',   top: '10%',    right: '3%',  size: 40 },
  /* Latido cardíaco */
  { type: 'heart', top: '30%',    left: '0%',   width: 80 },
  { type: 'heart', bottom: '20%', right: '1%',  width: 80 },
];

const COLOR = '#1a5f8a';

/**
 * Crea un SVG de cruz médica.
 * @param {number} size
 * @returns {string} SVG inline
 */
function svgCruz(size) {
  return `<svg style="width:${size}px;opacity:0.06" viewBox="0 0 24 24" fill="none"
    stroke="${COLOR}" stroke-width="2.5">
    <path d="M12 2v20M2 12h20"/>
  </svg>`;
}

/**
 * Crea un SVG de gráfico de barras.
 * @param {number} size
 * @returns {string} SVG inline
 */
function svgBarras(size) {
  return `<svg style="width:${size}px;opacity:0.05" viewBox="0 0 24 24" fill="${COLOR}">
    <rect x="3"  y="12" width="4" height="8"/>
    <rect x="10" y="8"  width="4" height="12"/>
    <rect x="17" y="4"  width="4" height="16"/>
  </svg>`;
}

/**
 * Crea un SVG de latido cardíaco.
 * @param {number} width
 * @returns {string} SVG inline
 */
function svgLatido(width) {
  return `<svg style="width:${width}px;opacity:0.05" viewBox="0 0 100 40" fill="none"
    stroke="${COLOR}" stroke-width="3">
    <polyline points="0,20 20,20 30,5 40,35 50,15 60,25 70,20 100,20"/>
  </svg>`;
}

/**
 * Convierte un objeto de posición en string de estilo CSS.
 * @param {object} dec
 * @returns {string}
 */
function posicionCSS(dec) {
  const props = ['top', 'bottom', 'left', 'right'];
  return props
    .filter(p => dec[p] !== undefined)
    .map(p => `${p}:${dec[p]}`)
    .join(';');
}

/**
 * Renderiza todos los elementos decorativos dentro del contenedor .bg-layer.
 */
function renderizarFondo() {
  const layer = document.querySelector('.bg-layer');
  if (!layer) return;

  const fragmento = document.createDocumentFragment();

  DECORACIONES.forEach(dec => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position:absolute;${posicionCSS(dec)}`;

    switch (dec.type) {
      case 'cross': wrapper.innerHTML = svgCruz(dec.size);  break;
      case 'bar':   wrapper.innerHTML = svgBarras(dec.size); break;
      case 'heart': wrapper.innerHTML = svgLatido(dec.width); break;
    }

    fragmento.appendChild(wrapper);
  });

  layer.appendChild(fragmento);
}

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', renderizarFondo);