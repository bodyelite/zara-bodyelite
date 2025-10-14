// responses.js
// Respuestas principales y flujo de agendamiento
import fetch from "node-fetch";
import { detectarIntencion } from "./comprension.js";

// Enviar mensaje a varios números internos cuando alguien agenda
const notificarInternos = async (texto, token) => {
  const numeros = ["56983300262", "56937648536", "56931720760"];
  for (const numero of numeros) {
    await fetch("https://graph.facebook.com/v17.0/105596959260801/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: texto }
      })
    });
  }
};

// Generar respuesta según intención detectada
export async function generarRespuesta(mensaje, token, telefonoUsuario) {
  const intencion = detectarIntencion(mensaje);

  const linkReserva = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  const textoBoton = "Agenda Gratis";
  const encabezado = "✨ Agenda tu evaluación gratuita ✨";

  let respuesta = "";

  switch (intencion) {
    case "haifu":
      respuesta = `💠 *HIFU 12D Body Elite*\nTratamiento no invasivo que estimula colágeno y reafirma la piel. Ideal para rostro o zonas corporales con flacidez.\n💰 Desde $520.000 CLP\n⏱️ 1 sesión focal | Resultado progresivo por 90 días.\n👩‍⚕️ Evaluación sin costo con diagnóstico FitDays.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "toxin":
      respuesta = `✨ *Toxina Botulínica*\nAplicación profesional con especialistas certificados.\nRelaja los músculos responsables de líneas de expresión, logrando un rostro descansado y natural.\n💰 $180.000 CLP | 1 sesión aprox.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "pink glow":
      respuesta = `🌸 *Pink Glow Facial Revitalizante*\nBioestimulación dérmica con vitaminas, colágeno y ácido hialurónico.\nIdeal para pieles apagadas o deshidratadas.\n💰 $198.400 CLP | 3 sesiones.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "lipo":
      respuesta = `🔥 *Lipo Body Elite 12D*\nProtocolo corporal que combina Cavitación, Radiofrecuencia y EMS Sculptor.\nReduce grasa localizada y mejora firmeza sin cirugía.\n💰 $664.000 CLP | 8 sesiones.\nIncluye diagnóstico FitDays y asesoría personalizada.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "sculptor":
      respuesta = `💪 *Body Fitness Pro Sculptor*\nEstimulación muscular equivalente a 20.000 contracciones en 30 min.\nModela y tonifica glúteos, abdomen o brazos.\n💰 $360.000 CLP | 4 sesiones.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "antiage":
      respuesta = `💫 *Face Antiage Premium*\nRejuvenecimiento facial con HIFU, Radiofrecuencia y Toxina Botulínica.\nMejora arrugas, firmeza y luminosidad.\n💰 $281.600 CLP | 6 sesiones.\n\n${encabezado}\n${linkReserva}`;
      break;

    case "agenda":
      respuesta = `📅 *Agenda tu diagnóstico gratuito con nuestros especialistas.*\nIncluye análisis FitDays y asesoría personalizada.\n👉 ${linkReserva}`;
      // Notificar internamente
      await notificarInternos(`Nuevo interesado en agendar evaluación.\n📱 ${telefonoUsuario}\nMensaje: "${mensaje}"`, token);
      break;

    default:
      respuesta = `Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.\nEscribe *"quiero agendar"* o menciona el tratamiento que te interesa.`;
  }

  return respuesta;
}
