import fs from "fs";

const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf-8"));

export function obtenerRespuesta(texto) {
  const t = texto.toLowerCase();
  const agendar = "📲 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // === Búsqueda por alias de zona ===
  const alias = conocimientos.alias_zonas || {};
  const zonas = conocimientos.problema_zona || {};
  const planes = conocimientos.planes || {};

  let zonaDetectada = null;
  for (const [aliasTerm, zonaReal] of Object.entries(alias)) {
    if (t.includes(aliasTerm)) {
      zonaDetectada = zonaReal;
      break;
    }
  }

  // === Búsqueda directa por nombre de zona ===
  if (!zonaDetectada) {
    for (const z of Object.keys(zonas)) {
      if (t.includes(z)) {
        zonaDetectada = z;
        break;
      }
    }
  }

  // === Casos base (saludo, info general, ubicación, etc.) ===
  const bases = [
    {
      palabras: ["hola", "buenas", "hey", "zara"],
      respuesta: "🌸 ¡Hola! Soy Zara IA de Body Elite. Estoy aquí para ayudarte a descubrir tu mejor versión ✨. ¿Qué zona te gustaría mejorar hoy?"
    },
    {
      palabras: ["donde", "ubicacion", "dirección", "local"],
      respuesta: "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Lunes a Viernes 9:30–20:00 | Sábado 9:30–13:00. " + agendar
    },
    {
      palabras: ["duele", "dolor", "molesta", "siente"],
      respuesta: "🤍 Todos nuestros tratamientos son indoloros. Trabajamos con tecnologías no invasivas que estimulan colágeno y tonifican sin dolor. " + agendar
    },
    {
      palabras: ["precio", "vale", "valor", "cuesta", "coste"],
      respuesta: "💰 Nuestros planes parten desde $120.000 CLP en faciales y $348.800 CLP en corporales. Incluyen diagnóstico IA y tecnologías como HIFU 12D, RF y EMS Sculptor. " + agendar
    },
    {
      palabras: ["sesion", "sesiones", "cuantas", "cuantos"],
      respuesta: "📅 Cada plan tiene entre 6 y 12 sesiones según el diagnóstico inicial. La evaluación es gratuita y asistida con IA. " + agendar
    },
    {
      palabras: ["evaluacion", "agenda", "cita", "hora", "reserva", "agendar"],
      respuesta: "🩵 Puedes agendar directamente tu evaluación gratuita en este enlace:\n" + agendar
    }
  ];

  for (const b of bases) {
    if (b.palabras.some(p => t.includes(p))) return b.respuesta;
  }

  // === Si se detecta zona, buscar problema asociado ===
  if (zonaDetectada && zonas[zonaDetectada]) {
    const problemas = zonas[zonaDetectada];
    for (const [problema, planesRelacionados] of Object.entries(problemas)) {
      if (t.includes(problema)) {
        const planKey = planesRelacionados[0];
        const plan = planes[planKey];
        if (plan) {
          return `💡 ${plan.nombre}\n${plan.descripcion}\n💰 ${plan.precio}\n${agendar}`;
        }
      }
    }

    // Si hay zona pero sin problema específico
    const primerPlan = Object.values(planes)[0];
    if (primerPlan) {
      return `✨ Tratamiento recomendado para ${zonaDetectada}:\n${primerPlan.nombre}\n${primerPlan.descripcion}\n💰 ${primerPlan.precio}\n${agendar}`;
    }
  }

  // === Si no se entiende nada ===
  return "✨ No estoy segura, pero puedo ayudarte con una evaluación gratuita asistida por IA. Cuéntame qué zona te gustaría mejorar 💬 " + agendar;
}
