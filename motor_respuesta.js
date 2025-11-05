import datos from "./base_conocimiento.js";
import { guardarContexto, obtenerContexto } from "./memoria.js";

// ====== FUNCIÓN PRINCIPAL ======
export function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

  let categoria = detectarCategoria(t);
  if (!categoria) categoria = obtenerContexto(usuario);

  guardarContexto(usuario, categoria);

  switch (categoria) {
    case "facial":
      return responderFacial(t);
    case "corporal":
      return responderCorporal(t);
    case "regenerativo":
      return responderRegenerativo(t);
    default:
      return responderGeneral(t);
  }
}

// ====== DETECCIÓN DE CATEGORÍA ======
function detectarCategoria(t) {
  if (t.match(/botox|toxina|arruga|relleno|face|facial|papada/)) return "facial";
  if (t.match(/grasa|abdomen|lipo|body|celulitis|glúteo|muslo|cintura/)) return "corporal";
  if (t.match(/plasma|exosoma|prp|regenerativo|bioestimulante/)) return "regenerativo";
  return null;
}

// ====== RESPUESTAS POR CATEGORÍA ======
function responderFacial(t) {
  return "✨ Protocolos faciales con HIFU 12D, RF, EMS y Pink Glow. Incluye diagnóstico gratuito con IA.";
}

function responderCorporal(t) {
  return "💪 Tratamientos corporales con EMS Sculptor, HIFU 12D y Cavitación. Resultados visibles desde la primera sesión.";
}

function responderRegenerativo(t) {
  return "🌿 Protocolos regenerativos con Exosomas y Plasma PRP. Estimulan colágeno y revitalizan la piel en profundidad.";
}

function responderGeneral(t) {
  return "😊 Podemos agendar tu evaluación gratuita con IA para definir el mejor plan. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

export default procesarMensaje;
