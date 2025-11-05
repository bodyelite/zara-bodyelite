import { guardarContexto, obtenerContexto } from "./memoria.js";
import { datos } from "./base_conocimiento.js";

/* ============================================================
   MOTOR ZARA REAL CONTEXTUAL AVANZADO — EMPÁTICO + INTENCIONAL
   ============================================================ */

function recordarCategoria(usuario, texto) {
  const previo = obtenerContexto(usuario);
  const t = texto.toLowerCase();

  if (
    previo &&
    (t.includes("cuanto") ||
      t.includes("duele") ||
      t.includes("vale") ||
      t.includes("gratis") ||
      t.includes("resultados"))
  ) return previo;

  let categoria = "general";
  if (t.match(/botox|toxina|arruga|relleno|face|facial|papada|piel|mancha|cutis|ojera|frente|mentón/))
    categoria = "facial";
  else if (t.match(/grasa|abdomen|guata|barriga|rollitos|cintura|flacidez|gluteo|glúteo|trasero|poto|cola|nalgas|pompis|muslo|pierna|brazos|espalda|tonificar|levantar|moldear|reducir|fitness|body/))
    categoria = "corporal";
  else if (t.match(/pink|exosoma|plasma|prp|bioestimulante|regenerativo|revitalizar|brillo|luminosidad/))
    categoria = "regenerativo";

  guardarContexto(usuario, categoria);
  return categoria;
}

function detectarIntencion(texto) {
  const t = texto.toLowerCase();
  if (t.match(/reducir|bajar|adelgazar|grasa|rollitos|celulitis/)) return "reductivo";
  if (t.match(/tonificar|firme|fitness|definir|marcar|tensar/)) return "tonificar";
  if (t.match(/levantar|gluteo|glúteo|trasero|cola|poto|nalgas|push/)) return "gluteos";
  if (t.match(/rejuvenecer|arruga|piel|luminosidad|antiage/)) return "rejuvenecer";
  return null;
}

/* ============================================================
   RESPUESTAS EMPÁTICAS BASE
   ============================================================ */
function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("hola") || t.includes("buenas"))
    return "✨ Hola 💛 soy Zara de Body Elite. Qué gusto saludarte, cuéntame qué te gustaría mejorar o conseguir para orientarte mejor.";
  if (t.includes("gracias"))
    return "😊 Me alegra ayudarte. Si quieres, te muestro los tratamientos ideales según tu objetivo 💫";
  if (t.includes("quiero") && t.includes("info"))
    return "💬 Claro, cuéntame un poco qué zona o resultado buscas para darte opciones adecuadas.";
  return null;
}

function responderObjecion(texto) {
  const t = texto.toLowerCase();
  if (t.match(/caro|precio alto|vale mucho/))
    return "💬 Entiendo lo que sientes; los valores reflejan tecnología y resultados reales sin cirugía. Y la evaluación es gratuita 😉";
  if (t.match(/duele|dolor|molesta/))
    return "🌿 No te preocupes, son tratamientos cómodos y no invasivos. Puedes sentir un leve calor o contracción suave según la tecnología.";
  return null;
}

function responderCurioso(texto) {
  const t = texto.toLowerCase();
  if (t.match(/cuánto|valor|precio/))
    return "💰 Los planes faciales comienzan desde $120.000 y los corporales desde $348.800. Todos incluyen diagnóstico gratuito con IA y profesional clínico.";
  if (t.match(/dónde|ubicación|dirección/))
    return "📍 Estamos en Av. Las Perdices N° 2990, Local 23 · Peñalolén · Lunes a Viernes 9:30–20:00 · Sábado 9:30–13:00.";
  if (t.match(/certificado|médico|doctor/))
    return "⚕️ Nuestro equipo es clínico y trabajamos con equipos certificados por ISP y ANMAT.";
  return null;
}

/* ============================================================
   MOTOR PRINCIPAL
   ============================================================ */
export function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

  const emp = responderEmpatico(texto);
  if (emp) return emp;

  const obj = responderObjecion(texto);
  if (obj) return obj + "\n📅 ¿Te coordino tu evaluación gratuita? 👉 " + datos.info.agendar;

  const cur = responderCurioso(texto);
  if (cur) return cur + "\n📅 Agenda aquí 👉 " + datos.info.agendar;

  const categoria = recordarCategoria(usuario, texto);
  const intencion = detectarIntencion(texto);

  // --- Respuestas personalizadas según intención ---
  if (categoria === "corporal") {
    if (intencion === "gluteos") {
      return [
        "🍑 Me encanta ese objetivo. Para levantar y reafirmar glúteos trabajamos con **Push Up** y **Body Fitness**.",
        "Push Up combina Prosculpt + RF para volumen y firmeza. Body Fitness usa EMS Sculptor para tono y fuerza.",
        "💰 Valores entre $360.000 – $376.000. Incluyen diagnóstico gratuito y acompañamiento clínico.",
        "📅 Te ayudo a coordinar tu valoración sin costo 👉 " + datos.info.agendar
      ].join("\n");
    }
    if (intencion === "reductivo") {
      return [
        "💪 Perfecto, si tu objetivo es reducir grasa o moldear el cuerpo, te recomiendo **Lipo Reductiva**, **Lipo Body Elite** o **Lipo Express**.",
        "Combinan HIFU 12D + Cavitación + Radiofrecuencia para reducir volumen y tensar la piel sin cirugía.",
        "💰 Valores $432.000 – $664.000. Incluyen evaluación y control clínico.",
        "📅 Agenda tu evaluación corporal aquí 👉 " + datos.info.agendar
      ].join("\n");
    }
    if (intencion === "tonificar") {
      return [
        "💫 Excelente meta. Para tonificar y definir trabajamos con **Body Fitness** y **Body Tensor**.",
        "Usamos EMS Sculptor (20 000 contracciones/30 min) y Radiofrecuencia reafirmante.",
        "💰 Valores $232.000 – $360.000. Incluyen diagnóstico sin costo.",
        "📅 ¿Agendamos tu evaluación corporal? 👉 " + datos.info.agendar
      ].join("\n");
    }
  }

  if (categoria === "facial" && intencion === "rejuvenecer") {
    return [
      "🌸 Perfecto, para rejuvenecer y atenuar líneas trabajamos con **Face Antiage**, **Face Elite** o **Full Face**.",
      "Combinan HIFU 12D, RF, Pink Glow y Toxina Botulínica según tu diagnóstico.",
      "💰 Valores $281.600 – $584.000.",
      "📅 Agenda tu diagnóstico facial aquí 👉 " + datos.info.agendar
    ].join("\n");
  }

  // --- Respuesta general empática ---
  let resp = "✨ ";
  if (categoria === "facial")
    resp += "Podemos trabajar tu rejuvenecimiento con protocolos como Face Antiage o Face Elite. Resultados naturales y sin cirugía.";
  else if (categoria === "corporal")
    resp += "Podemos ayudarte a lograr el cuerpo que deseas con planes como Lipo Body Elite o Body Fitness, según tu diagnóstico.";
  else if (categoria === "regenerativo")
    resp += "Los tratamientos regenerativos como Pink Glow o Exosomas mejoran textura y luminosidad progresivamente.";
  else
    resp += "Tenemos planes faciales y corporales con tecnología avanzada HIFU 12D, RF y EMS Sculptor.";

  resp += "\n💰 Valores desde $120.000. Incluye diagnóstico gratuito con IA y profesional clínico.";
  resp += "\n📅 Agenda aquí 👉 " + datos.info.agendar;
  return resp;
}

export default { procesarMensaje };
