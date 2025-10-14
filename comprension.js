// comprension.js
import { knowledge } from "./knowledge.js";

/**
 * Analiza una frase del usuario y devuelve la respuesta más adecuada
 * según los tratamientos, tecnologías o consultas generales del paciente.
 */
export function interpretarMensaje(mensaje) {
  const texto = mensaje.toLowerCase().trim();

  // --- 1. Consultas de agendamiento ---
  if (
    texto.includes("agenda") ||
    texto.includes("reserv") ||
    texto.includes("cita") ||
    texto.includes("diagnóstico") ||
    texto.includes("evaluación")
  ) {
    return {
      tipo: "agendamiento",
      respuesta: `${knowledge.mensajes.agendar}\n📍 Agenda aquí: ${knowledge.mensajes.link}`,
      aviso: knowledge.mensajes.aviso
    };
  }

  // --- 2. Consultas de diagnóstico ---
  if (texto.includes("fitdays") || texto.includes("diagnóstico")) {
    const d = knowledge.diagnostico;
    return {
      tipo: "diagnostico",
      respuesta: `🧠 ${d.nombre}\n${d.descripcion}\nIncluye: ${d.incluye.join(
        ", "
      )}.\n${d.experiencia}\n💰 ${d.precio}\nAgenda acá: ${knowledge.mensajes.link}`,
      aviso: knowledge.mensajes.aviso
    };
  }

  // --- 3. Detección de tratamientos ---
  for (const t of knowledge.tratamientos) {
    const claves = [
      t.nombre.toLowerCase(),
      ...(t.objetivos || []),
      ...(t.aparatologia || [])
    ].map(k => k.toLowerCase());

    if (claves.some(k => texto.includes(k.split(" ")[0]))) {
      return {
        tipo: "tratamiento",
        respuesta: `✨ ${t.nombre}\n${t.objetivos.join(", ")}.\n💡 ${t.resultados}\n🕓 ${t.sesiones} sesiones de ${t.duracion}.\n⚙️ Tecnologías: ${t.aparatologia.join(
          ", "
        )}.\n💰 $${t.precio.toLocaleString()} CLP.\n🧖‍♀️ ${t.experiencia}\n\nAgenda acá 👉 ${knowledge.mensajes.link}`,
        aviso: knowledge.mensajes.aviso
      };
    }
  }

  // --- 4. Consultas sobre dolor, duración o resultados ---
  if (texto.includes("duele") || texto.includes("dolor")) {
    return {
      tipo: "sensacion",
      respuesta:
        "Nuestros tratamientos son totalmente no invasivos y sin dolor. Solo se percibe una leve sensación térmica o de contracción según el equipo utilizado. No requieren recuperación.",
      aviso: null
    };
  }

  if (texto.includes("resultado") || texto.includes("sirve") || texto.includes("efecto")) {
    return {
      tipo: "resultados",
      respuesta:
        "Los resultados comienzan a ser visibles desde la 2ª o 3ª sesión según el tipo de tratamiento. Incluyen reducción de centímetros, mejora de firmeza y tono muscular.",
      aviso: null
    };
  }

  if (texto.includes("máquina") || texto.includes("equipo") || texto.includes("tecnolog")) {
    return {
      tipo: "equipos",
      respuesta:
        "Body Elite trabaja con aparatología de última generación: HIFU 12D, Cavitación, Radiofrecuencia, EMS Sculptor y tecnología LED facial. Todas aprobadas y seguras.",
      aviso: null
    };
  }

  // --- 5. Preguntas generales ---
  if (texto.includes("hola") || texto.includes("buenas")) {
    return {
      tipo: "saludo",
      respuesta: knowledge.mensajes.bienvenida,
      aviso: null
    };
  }

  // --- 6. Fallback ---
  return {
    tipo: "general",
    respuesta:
      "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe por ejemplo: 'quiero agendar' o el nombre del tratamiento que te interesa.",
    aviso: null
  };
}
