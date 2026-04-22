/**
 * ui.js
 * Controlador de interfaz de usuario.
 * Separa la lógica de presentación de la lógica de negocio (diagnostics.js).
 */

'use strict';

/* ── Selección de elementos del DOM ── */
const CAMPOS = {
  tsh  : document.getElementById('tsh'),
  t4   : document.getElementById('t4'),
  t3   : document.getElementById('t3'),
};

const RESULTADO = {
  box  : document.getElementById('rbox'),
  lbl  : document.getElementById('rlbl'),
  name : document.getElementById('rname'),
  desc : document.getElementById('rdesc'),
};

/* ── Diagnóstico de error de entrada ── */
const DX_ERROR_ENTRADA = {
  lbl  : 'ERROR',
  name : 'Valores inválidos',
  desc : 'Por favor ingresa valores numéricos positivos en los tres campos.',
  cls  : 'dx-error',
};

/**
 * Lee y parsea el valor de un campo de entrada.
 * @param {HTMLInputElement} input
 * @returns {number}
 */
function leerCampo(input) {
  return parseFloat(input.value);
}

/**
 * Muestra el resultado en el panel con animación.
 * @param {{ lbl, name, desc, cls }} dx
 */
function mostrarResultado(dx) {
  const { box, lbl, name, desc } = RESULTADO;

  /* Animación: ocultar → actualizar → mostrar */
  box.classList.remove('visible');
  box.classList.add('hidden');

  setTimeout(() => {
    /* Limpiar clases dx-* anteriores, conservar base */
    box.className = `result-box hidden ${dx.cls}`;
    lbl.textContent  = dx.lbl;
    name.textContent = dx.name;
    desc.textContent = dx.desc;

    /* Doble rAF para garantizar re-paint antes de la transición */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        box.classList.remove('hidden');
        box.classList.add('visible');
      })
    );
  }, 120);
}

/**
 * Handler principal del botón "Calcular".
 * Orquesta lectura → validación → clasificación → presentación.
 */
function calcular() {
  const tsh = leerCampo(CAMPOS.tsh);
  const t4  = leerCampo(CAMPOS.t4);
  const t3  = leerCampo(CAMPOS.t3);

  if (!validarEntrada(tsh, t4, t3)) {
    mostrarResultado(DX_ERROR_ENTRADA);
    return;
  }

  const dx = clasificar(tsh, t4, t3);
  mostrarResultado(dx);
}

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Calcular con los valores por defecto al cargar */
  calcular();

  /* Permitir Enter en cualquier campo */
  Object.values(CAMPOS).forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcular();
    });
  });
});