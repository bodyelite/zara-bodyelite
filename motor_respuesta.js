import { guardarContexto, obtenerContexto } from "./memoria.js";
import { datos } from "./base_conocimiento.js";

/* ============================================================
   MOTOR ZARA REAL FINAL v2 — CONTEXTUAL + MEMORIA + PRECIO
   ============================================================ */

let ultimoTema = {};

/* ============================================================
   CLASIFICACIÓN
   ============================================================ */
function recordarCategoria(usuario, texto) {
  const previo = obtenerContexto(usuario);
  const t = texto.toLowerCase();

  if (
    previo &&
    (t.includes("cuanto") ||
      t.includes("duele") ||
      t.includes("vale") ||
      t.includes("precio"))
  ) return previo;

  let categoria = "general";
  if (t.match(/botox|toxina|arruga|relleno|face|facial|papada|piel|mancha|cutis|ojera|frente|mentón/))
    categoria = "facial";
  else if (t.match(/grasa|abdomen|rollitos|cintura|flacidez|gluteo|glúteo|trasero|poto|cola|nalgas|pierna|brazos|espalda|tonificar|levantar|reducir|body/))
    categoria = "corporal";
  else if (t.match(/pink|exosoma|plasma|prp|bioestimulante|regenerativo|luminosidad/))
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
   BLOQUES BASE
   ============================================================ */
function responderEmpatico(usuario, texto) {
  const contexto = obtenerContexto(usuario);
  const t = texto.toLowerCase();
  if (!contexto && (t.includes("hola") || t.includes("buenas") || t.includes("ola")))
    return "✨ Hola 💛 soy Zara de Body Elite. Qué gusto saludarte, cuéntame qué te gustaría mejorar o conseguir para orientarte mejor.";
  return null;
}

function responderObjecion(texto) {
  const t = texto.toLowerCase();
  if (t.match(/caro|precio alto|vale mucho/))
    return "💬 Entiendo tu punto, nuestros valores reflejan tecnología avanzada y resultados reales sin cirugía. La evaluación es sin costo 😉";
  if (t.match(/duele|dolor|molesta/))
    return "🌿 Son tratamientos cómodos y no invasivos. Solo puedes sentir un leve calor o contracción suave según la tecnología.";
  return null;
}

function responderCurioso(usuario, texto) {
  const t = texto.toLowerCase();

  // Contextualización de “cuánto vale”
  if (t.match(/cuánto|valor|precio|vale/)) {
    const ultimo = ultimoTema[usuario];
    if (ultimo === "botox")
      return "💉 La aplicación de Toxina Botulínica está incluida en **Face Antiage**, **Face Elite** y **Full Face**. Valores entre $281.600 y $584.000 según zonas tratadas.\n📅 Agenda tu diagnóstico gratuito 👉 " + datos.info.agendar;
    if (ultimo === "hifu")
      return "💎 El **HIFU 12D** forma parte de **Lipo Body Elite** y **Face Elite**, con valores entre $520.000 y $664.000 según el área.\n📅 Agenda tu evaluación 👉 " + datos.info.agendar;
    if (ultimo === "pushup" || ultimo === "gluteos")
      return "🍑 El plan **Push Up Body Fitness** tiene valores entre $360.000 y $376.000. Incluye diagnóstico sin costo.\n📅 Agenda aquí 👉 " + datos.info.agendar;
    if (ultimo === "pinkglow")
      return "🌸 **Pink Glow** está en planes **Face Smart**, **Face Inicia** y **Face Elite**. Valores desde $198.400.\n📅 Agenda tu diagnóstico facial 👉 " + datos.info.agendar;
    // si no hay último tema, respuesta genérica
    return "💰 Los planes faciales comienzan desde $120.000 y los corporales desde $348.800. Incluyen diagnóstico gratuito con IA y profesional clínico.";
  }

  if (t.match(/donde|ubicacion|direccion|peñalolen|parte|cerca|quedan/))
    return "📍 Estamos en **Av. Las Perdices N° 2990, Local 23, Peñalolén**, cerca de Av. Tobalaba.\n🕒 Horario: Lun–Vie 9:30–20:00 · Sáb 9:30–13:00.\n📅 Agenda tu evaluación gratuita aquí 👉 " + datos.info.agendar;

  if (t.match(/certificado|médico|doctor|seremi|permiso/))
    return "⚕️ Nuestro centro cuenta con autorización sanitaria y profesionales clínicos acreditados. Trabajamos con equipos certificados por ISP y ANMAT.";

  return null;
}

function responderTecnologia(usuario, texto) {
  const t = texto.toLowerCase();
  if (t.match(/hifu/)) {
    ultimoTema[usuario] = "hifu";
    return "💎 Sí, usamos **HIFU 12D**, ultrasonido focalizado que actúa sobre grasa y fascia SMAS para tensar y definir. Forma parte de **Lipo Body Elite**, **Lipo Reductiva** y **Face Elite**.";
  }
  if (t.match(/cavitacion|cavitación/)) {
    ultimoTema[usuario] = "cavitacion";
    return "💠 Sí, aplicamos **Cavitación**, que rompe adipocitos mediante presión ultrasónica para eliminar grasa localizada. Está en **Lipo Reductiva** y **Lipo Body Elite**.";
  }
  if (t.match(/radiofrecuencia|rf/)) {
    ultimoTema[usuario] = "radiofrecuencia";
    return "🌡️ Sí, usamos **Radiofrecuencia**, que estimula colágeno I y III para reafirmar piel y mejorar textura. Está en **Body Tensor**, **Face Antiage** y **Face Elite**.";
  }
  if (t.match(/ems|sculptor|prosculpt/)) {
    ultimoTema[usuario] = "pushup";
    return "⚡ Exacto, usamos **EMS Sculptor Pro**, que genera contracciones supramáximas para tonificar y aumentar masa muscular. Está en **Body Fitness** y **Push Up**.";
  }
  if (t.match(/pink glow|pinkglow/)) {
    ultimoTema[usuario] = "pinkglow";
    return "🌸 Sí, **Pink Glow** es un bioestimulante con péptidos y antioxidantes que mejora luminosidad y regeneración. Forma parte de **Face Smart**, **Face Inicia**, **Face Elite** y **Full Face**.";
  }
  if (t.match(/exosoma|exosomas/)) {
    ultimoTema[usuario] = "exosomas";
    return "🧬 Sí, usamos **Exosomas**, regeneradores celulares que estimulan fibroblastos y colágeno IV. Se aplican junto a **Pink Glow** en protocolos regenerativos.";
  }
  if (t.match(/toxina|botox/)) {
    ultimoTema[usuario] = "botox";
    return "💉 Sí, aplicamos **Toxina Botulínica (Botox)** de forma clínica y segura. Se usa en **Face Antiage**, **Face Elite** y **Full Face** para suavizar arrugas.";
  }
  return null;
}

/* ============================================================
   MOTOR PRINCIPAL
   ============================================================ */
export function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

  const emp = responderEmpatico(usuario, texto);
  if (emp) return emp;

  const obj = responderObjecion(texto);
  if (obj) return obj + "\n📅 ¿Te coordino tu evaluación gratuita? 👉 " + datos.info.agendar;

  const tec = responderTecnologia(usuario, texto);
  if (tec) return tec + "\n📅 Agenda aquí 👉 " + datos.info.agendar;

  const cur = responderCurioso(usuario, texto);
  if (cur) return cur;

  const categoria = recordarCategoria(usuario, texto);
  const intencion = detectarIntencion(texto);

  if (categoria === "corporal" && intencion === "gluteos") {
    ultimoTema[usuario] = "gluteos";
    return "🍑 Me encanta ese objetivo. Para levantar y reafirmar glúteos trabajamos con **Push Up** y **Body Fitness**. Push Up combina Prosculpt + RF, mientras Body Fitness usa EMS Sculptor para tono y fuerza.\n💰 Valores entre $360.000 – $376.000. Incluyen diagnóstico gratuito.\n📅 Agenda tu valoración 👉 " + datos.info.agendar;
  }

  if (categoria === "corporal" && intencion === "reductivo") {
    ultimoTema[usuario] = "lipo";
    return "💪 Me encanta ese objetivo. Para reducir grasa o moldear el cuerpo te recomiendo **Lipo Reductiva** o **Lipo Body Elite**, con HIFU 12D, Cavitación y RF.\n💰 Valores $432.000 – $664.000. Incluyen diagnóstico y control clínico.\n📅 Agenda tu evaluación corporal 👉 " + datos.info.agendar;
  }

  if (categoria === "corporal" && intencion === "tonificar") {
    ultimoTema[usuario] = "bodyfitness";
    return "💫 Me encanta ese objetivo. Para tonificar y definir trabajamos con **Body Fitness** y **Body Tensor**. Usamos EMS Sculptor y Radiofrecuencia reafirmante.\n💰 Valores $232.000 – $360.000. Incluyen diagnóstico sin costo.\n📅 Agenda tu evaluación 👉 " + datos.info.agendar;
  }

  if (categoria === "facial" && intencion === "rejuvenecer") {
    ultimoTema[usuario] = "faceelite";
    return "🌸 Me encanta ese objetivo. Para rejuvenecer y atenuar líneas trabajamos con **Face Antiage**, **Face Elite** o **Full Face**, combinando HIFU 12D, RF, Pink Glow y Toxina Botulínica.\n💰 Valores $281.600 – $584.000.\n📅 Agenda tu diagnóstico facial 👉 " + datos.info.agendar;
  }

  // Fallback único
  return "💬 Disculpa, no logré entender tu pregunta, pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita 💛.\n📅 Agenda tu cita aquí 👉 " + datos.info.agendar;
}

export default { procesarMensaje };
