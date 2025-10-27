export function obtenerRespuesta(texto) {
  const t = texto.toLowerCase();

  // ====== MAPA DE RESPUESTAS CLÍNICAS ======
  const respuestas = [
    { 
      palabras: ["hola", "buenas", "hey", "zara"], 
      respuesta: "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar hoy?"
    },
    {
      palabras: ["abdomen", "barriga", "vientre", "pansa", "panza"],
      respuesta: "🔥 Para grasa localizada y flacidez usamos HIFU 12D + Cavitación + RF + EMS Sculptor. Desde $348.800 CLP."
    },
    {
      palabras: ["grasa", "flacidez", "reductor", "reducir", "moldear", "lipo"],
      respuesta: "💎 Tratamiento Lipo Body Elite o Lipo Express según diagnóstico. Incluye HIFU 12D + RF + EMS Sculptor."
    },
    {
      palabras: ["gluteo", "glúteo", "trasero", "cola", "nalgas"],
      respuesta: "🍑 PUSH UP con EMS Sculptor y RF. Reafirma y levanta en solo 2 semanas."
    },
    {
      palabras: ["rostro", "cara", "facial", "piel", "líneas", "arrugas", "manchas"],
      respuesta: "🌸 Para rostro ofrecemos Face Elite, Face Antiage o Face Smart según diagnóstico. Todos con tecnología LED y RF."
    },
    {
      palabras: ["sesiones", "cuantas", "cuánto", "cuantos"],
      respuesta: "📅 Cada plan tiene entre 6 y 12 sesiones según evaluación. Podemos revisar tu caso en la evaluación gratuita asistida por IA."
    },
    {
      palabras: ["precio", "vale", "valor", "cuesta", "coste"],
      respuesta: "💰 Los precios varían según la zona y tecnología. Ejemplo: Lipo Express $432 000 CLP / Face Elite $358 400 CLP."
    },
    {
      palabras: ["evaluación", "agenda", "reserva", "agendar", "cita", "hora"],
      respuesta: "📲 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    }
  ];

  // ====== DETECCIÓN ======
  for (const r of respuestas) {
    if (r.palabras.some(p => t.includes(p))) return r.respuesta;
  }

  // ====== FALLBACK GENERAL ======
  return "✨ No estoy segura, pero puedo orientarte en tu evaluación gratuita asistida con IA. ¿Podrías contarme qué zona o resultado buscas?";
}
