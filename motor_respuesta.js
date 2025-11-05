import { guardarContexto, obtenerContexto } from "./memoria.js";
import { datos } from "./base_conocimiento.js";

/* ============================================================
   MOTOR RESPUESTA ZARA 2.1 — FINAL COMPATIBLE CON RENDER
   ============================================================ */

function recordarCategoria(usuario, texto) {
  const previo = obtenerContexto(usuario);
  const lower = texto.toLowerCase();
  if (
    previo &&
    (lower.includes("cuanto") ||
      lower.includes("duele") ||
      lower.includes("vale") ||
      lower.includes("gratis") ||
      lower.includes("certificados") ||
      lower.includes("resultados"))
  )
    return previo;

  let categoria = "general";
  if (lower.match(/botox|toxina|arruga|relleno|face|facial|papada|codigo|código/))
    categoria = "facial";
  else if (lower.match(/grasa|abdomen|gluteo|glúteo|muslo|celulitis|cintura|lipo|body|brazos|espalda/))
    categoria = "corporal";
  else if (lower.match(/pink|exosoma|exosomas|plasma|prp|regenerativo|bioestimulante/))
    categoria = "regenerativo";

  guardarContexto(usuario, categoria);
  return categoria;
}

function planRecomendado(categoria) {
  switch (categoria) {
    case "facial":
      return {
        nombre: "Face Antiage / Face Elite / Full Face",
        descripcion:
          "Combinan HIFU 12D, RF, Pink Glow y Toxina Botulínica para rejuvenecer rostro y cuello.",
        precio: "$281.600 – $584.000",
        cta: "diagnóstico facial",
      };
    case "corporal":
      return {
        nombre: "Lipo Reductiva / Lipo Body Elite / Body Fitness",
        descripcion:
          "Integran Cavitación, Radiofrecuencia y EMS Sculptor para reducir grasa y tonificar músculo.",
        precio: "$360.000 – $664.000",
        cta: "evaluación corporal",
      };
    case "regenerativo":
      return {
        nombre: "Pink Glow / Exosomas (según evaluación)",
        descripcion:
          "Biorevitalización con péptidos y antioxidantes para mejorar textura e hidratación.",
        precio: "$198.400 – $281.600",
        cta: "valoración regenerativa",
      };
    default:
      return {
        nombre: "Planes Body Elite",
        descripcion:
          "Protocolos faciales y corporales con HIFU 12D, RF, EMS Sculptor y Pink Glow.",
        precio: "desde $120.000",
        cta: "evaluación gratuita",
      };
  }
}

function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("hola"))
    return "👋 ¡Hola! Soy Zara IA de Body Elite. ¿Cómo estás hoy?";
  if (t.includes("gracias"))
    return "✨ Encantada de ayudarte. ¿Quieres que te muestre los planes disponibles?";
  return null;
}

function responderObjecion(texto) {
  const t = texto.toLowerCase();
  if (t.match(/caro|precio alto|vale mucho/))
    return "💬 Entiendo tu punto. Nuestros valores reflejan la tecnología y los resultados reales sin cirugía.";
  if (t.match(/duele|dolor|molesta/))
    return "😊 Son tratamientos cómodos y no invasivos. Puedes sentir leve calor o contracción suave según la tecnología aplicada.";
  return null;
}

function responderCurioso(texto) {
  const t = texto.toLowerCase();
  if (t.match(/cuánto|valor|precio/))
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito con IA.";
  if (t.match(/dónde están|ubicación|dirección/))
    return "📍 Estamos en Av. Las Perdices N°2990, Local 23, Peñalolén. Lunes a Viernes 9:30–20:00 · Sábado 9:30–13:00.";
  if (t.match(/certificado|médico|doctor/))
    return "⚕️ Contamos con equipo médico y productos certificados por ISP y ANMAT.";
  if (t.match(/duele|dolor|molesta/))
    return "😊 No duele. Tratamientos cómodos y no invasivos.";
  return null;
}

/* ====== RESPUESTA PRINCIPAL ====== */
export function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

  const emp = responderEmpatico(texto);
  if (emp) return emp + "\n📅 ¿Quieres coordinar tu evaluación gratuita? " + datos.info.agendar;

  const obj = responderObjecion(texto);
  if (obj) return obj + "\n💬 Puedo mostrarte alternativas según tu objetivo. 👉 " + datos.info.agendar;

  const cur = responderCurioso(texto);
  if (cur) return cur + "\n📅 Agenda tu evaluación gratuita aquí 👉 " + datos.info.agendar;

  const categoria = recordarCategoria(usuario, texto);
  const plan = planRecomendado(categoria);

  let resp = "✨ ";
  if (categoria === "facial")
    resp += `Para rejuvenecer y atenuar líneas, te recomiendo ${plan.nombre}. ${plan.descripcion}`;
  else if (categoria === "corporal")
    resp += `Para moldear y reducir grasa, te recomiendo ${plan.nombre}. ${plan.descripcion}`;
  else if (categoria === "regenerativo")
    resp += `Podemos trabajar con ${plan.nombre}. ${plan.descripcion}`;
  else resp += plan.descripcion;

  resp += "\n💰 Valores " + plan.precio + ". Incluye diagnóstico gratuito con IA y profesional clínico.";
  resp += "\n📅 Agenda tu " + plan.cta + " aquí 👉 " + datos.info.agendar;
  return resp;
}
