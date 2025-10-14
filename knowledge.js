// knowledge.js
// Información clínica y comercial resumida de tratamientos

export function generarExplicacion(tipo) {
  if (tipo === "lipo") {
    return `🔥 *Lipo Focalizada Reductiva*  
Reduce grasa localizada y mejora la firmeza con Cavitación, Radiofrecuencia y EMS Sculptor.  
💪 Resultados desde la 3ª sesión, sin dolor ni recuperación.  
💰 $480.000 CLP (6 sesiones).  
📅 Agenda tu evaluación gratuita aquí:  
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9  
Incluye diagnóstico corporal FitDays y asesoría personalizada.`;
  }

  if (tipo === "facial") {
    return `💆‍♀️ *Tratamientos Faciales Body Elite*  
Combinan HIFU, Radiofrecuencia y Toxina Botulínica para mejorar firmeza, arrugas y luminosidad.  
✨ Desde $281.600 CLP (6 sesiones).  
📅 Agenda tu evaluación gratuita:  
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9  
Incluye diagnóstico facial FitDays.`;
  }

  return "Ofrecemos tratamientos faciales y corporales personalizados con tecnología estética avanzada. Puedo ayudarte a elegir el más adecuado o agendar tu diagnóstico gratuito.";
}
