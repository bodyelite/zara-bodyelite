// comprension.js
import { knowledge } from "./knowledge.js";
import { buscarAprendizaje } from "./memoria.js";

export function interpretarMensaje(mensaje) {
  const texto = mensaje.toLowerCase().trim();

  // --- aprendizaje local ---
  const aprendido = buscarAprendizaje(texto);
  if (aprendido) return { tipo: "aprendido", respuesta: aprendido, aviso: null };

  // --- agendamiento ---
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

  // --- diagnóstico ---
  if (texto.includes("fitdays") || texto.includes("diagnóstico")) {
    const d = knowledge.diagnostico;
    return {
      tipo: "diagnostico",
      respuesta: `🧠 ${d.nombre}\n${d.descripcion}\nIncluye: ${d.incluye.join(", ")}.\n${d.experiencia}\n💰 ${d.precio}\nAgenda acá: ${knowledge.mensajes.link}`,
      aviso: knowledge.mensajes.aviso
    };
  }

  // --- tratamientos ---
  for (const t of knowledge.tratamientos) {
    const claves = [t.nombre.toLowerCase(), ...(t.objetivos || []), ...(t.aparatologia || [])].map(k =>
      k.toLowerCase()
    );
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

  // --- preguntas frecuentes ---
  if (texto.includes("duele") || texto.includes("dolor"))
    return { tipo: "sensacion", respuesta: knowledge.respuestas.dolor, aviso: null };

  if (texto.includes("resultado") || texto.includes("sirve") || texto.includes("efecto"))
    return { tipo: "resultados", respuesta: knowledge.respuestas.resultados, aviso: null };

  if (texto.includes("máquina") || texto.includes("equipo") || texto.includes("tecnolog"))
    return { tipo: "equipos", respuesta: knowledge.respuestas.equipos, aviso: null };

  if (texto.includes("hola") || texto.includes("buenas"))
    return { tipo: "saludo", respuesta: knowledge.mensajes.bienvenida, aviso: null };

  // --- fallback ---
  return {
    tipo: "general",
    respuesta:
      "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe por ejemplo: 'quiero agendar' o el nombre del tratamiento que te interese.",
    aviso: null
  };
}
