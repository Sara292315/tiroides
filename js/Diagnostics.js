/**
 * diagnostics.js
 * Lógica de clasificación diagnóstica tiroidea.
 * Módulo puro: sin dependencias de DOM.
 *
 * Rangos de referencia:
 *   TSH : 0.4 – 4.0  mIU/L
 *   T4L : 0.8 – 1.8  ng/dL
 *   T3L : 2.3 – 4.2  pg/mL
 */

'use strict';

/* ── Helpers de rango ── */
const tshNormal  = v => v >= 0.4 && v <= 4.0;
const tshAlta    = v => v >  4.0;
const tshBaja    = v => v <  0.4;

const t4Normal   = v => v >= 0.8 && v <= 1.8;
const t4Baja     = v => v <  0.8;
const t4Alta     = v => v >  1.8;

const t3Normal   = v => v >= 2.3 && v <= 4.2;
const t3Baja     = v => v <  2.3;
const t3Alta     = v => v >  4.2;

/* ── Tabla de clasificaciones ── */
const CLASIFICACIONES = [
  {
    id   : 'normal',
    lbl  : 'DIAGNÓSTICO: NORMAL',
    name : 'Eutiroideo (Función Normal)',
    desc : 'TSH, T4 libre y T3 libre dentro de rangos de referencia. Eje hipotálamo-hipófisis-tiroides funcionando correctamente.',
    cls  : 'dx-normal',
    test : (tsh, t4, t3) => tshNormal(tsh) && t4Normal(t4) && t3Normal(t3),
  },
  {
    id   : 'hypo1',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipotiroidismo Primario',
    desc : 'TSH elevada (frecuente >10) + T4 libre baja. Falla de la glándula tiroides. Causas: Tiroiditis de Hashimoto, déficit de yodo, post-tiroidectomía.',
    cls  : 'dx-hypo',
    test : (tsh, t4 /*, t3 */) => tshAlta(tsh) && t4Baja(t4),
  },
  {
    id   : 'subhypo',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipotiroidismo Subclínico',
    desc : 'TSH elevada con T4 libre y T3 libre normales. Disfunción tiroidea leve/compensada. Controlar cada 6–12 meses.',
    cls  : 'dx-subhypo',
    test : (tsh, t4, t3) => tshAlta(tsh) && t4Normal(t4) && t3Normal(t3),
  },
  {
    id   : 'hyper1',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipertiroidismo Primario',
    desc : 'TSH suprimida (frecuente <0.1) + T4 libre y T3 libre elevadas. Causas: Enfermedad de Graves, bocio multinodular tóxico.',
    cls  : 'dx-hyper',
    test : (tsh, t4, t3) => tshBaja(tsh) && t4Alta(t4) && t3Alta(t3),
  },
  {
    id   : 'subhyper',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipertiroidismo Subclínico',
    desc : 'TSH suprimida con T4 libre y T3 libre normales. Riesgo de fibrilación auricular y osteoporosis a largo plazo. Control periódico.',
    cls  : 'dx-subhyper',
    test : (tsh, t4, t3) => tshBaja(tsh) && t4Normal(t4) && t3Normal(t3),
  },
  {
    id   : 'hypoC',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipotiroidismo Central',
    desc : 'TSH baja/inapropiadamente normal + T4 libre baja + T3 libre baja. Falla hipofisaria o hipotalámica (ej. panhipopituitarismo, craneofaringioma). Evaluar RMN hipofisaria.',
    cls  : 'dx-hypoC',
    test : (tsh, t4, t3) => (tshBaja(tsh) || tshNormal(tsh)) && t4Baja(t4) && t3Baja(t3),
  },
  {
    id   : 'hyperC',
    lbl  : 'DIAGNÓSTICO:',
    name : 'Hipertiroidismo Central (TSHoma)',
    desc : 'TSH inapropiadamente alta/normal + T4 libre y T3 libre elevadas. Adenoma hipofisario productor de TSH (muy raro). Requiere RMN hipofisaria urgente.',
    cls  : 'dx-hyperC',
    test : (tsh, t4, t3) => (tshAlta(tsh) || tshNormal(tsh)) && t4Alta(t4) && t3Alta(t3),
  },
];

/** Fallback cuando ningún patrón coincide */
const DX_INDETERMINADO = {
  id   : 'mixed',
  lbl  : 'DIAGNÓSTICO:',
  name : 'Perfil Mixto / Indeterminado',
  desc : 'Los valores no corresponden a un patrón clásico. Posibles causas: síndrome del enfermo eutiroideo (sick euthyroid), interferencia de anticuerpos anti-TSH, o valores en zona limítrofe. Correlacionar clínicamente.',
  cls  : 'dx-error',
};

/**
 * Evalúa el perfil hormonal y devuelve el objeto de diagnóstico.
 * @param {number} tsh  – TSH en mIU/L
 * @param {number} t4   – T4 libre en ng/dL
 * @param {number} t3   – T3 libre en pg/mL
 * @returns {{ id, lbl, name, desc, cls }}
 */
function clasificar(tsh, t4, t3) {
  const match = CLASIFICACIONES.find(dx => dx.test(tsh, t4, t3));
  return match || DX_INDETERMINADO;
}

/**
 * Valida que los tres valores sean números finitos ≥ 0.
 * @param {number} tsh
 * @param {number} t4
 * @param {number} t3
 * @returns {boolean}
 */
function validarEntrada(tsh, t4, t3) {
  return [tsh, t4, t3].every(v => Number.isFinite(v) && v >= 0);
}