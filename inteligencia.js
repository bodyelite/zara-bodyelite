export function obtenerRespuesta(tipo) {
  switch (tipo) {
    case "inicio":
      return "Hola 👋 Soy Zara IA de Body Elite. Te acompaño en tu evaluación estética gratuita 🌸 ¿Quieres conocer nuestros planes corporales o faciales? Responde 1 para corporales o 2 para faciales.";
    case "facial":
      return "Tenemos planes faciales como FACE LIGHT, SMART, ANTIAGE y ELITE. Todos incluyen tecnologías como HIFU facial, LED, RF y bioestimulación. ¿Quieres que te recomiende uno según tu objetivo?";
    case "corporal":
    case "zona corporal":
      return "Los tratamientos corporales más efectivos son LIPO BODY ELITE, LIPO EXPRESS y PUSH UP. Usan HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para grasa localizada y tonificación.";
    case "consulta precio":
      return "Los precios varían según el plan: Lipo Body Elite $664.000, Lipo Express $432.000, Face Elite $358.400. Todos incluyen diagnóstico y sesiones personalizadas.";
    default:
      return "No entendí tu mensaje. Escribe *hola* para comenzar o *facial* / *corporal* según tu interés.";
  }
}
