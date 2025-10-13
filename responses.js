// responses.js
// Motor de respuestas con memoria y botón interactivo “Agenda Gratis ✳️”

import { buscarEnConocimiento, normalizarTexto } from "./entrenador.js";
import { clasificarIntencion } from "./intents.js";
import { obtenerContexto } from "./conversations.js";

// --------------------------
// DETECTOR DE CAMPAÑAS
// --------------------------
function detectarCampaña(texto) {
  const t = texto.toLowerCase();
  if (t.includes("push up") || t.includes("gluteo")) return "Push Up";
  if (t.includes("lipo")) return "Lipo";
  if (t.includes("hifu")) return "HIFU";
  if (t.includes("face") || t.includes("facial")) return "Face Elite";
  if (t.includes("acne") || t.includes("antiacne")) return "Face Antiacné";
  if (t.includes("depilacion")) return "Depilación Láser";
  if (t.includes("fb.me") || t.includes("instagram.com")) return "Anuncio Meta";
  return null;
}

// --------------------------
// RESPUESTA PRINCIPAL
// --------------------------
export async function generarRespuesta(textoOriginal, data, contextoPrevio) {
  const texto = normalizarTexto(textoOriginal);
  const intencion = clasificarIntencion(texto);
  const resultados = buscarEnConocimiento(texto);
  const campaña = detectarCampaña(texto);
  const nombre = "Zara – Asistente Body Elite";

  const ultimaCampaña = contextoPrevio?.ultimaCampaña || null;
  const campañaActual = campaña || ultimaCampaña;

  // 1. Conocimiento directo
  if (resultados.length > 0) {
    const match = resultados[0];
    return `${match.value}`;
  }

  // 2. Interés o continuidad de promoción
  if (intencion === "interes_promo" || campañaActual) {
    const plan = campañaActual || "la promoción";
    return `Nuestra promoción ${plan} incluye diagnóstico y asesoría gratuita con especialistas. 💙\n\n✳️ Agenda Gratis acá`;
  }

  // 3. Intenciones generales
  switch (intencion) {
    case "saludo":
      return `Hola 👋, soy ${nombre}. Puedo ayudarte a conocer tratamientos, precios o agendar tu evaluación gratuita.\n✳️ Agenda Gratis acá`;

    case "agenda":
      return `Puedes agendar fácilmente tu hora ✳️ Agenda Gratis acá\nIncluye diagnóstico con FitDays y asesoría personalizada.`;

    case "precios":
      return `💰 Valores aproximados:\n- Lipo Body Elite $664.000\n- Face Elite $358.400\n- Limpieza Facial Full $120.000\nTodos incluyen diagnóstico gratuito.\n✳️ Agenda Gratis acá`;

    case "diagnostico":
      return `Tu diagnóstico es gratuito y sin compromiso, con evaluación corporal o facial según tu objetivo.\n✳️ Agenda Gratis acá`;

    case "ubicacion":
      return `📍 Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Lun–Vie 9:30–20:00 | Sáb 9:30–13:00\n✳️ Agenda Gratis acá`;

    case "despedida":
      return `Gracias por contactar a Body Elite 💙\n✳️ Agenda Gratis acá`;

    default:
      return `Puedo ayudarte a conocer promociones, precios o agendar tu diagnóstico gratuito.\n✳️ Agenda Gratis acá`;
  }
}

export default { generarRespuesta };
