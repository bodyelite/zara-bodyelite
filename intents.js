import { analizarTexto } from "./comprension.js";

export function detectarIntencion(texto) {
  const msg = analizarTexto(texto);

  if (/(hola|buenas|ola)/.test(msg)) return "saludo";
  if (/(precio|valor|costo|cuanto sale|vale)/.test(msg)) return "precio";
  if (/(duel|molesta|dolor)/.test(msg)) return "dolor";
  if (/(tiempo|duracion|minutos)/.test(msg)) return "duracion";
  if (/(resultado|efecto|cuanto demora|cuantas sesiones)/.test(msg)) return "resultados";
  if (/(promo|promocion|oferta|descuento|gratis)/.test(msg)) return "promocion";
  if (/(facial|rostro|cara|hifu|toxina|radiofrecuencia)/.test(msg)) return "facial";
  if (/(lipo|abdomen|cintura|celulitis|sculptor|body)/.test(msg)) return "corporal";
  if (/(agenda|agendar|reserva|diagnostico)/.test(msg)) return "agendar";

  return "general";
}
