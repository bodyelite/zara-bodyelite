// comprension.js
import { knowledge } from "./knowledge.js";
import { buscarAprendizaje } from "./memoria.js";

export function interpretarMensaje(mensaje) {
  const texto = mensaje.toLowerCase().trim();

  // --- aprendizaje local ---
  const aprendido = buscarAprendizaje(texto);
  if (aprendido) return { tipo: "aprendido", respuesta: aprendido, aviso: null };

  // --- sinónimos anatómicos + expansión semántica ---
  const zonas = {
    abdomen: "Lipo Focalizada Reductiva",
    guata: "Lipo Focalizada Reductiva",
    guatita: "Lipo Focalizada Reductiva",
    panza: "Lipo Focalizada Reductiva",
    cintura: "Lipo Focalizada Reductiva",
    barriga: "Lipo Focalizada Reductiva",
    estómago: "Lipo Focalizada Reductiva",
    gluteos: "Body Fitness",
    glúteo: "Body Fitness",
    cola: "Body Fitness",
    trasero: "Body Fitness",
    piernas: "Body Fitness",
    muslos: "Body Fitness",
    brazos: "Body Fitness",
    papada: "Face Elite",
    mejillas: "Face Elite",
    rostro: "Face Elite",
    cara: "Face Elite",
    cuello: "Face Elite",
    frente: "Face Elite"
  };

  for (const [clave, plan] of Object.entries(zonas)) {
    if (texto.includes(clave)) {
      const t = knowledge.tratamientos.find(x =>
        x.nombre.toLowerCase().includes(plan.toLowerCase())
      );
      if (t) {
        return {
          tipo: "tratamiento",
          respuesta: `✨ ${t.nombre}\n${t.objetivos.join(", ")}.\n💡 ${t.resultados}\n🕓 ${t.sesiones} sesiones de ${t.duracion}.\n⚙️ Tecnologías: ${t.aparatologia.join(
            ", "
          )}.\n💰 $${t.precio.toLocaleString()} CLP.\n🧖‍♀️ ${t.experiencia}\n\nAgenda acá 👉 ${knowledge.mensajes.link}`,
          aviso: knowledge.mensajes.aviso
        };
      }
    }
  }

  // --- expansión semántica por intención ---
  const intenciones = {
    interes: ["quiero", "me interesa", "busco", "cuánto", "precio", "valor"],
    duda: ["sirve", "funciona", "resulta", "efectivo", "ayuda"],
    dolor: ["duele", "molesta", "ardor", "dolor", "incomodo"],
    resultado: ["resultado", "cambio", "efecto", "notar", "mejorar"],
    agendar: ["agenda", "reserv", "cita", "hora", "evaluación", "diagnóstico"]
  };

  // --- detección de intención ---
  for (const [tipo, palabras] of Object.entries(intenciones)) {
    if (palabras.some(p => texto.includes(p))) {
      switch (tipo) {
        case "agendar":
          return {
            tipo,
            respuesta: `${knowledge.mensajes.agendar}\n📍 Agenda aquí: ${knowledge.mensajes.link}`,
            aviso: knowledge.mensajes.aviso
          };
        case "interes":
          return {
            tipo,
            respuesta:
              "Puedo enviarte detalles de los tratamientos o agendar una evaluación gratuita para ver cuál te conviene más. ¿Qué zona quieres mejorar?",
            aviso: null
          };
        case "duda":
          return { tipo, respuesta: knowledge.respuestas.resultados, aviso: null };
        case "dolor":
          return { tipo, respuesta: knowledge.respuestas.dolor, aviso: null };
        case "resultado":
          return { tipo, respuesta: knowledge.respuestas.resultados, aviso: null };
      }
    }
  }

  // --- tratamientos por nombre ---
  for (const t of knowledge.tratamientos) {
    const claves = [t.nombre.toLowerCase(), ...(t.objetivos || []), ...(t.aparatologia || [])];
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

  // --- preguntas generales ---
  if (texto.includes("hola") || texto.includes("buenas"))
    return { tipo: "saludo", respuesta: knowledge.mensajes.bienvenida, aviso: null };

  if (texto.includes("maquina") || texto.includes("equipo") || texto.includes("tecnolog"))
    return { tipo: "equipos", respuesta: knowledge.respuestas.equipos, aviso: null };

  // --- fallback ---
  return {
    tipo: "general",
    respuesta:
      "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe por ejemplo: 'quiero agendar' o el nombre del tratamiento que te interese.",
    aviso: null
  };
}
