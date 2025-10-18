export function obtenerRespuesta(intencion, mensaje) {
  switch (intencion) {
    case "saludo":
      return "Hola 👋 Soy Zara de Body Elite. Cuéntame, ¿qué zona te gustaría mejorar hoy?"
    case "botox":
      return "El tratamiento con *Toxina Botulínica* ayuda a relajar las líneas de expresión del rostro, logrando un aspecto natural y rejuvenecido. Suele combinarse con *Radiofrecuencia* o *HIFU 12D* para potenciar firmeza. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0MnrxU8d7W64x5t2S6L4h9"
    case "hifu":
      return "El *HIFU 12D* trabaja con ultrasonido focalizado que tensa la piel y reduce grasa localizada. Ideal para flacidez facial o corporal. ¿Te gustaría que te recomiende un plan específico?"
    case "grasa":
      return "Para reducir grasa localizada te recomiendo nuestro plan *Lipo Body Elite*, que combina HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor. El valor parte desde $664.000 e incluye 12 sesiones. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0MnrxU8d7W64x5t2S6L4h9"
    case "flacidez":
      return "La *flacidez* se trata con tecnologías que estimulan colágeno y músculo: *Radiofrecuencia*, *HIFU 12D* y *EMS Sculptor*. Los planes más recomendados son *Body Tensor* y *Body Fitness*. ¿Quieres que te detalle cuál se adapta mejor a tu zona?"
    case "facial":
      return "Los tratamientos faciales de Body Elite incluyen *Face Smart*, *Face Antiage* y *Face Elite*. Todos integran HIFU 12D, Radiofrecuencia, LED y Pink Glow para mejorar textura, firmeza y luminosidad. 💆‍♀️ Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0MnrxU8d7W64x5t2S6L4h9"
    case "agenda":
      return "Perfecto 🗓 Puedes agendar tu evaluación gratuita directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0MnrxU8d7W64x5t2S6L4h9"
    default:
      return "Por favor indícame qué deseas mejorar o qué zona quieres tratar y te ayudaré a encontrar el plan ideal 💙"
  }
}
