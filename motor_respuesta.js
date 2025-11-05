/* ============================================================
   MOTOR RESPUESTA ZARA 2.1 — CONSOLIDADO CON CONTEXTO ACTIVO
   ============================================================ */

import datos from "./base_conocimiento.js";
import { guardarContexto, obtenerContexto } from "./memoria.js";

/* === CLASIFICADOR PRINCIPAL === */
function detectarCategoria(texto) {
  const t = texto.toLowerCase();
  if (t.match(/botox|toxina|arruga|relleno|face|facial|papada/)) return "facial";
  if (t.match(/grasa|abdomen|gluteo|lipo|body|muslo|celulitis/)) return "corporal";
  if (t.match(/pink|exosoma|plasma|prp|regenerativo|bioestimulante/)) return "regenerativo";
  return "general";
}

/* === MEMORIA DE CONTEXTO === */
function recordarCategoria(usuario, texto) {
  const previo = obtenerContexto(usuario);
  const lower = texto.toLowerCase();
  if (
    previo &&
    (lower.includes("cuanto") ||
      lower.includes("vale") ||
      lower.includes("duele") ||
      lower.includes("resultado") ||
      lower.includes("certificado") ||
      lower.includes("gratis"))
  ) {
    return previo;
  }
  const nueva = detectarCategoria(texto);
  if (nueva && usuario) guardarContexto(usuario, nueva);
  return nueva;
}

/* === PLAN RECOMENDADO === */
function planRecomendado(categoria) {
  switch (categoria) {
    case "facial":
      return {
        nombre: "Face Elite / Face Antiage / Full Face",
        descripcion:
          "Protocolos con HIFU 12D, Radiofrecuencia, Pink Glow y Toxina Botulínica según diagnóstico clínico.",
        precio: "$281.600 – $584.000",
      };
    case "corporal":
      return {
        nombre: "Lipo Reductiva / Lipo Body Elite / Body Fitness",
        descripcion:
          "Protocolos corporales con HIFU 12D, Cavitación, RF y EMS Sculptor según objetivo clínico.",
        precio: "$348.800 – $664.000",
      };
    case "regenerativo":
      return {
        nombre: "Pink Glow / Bioestimulante / PRP",
        descripcion:
          "Protocolos regenerativos con factores de crecimiento, antioxidantes y péptidos bioactivos.",
        precio: "desde $198.400",
      };
    default:
      return {
        nombre: "Diagnóstico Body Elite",
        descripcion:
          "Incluye evaluación facial y corporal con IA, diagnóstico clínico y propuesta personalizada.",
        precio: "gratuita",
      };
  }
}

/* === RESPUESTAS === */
function responderEmpatico(categoria) {
  if (categoria === "facial")
    return "💆‍♀️ Trabajamos con HIFU, RF, Pink Glow y toxina botulínica. Resultados visibles desde la primera sesión.";
  if (categoria === "corporal")
    return "💪 Nuestros tratamientos usan HIFU 12D, RF, EMS Sculptor y Cavitación sin cirugía.";
  if (categoria === "regenerativo")
    return "✨ Usamos Pink Glow y exosomas aprobados por ISP y ANMAT para regeneración y luminosidad.";
  return "💫 Todos nuestros tratamientos incluyen diagnóstico gratuito con IA y seguimiento profesional.";
}

function responderObjeccion(textoUsuario) {
  const t = textoUsuario.toLowerCase();
  if (t.includes("caro") || t.includes("precio"))
    return "💸 Nuestros valores reflejan tecnología avanzada, equipos médicos y resultados reales sin cirugía.";
  if (t.includes("barato"))
    return "⚡️ Usamos equipos clínicos certificados y productos originales, lo que asegura resultados duraderos.";
  return null;
}

function responderCurioso(textoUsuario) {
  const t = textoUsuario.toLowerCase();
  if (t.includes("duele"))
    return "😌 No duele. Son tratamientos cómodos, puedes sentir leve calor o contracción según la tecnología.";
  if (t.includes("gratis"))
    return "🎯 La evaluación diagnóstica inicial es gratuita. Puedes agendar tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  if (t.includes("certificado"))
    return "📋 Todos los equipos y productos están certificados por ISP y ANMAT.";
  if (t.includes("resultado"))
    return "✅ Resultados visibles desde las primeras sesiones, reforzados con control clínico y diagnóstico IA.";
  return null;
}

/* === MOTOR PRINCIPAL === */
export function responderExtendido(usuario, textoUsuario) {
  const categoria = recordarCategoria(usuario, textoUsuario);
  const plan = planRecomendado(categoria);
  const obj = responderObjeccion(textoUsuario);
  const curiosidad = responderCurioso(textoUsuario);

  if (obj) return obj;
  if (curiosidad) return curiosidad;

  const base = responderEmpatico(categoria);
  return `${base}\n\n📋 ${plan.nombre}\n${plan.descripcion}\n💰 ${plan.precio}\n\n📅 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
}
