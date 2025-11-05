/* ============================================================
   MOTOR RESPUESTA ZARA 2.1 — CONSOLIDADO FINAL
   ============================================================ */

import datos from "./base_conocimiento.js";

/* ====== CONTEXTO CONVERSACIONAL ====== */
function detectarCategoria(texto) {
  const t = texto.toLowerCase();
  if (t.match(/botox|toxina|arruga|relleno|face|facial|papada|codigo|código/i))
    return "facial";
  if (t.match(/grasa|abdomen|gluteo|glúteo|muslo|celulitis|cintura|lipo|body|brazos|espalda/i))
    return "corporal";
  if (t.match(/pink|exosoma|exosomas|plasma|prp|regenerativo|bioestimulante/i))
    return "regenerativo";
  return "general";
}

function planRecomendado(categoria) {
  switch (categoria) {
    case "facial":
      return {
        nombre: "Face Antiage / Face Elite / Full Face",
        descripcion:
          "Combinan HIFU 12D, Radiofrecuencia, Pink Glow y Toxina Botulínica para atenuar arrugas, reafirmar y rejuvenecer rostro y cuello sin cirugía.",
        precio: "$281.600 – $584.000",
        cta: "diagnóstico facial"
      };
    case "corporal":
      return {
        nombre: "Lipo Reductiva / Lipo Body Elite / Body Fitness",
        descripcion:
          "Integran Cavitación, Radiofrecuencia y EMS Sculptor para reducir grasa localizada, tensar tejido y tonificar músculo.",
        precio: "$360.000 – $664.000",
        cta: "evaluación corporal"
      };
    case "regenerativo":
      return {
        nombre: "Pink Glow / (y opcionalmente Exosomas según evaluación)",
        descripcion:
          "Biorevitalización con péptidos y antioxidantes para mejorar textura, luminosidad e hidratación de la piel; efecto visible y progresivo.",
        precio: "$198.400 – $281.600",
        cta: "valoración regenerativa"
      };
    default:
      return {
        nombre: "Planes Body Elite",
        descripcion:
          "Protocolos faciales y corporales con HIFU 12D, RF, EMS Sculptor y Pink Glow según diagnóstico y objetivo clínico.",
        precio: "desde $120.000",
        cta: "evaluación gratuita"
      };
  }
}

/* ====== FUNCIONES EXISTENTES (EMPATÍA / OBJECIONES / CURIOSIDAD) ====== */
export function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("hola")) return "👋 ¡Hola! Soy Zara IA de Body Elite. ¿Cómo estás hoy?";
  if (t.includes("gracias")) return "✨ Encantada de ayudarte. ¿Quieres que te muestre los planes disponibles?";
  return null;
}

export function responderObjecion(texto) {
  const t = texto.toLowerCase();
  if (t.match(/caro|caros|precio alto|vale mucho/))
    return "💬 Entiendo tu punto. Nuestros valores reflejan la tecnología, el control médico y los resultados reales sin cirugía.";
  if (t.match(/duelen|dolor|molesta/))
    return "😊 Son tratamientos cómodos y no invasivos. Puedes sentir leve calor o contracción suave según la tecnología aplicada (HIFU, RF o EMS Sculptor).";
  return null;
}

export function responderCurioso(texto) {
  const t = texto.toLowerCase();
  if (t.match(/duele|dolor|molesta/))
    return "😊 No duele. Son tratamientos cómodos y no invasivos. Puedes sentir leve calor o contracción suave según la tecnología aplicada (HIFU, RF o EMS Sculptor).";
  if (t.match(/cuánto|valor|precio/))
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito con IA.";
  if (t.match(/dónde están|ubicación|dirección/))
    return "📍 Estamos en Av. Las Perdices N° 2990, Local 23, Peñalolén. Horario: Lunes a Viernes 9:30–20:00 · Sábado 9:30–13:00.";
  if (t.match(/certificado|médico|doctor|profesional/))
    return "⚕️ Contamos con equipo médico y productos certificados por ISP y ANMAT.";
  return null;
}

/* ====== RESPUESTA CONTEXTUAL PRINCIPAL ====== */
export function responderExtendido(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // 1) Empatía, objeción, curiosidad (prioridad alta)
  const emp = responderEmpatico(textoUsuario);
  if (emp)
    return emp + "\n📅 ¿Quieres coordinar tu evaluación gratuita? " + datos.info.agendar;

  const obj = responderObjecion(textoUsuario);
  if (obj)
    return obj + "\n💬 Puedo mostrarte alternativas según tu objetivo. 👉 " + datos.info.agendar;

  const cur = responderCurioso(textoUsuario);
  if (cur) {
    if (t.match(/botox|toxina|arruga|relleno/))
      return cur + "\n💉 Podemos coordinar una valoración facial para definir dosis y zonas. 👉 " + datos.info.agendar;
    if (t.match(/pink|exosoma|plasma|prp/))
      return cur + "\n✨ Agenda una valoración regenerativa sin costo. 👉 " + datos.info.agendar;
    if (t.match(/certificado|médico|doctor/))
      return cur + "\n⚕️ Si deseas, puedo agendarte una evaluación con nuestro equipo clínico. 👉 " + datos.info.agendar;
    return cur + "\n📅 ¿Te gustaría agendar tu evaluación gratuita? 👉 " + datos.info.agendar;
  }

  // 2) Detección de categoría clínica
  const categoria = detectarCategoria(textoUsuario);
  const plan = planRecomendado(categoria);

  // 3) Ajustes por intención específica
  if (categoria === "facial" && (t.includes("cuánto") || t.includes("precio") || t.includes("valor")))
    return "💉 Nuestros tratamientos con toxina botulínica parten desde $281.600 (Face Antiage), $358.400 (Face Elite) y $584.000 (Full Face). Incluyen combinación HIFU 12D + RF + Pink Glow + Toxina según diagnóstico.\n📅 Agenda tu " + plan.cta + " aquí 👉 " + datos.info.agendar;

  if (categoria === "corporal" && (t.includes("cuánto") || t.includes("precio") || t.includes("valor")))
    return "💪 Planes corporales: Body Fitness $360.000, Lipo Reductiva $480.000, Lipo Body Elite $664.000. Tecnologías Cavitación + RF + EMS Sculptor según zona.\n📅 Agenda tu " + plan.cta + " aquí 👉 " + datos.info.agendar;

  // 4) Construcción de respuesta por contexto
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

/* ============================================================
   FIN DEL MOTOR CONSOLIDADO
   ============================================================ */
