// motor_facial.js — versión limpia y segura UTF-8
function detectarIntencionFacial(mensaje) {
  if (!mensaje || typeof mensaje !== "string") return null;
  const texto = mensaje.toLowerCase();
  const patrones = {
    botox: /(botox|toxina|arruga|frente|patas de gallo|ceño|rejuvenec|expresion facial)/,
    flacidez: /(flacidez|piel caída|descolgamiento|firmeza|tensar rostro|lifting)/,
    manchas: /(manchas|pigmentacion|melasma|tono desigual|opacidad)/,
    limpieza: /(limpieza|facial|poros|puntos negros|impurezas)/,
  };
  for (const [intencion, regex] of Object.entries(patrones)) {
    if (regex.test(texto)) return intencion;
  }
  return null;
}

function generarRecomendacionFacial(intencion) {
  switch (intencion) {
    case "botox":
    case "flacidez":
      return "Para estos casos recomendamos nuestro FACE ELITE o FULL FACE, que integran HIFU 12D, Radiofrecuencia, Pink Glow y Toxina Botulinica. Actuan sobre la fascia y lineas de expresion, mejorando firmeza, textura y luminosidad de la piel. Durante tu evaluacion gratuita IA definiremos el protocolo ideal. Agenda aqui: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "manchas":
      return "La opcion ideal es FACE LIGHT o FACE SMART, que incluyen LED Therapy, Pink Glow y peeling regenerativo para manchas y tono desigual. Corrigen textura y devuelven luminosidad a tu piel. Agenda tu evaluacion gratuita aqui: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "limpieza":
      return "Podemos iniciar con LIMPIEZA FACIAL FULL, que elimina impurezas y equilibra tu piel. Incluye exfoliacion ultrasonica, extraccion asistida y mascarilla LED calmante. Agenda tu evaluacion gratuita aqui: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    default:
      return null;
  }
}

export function generarRespuestaFacial(mensajeUsuario) {
  const intencion = detectarIntencionFacial(mensajeUsuario);
  if (!intencion) return null;
  return generarRecomendacionFacial(intencion);
}

console.log("✅ motor_facial.js cargado correctamente");
