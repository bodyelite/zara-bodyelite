import { guardarContexto, obtenerContexto } from "./memoria.js";
import { datos } from "./base_conocimiento.js";

/* ============================================================
   MOTOR ZARA REAL FINAL — EMPÁTICO, TECNOLÓGICO Y ESTABLE
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
    return "💬 Entiendo tu punto, los valores reflejan tecnología avanzada y resultados reales sin cirugía. La evaluación es sin costo 😉";
  if (t.match(/duele|dolor|molesta/))
    return "🌿 Son tratamientos cómodos y no invasivos. Puedes sentir solo un leve calor o contracción suave según la tecnología.";
  return null;
}

function responderCurioso(texto) {
  const t = texto.toLowerCase();
  if (t.match(/cuánto|valor|precio/))
    return "💰 Los planes faciales comienzan desde $120.000 y los corporales desde $348.800. Todos incluyen diagnóstico gratuito con IA y profesional clínico.";
  if (t.match(/donde|ubicacion|ubicación|direccion|dirección|peñalolen|queda|parte|zona|cerca/))
    return "📍 Estamos en **Av. Las Perdices N°2990, Local 23, Peñalolén**, cerca de Av. Tobalaba.\n🕒 Horario: Lunes a Viernes 9:30–20:00 · Sábado 9:30–13:00.\n📅 Agenda tu evaluación gratuita aquí 👉 " + datos.info.agendar;
  if (t.match(/certificado|médico|doctor|seremi|permiso/))
    return "⚕️ Nuestro centro cuenta con autorización sanitaria y profesionales clínicos acreditados. Trabajamos con equipos certificados por ISP y ANMAT.";
  return null;
}

function responderTecnologia(texto) {
  const t = texto.toLowerCase();
  if (t.match(/hifu/))
    return "💎 Sí, trabajamos con **HIFU 12D**, ultrasonido focalizado que actúa sobre grasa y fascia SMAS para tensar y definir. Forma parte de **Lipo Body Elite**, **Lipo Reductiva** y **Face Elite**.";
  if (t.match(/cavitacion|cavitación/))
    return "💠 Sí, aplicamos **Cavitación**, que rompe adipocitos mediante presión ultrasónica para eliminar grasa localizada. Está en **Lipo Reductiva** y **Lipo Body Elite**.";
  if (t.match(/radiofrecuencia|rf/))
    return "🌡️ Sí, usamos **Radiofrecuencia**, que estimula colágeno I y III para reafirmar piel y mejorar textura. Está en **Body Tensor**, **Face Antiage** y **Face Elite**.";
  if (t.match(/ems|sculptor|prosculpt/))
    return "⚡ Exacto, usamos **EMS Sculptor Pro**, que genera contracciones supramáximas para tonificar y aumentar masa muscular. Está en **Body Fitness** y **Push Up**.";
  if (t.match(/pink glow|pinkglow/))
    return "🌸 Sí, **Pink Glow** es un bioestimulante con péptidos y antioxidantes que mejora luminosidad y regeneración. Forma parte de **Face Smart**, **Face Inicia**, **Face Elite** y **Full Face**.";
  if (t.match(/exosoma|exosomas/))
    return "🧬 Sí, usamos **Exosomas**, regeneradores celulares que estimulan fibroblastos y colágeno IV. Se aplican junto a **Pink Glow** en protocolos regenerativos.";
  if (t.match(/toxina|botox/))
    return "💉 Sí, aplicamos **Toxina Botulínica (Botox)** clínica y segura. Forma parte de **Face Antiage**, **Face Elite** y **Full Face** para suavizar arrugas.";
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

  const tec = responderTecnologia(texto);
  if (tec) return tec + "\n📅 Agenda aquí 👉 " + datos.info.agendar;

  const cur = responderCurioso(texto);
  if (cur) return cur;

  const categoria = recordarCategoria(usuario, texto);
  const intencion = detectarIntencion(texto);

  // --- Reacciones empáticas por intención ---
  if (categoria === "corporal" && intencion === "gluteos")
    return "🍑 Me encanta ese objetivo. Para levantar y reafirmar glúteos trabajamos con **Push Up** y **Body Fitness**. Push Up combina Prosculpt + RF, mientras Body Fitness utiliza EMS Sculptor para tono y fuerza.\n💰 Valores entre $360.000 – $376.000. Incluyen diagnóstico gratuito.\n📅 Agenda tu valoración 👉 " + datos.info.agendar;

  if (categoria === "corporal" && intencion === "reductivo")
    return "💪 Me encanta ese objetivo. Para reducir grasa o moldear el cuerpo, te recomiendo **Lipo Reductiva** o **Lipo Body Elite**, con HIFU 12D, Cavitación y RF.\n💰 Valores $432.000 – $664.000. Incluyen diagnóstico y control clínico.\n📅 Agenda tu evaluación corporal 👉 " + datos.info.agendar;

  if (categoria === "corporal" && intencion === "tonificar")
    return "💫 Me encanta ese objetivo. Para tonificar y definir trabajamos con **Body Fitness** y **Body Tensor**. Usamos EMS Sculptor y Radiofrecuencia reafirmante.\n💰 Valores $232.000 – $360.000. Incluyen diagnóstico sin costo.\n📅 Agenda tu evaluación corporal 👉 " + datos.info.agendar;

  if (categoria === "facial" && intencion === "rejuvenecer")
    return "🌸 Me encanta ese objetivo. Para rejuvenecer y atenuar líneas trabajamos con **Face Antiage**, **Face Elite** o **Full Face**, combinando HIFU 12D, RF, Pink Glow y Toxina Botulínica.\n💰 Valores $281.600 – $584.000.\n📅 Agenda tu diagnóstico facial 👉 " + datos.info.agendar;

  // --- Fallback amigable ---
  return "💬 Disculpa, no logré entender tu pregunta, pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita 💛.\n📅 Agenda tu cita aquí 👉 " + datos.info.agendar;
}

export default { procesarMensaje };
