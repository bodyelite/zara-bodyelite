import { generarDescripcion } from "./knowledge.js";

export async function generarRespuesta(intencion, texto) {
  switch (intencion) {
    case "saludo":
      return "Hola 👋 soy *Zara*, asistente de Body Elite. ¿Te interesa un tratamiento corporal o facial? Puedo ayudarte a agendar tu evaluación gratuita.";

    case "precio":
      return "Nuestros valores varían según el plan. Por ejemplo, *Lipo Focalizada Reductiva* tiene un valor de $480.000 (6 sesiones). ¿Quieres que veamos cuál te conviene más?";

    case "dolor":
      return "Todos nuestros tratamientos son no invasivos y sin dolor. Solo puedes sentir calor o leves contracciones, pero nada molesto.";

    case "duracion":
      return "Cada sesión dura entre 45 y 60 minutos aproximadamente, dependiendo de la zona tratada.";

    case "resultados":
      return "Los resultados se comienzan a notar desde la segunda o tercera sesión, con reducción de centímetros, reafirmación y mejora del tono muscular.";

    case "promocion":
      return "Actualmente tenemos promociones como *depilación gratis* al contratar tratamientos corporales. Podemos revisar juntos qué incluye 😉.";

    case "facial":
      return generarDescripcion("facial");

    case "corporal":
      return generarDescripcion("corporal");

    case "agendar":
      return "Podemos agendar tu evaluación gratuita 💆‍♀️.\nIncluye diagnóstico FitDays y asesoría personalizada.\n📅 Agenda aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";

    default:
      return "Puedo ayudarte con precios, promociones o agendar tu evaluación gratuita. Solo dime qué tratamiento te interesa o escribe 'quiero agendar'.";
  }
}
