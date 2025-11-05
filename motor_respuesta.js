import { guardarContexto, obtenerContexto } from "./memoria.js";
import { datos } from "./base_conocimiento.js";

/* ============================================================
   MOTOR ZARA REAL CONTEXTUAL AVANZADO + TECNOLOGÍAS
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

/* ============================================================
   DETECCIÓN DE TECNOLOGÍAS
   ============================================================ */
function responderTecnologia(texto) {
  const t = texto.toLowerCase();

  if (t.match(/hifu/))
    return "💎 Sí, trabajamos con **HIFU 12D**, ultrasonido focalizado que actúa sobre grasa subcutánea y fascia SMAS para tensar y definir. Forma parte de planes como **Lipo Body Elite**, **Lipo Reductiva** y **Face Elite**.\n📅 Agenda tu diagnóstico gratuito 👉 " + datos.info.agendar;

  if (t.match(/cavitacion|cavitación/))
    return "💠 Sí, aplicamos **Cavitación**, que rompe adipocitos mediante presión ultrasónica para eliminar grasa localizada. Está presente en planes **Lipo Reductiva**, **Lipo Focalizada Reductiva** y **Lipo Body Elite**.\n📅 Agenda tu evaluación corporal aquí 👉 " + datos.info.agendar;

  if (t.match(/radiofrecuencia|rf/))
    return "🌡️ Sí, usamos **Radiofrecuencia**, que estimula colágeno I y III para reafirmar piel y mejorar textura. Incluida en **Body Tensor**, **Face Antiage**, **Face Elite** y todos los planes corporales.\n📅 Agenda tu diagnóstico sin costo 👉 " + datos.info.agendar;

  if (t.match(/ems|sculptor|prosculpt/))
    return "⚡ Exacto, usamos **EMS Sculptor Pro**, que provoca contracciones musculares supramáximas (20 000 / 30 min) para tonificar y aumentar masa muscular. Incluido en **Body Fitness** y **Push Up**.\n📅 Agenda tu valoración 👉 " + datos.info.agendar;

  if (t.match(/pink glow|pinkglow/))
    return "🌸 Sí, **Pink Glow** es un bioestimulante con péptidos y antioxidantes que mejora luminosidad y regeneración. Forma parte de **Face Smart**, **Face Inicia**, **Face Elite** y **Full Face**.\n📅 Agenda tu diagnóstico facial 👉 " + datos.info.agendar;

  if (t.match(/exosoma|exosomas/))
    return "🧬 Sí, aplicamos **Exosomas**, regeneradores celulares que estimulan fibroblastos y colágeno IV. Se utilizan en protocolos regenerativos avanzados junto a **Pink Glow**.\n📅 Agenda tu valoración regenerativa 👉 " + datos.info.agendar;

  if (t.match(/toxina|botox/))
    return "💉 Sí, aplicamos **Toxina Botulínica (Botox)** de forma clínica y segura. Se usa en **Face Antiage**, **Face Elite** y **Full Face** para suavizar arrugas y relajar músculos de expresión.\n📅 Agenda tu diagnóstico facial 👉 " + datos.info.agendar;

  return null;
}

/* ============================================================
   MOTOR PRINCIPAL
   ============================================================ */
export function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

  // 1. empatía, objeción o pregunta directa
  const emp = responderEmpatico(texto);
  if (emp) return emp;

  const obj = responderObjecion(texto);
  if (obj) return obj + "\n📅 ¿Te coordino tu evaluación gratuita? 👉 " + datos.info.agendar;

  // 2. tecnologías específicas
  const tec = responderTecnologia(texto);
  if (tec) return tec;

  // 3. ubicación ampliada
  if (t.match(/donde|ubicacion|dirección|peñalolen|mapa|quedan|centro|local/))
    return "📍 Estamos en **Av. Las Perdices N° 2990, Local 23, Peñalolén**. Muy cerca de Av. Tobalaba.\n🕒 Horario: Lunes a Viernes 9:30 – 20:00 · Sábado 9:30 – 13:00.\n📅 Puedes agendar directamente aquí 👉 " + datos.info.agendar;

  // 4. curiosidad o intención general
  const cur = responderCurioso(texto);
  if (cur) return cur + "\n📅 Agenda aquí 👉 " + datos.info.agendar;

  // 5. intención corporal/facial general
  const categoria = recordarCategoria(usuario, texto);
  const intencion = detectarIntencion(texto);

  if (categoria === "corporal" && intencion === "gluteos") {
    return [
      "🍑 Me encanta ese objetivo. Para levantar y reafirmar glúteos trabajamos con **Push Up** y **Body Fitness**.",
      "Push Up combina Prosculpt + RF para firmeza, y Body Fitness utiliza EMS Sculptor para tono y fuerza.",
      "💰 Valores entre $360.000 – $376.000. Incluyen diagnóstico gratuito y acompañamiento clínico.",
      "📅 Agenda tu valoración sin costo 👉 " + datos.info.agendar
    ].join("\n");
  }

  if (categoria === "corporal" && intencion === "reductivo") {
    return [
      "💪 Perfecto, si buscas reducir grasa o moldear tu cuerpo te recomiendo **Lipo Reductiva**, **Lipo Body Elite** o **Lipo Express**.",
      "Usamos HIFU 12D + Cavitación + Radiofrecuencia para resultados visibles desde las primeras sesiones.",
      "💰 Valores $432.000 – $664.000. Incluyen evaluación y control clínico.",
      "📅 Agenda tu evaluación corporal aquí 👉 " + datos.info.agendar
    ].join("\n");
  }

  if (categoria === "corporal" && intencion === "tonificar") {
    return [
      "💫 Excelente meta. Para tonificar y definir trabajamos con **Body Fitness** y **Body Tensor**.",
      "Usamos EMS Sculptor (20 000 contracciones / 30 min) y Radiofrecuencia reafirmante.",
      "💰 Valores $232.000 – $360.000. Incluyen diagnóstico sin costo.",
      "📅 ¿Agendamos tu evaluación corporal? 👉 " + datos.info.agendar
    ].join("\n");
  }

  if (categoria === "facial" && intencion === "rejuvenecer") {
    return [
      "🌸 Perfecto, para rejuvenecer y atenuar líneas trabajamos con **Face Antiage**, **Face Elite** o **Full Face**.",
      "Combinan HIFU 12D, RF, Pink Glow y Toxina Botulínica según tu diagnóstico.",
      "💰 Valores $281.600 – $584.000.",
      "📅 Agenda tu diagnóstico facial aquí 👉 " + datos.info.agendar
    ].join("\n");
  }

  // 6. respuesta general empática
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
