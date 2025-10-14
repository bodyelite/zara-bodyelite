// responses.js
// Lógica de respuestas clínicas con explicación avanzada y aviso interno

import fetch from "node-fetch";
import { detectarIntencion } from "./comprension.js";

const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Números internos que reciben aviso
const NUMEROS_INTERNOS = ["56983300262", "56937648536", "56931720760"];

// Aviso interno por WhatsApp
async function avisarInternamente(token, telefono) {
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const texto = `🧭 Nuevo interesado en agendar evaluación.\n📅 ${fecha}\n📱 ${telefono}`;
  for (const numero of NUMEROS_INTERNOS) {
    try {
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
    } catch (err) {
      console.error("Error aviso interno:", err);
    }
  }
}

// Respuesta clínica extendida
function descripcionTratamiento(intencion) {
  const info = {
    lipo: "La *Lipo Focalizada Reductiva* combina Cavitación, Radiofrecuencia y EMS Sculptor para eliminar grasa localizada, reafirmar y reducir contornos. Resultados visibles desde la 3ª sesión. 💰 *$480.000 CLP* | 6 sesiones.",
    haifu: "El *HIFU 12D* estimula colágeno con ultrasonido focalizado, mejorando firmeza y reduciendo flacidez facial o corporal sin cirugía. 💰 *$664.000 CLP* | 6 sesiones.",
    sculptor: "El *Body Fitness Sculptor* tonifica y define músculos con contracciones profundas equivalentes a 20.000 abdominales por sesión. Ideal para abdomen, glúteos y piernas. 💰 *$360.000 CLP* | 6 sesiones.",
    "pink glow": "*Pink Glow Facial* aplica péptidos y vitaminas para iluminar, hidratar y revitalizar la piel. Resultados en textura y brillo desde la 2ª sesión. 💰 *$198.400 CLP* | 4 sesiones.",
    toxina: "*Toxina Botulínica Profesional* relaja músculos faciales, suaviza líneas de expresión y brinda un aspecto descansado y natural. 💰 *$180.000 CLP* | 1 sesión.",
    antiage: "*Face Antiage Premium* combina HIFU, RF y Toxina para rejuvenecer y mejorar textura y firmeza facial. 💰 *$281.600 CLP* | 6 sesiones."
  };
  return info[intencion] || "";
}

// Generar respuesta principal
export async function generarRespuesta(mensaje, token, telefono) {
  const intencion = detectarIntencion(mensaje);
  const encabezado = "✨ Agenda tu evaluación gratuita con nuestros especialistas ✨";
  let respuesta = "";

  switch (intencion) {
    case "lipo":
    case "haifu":
    case "sculptor":
    case "pink glow":
    case "toxina":
    case "antiage":
      respuesta = `${descripcionTratamiento(intencion)}\n\n📍 Agenda desde acá: ${LINK_RESERVO}\n${encabezado}`;
      await avisarInternamente(token, telefono);
      break;

    case "funciona":
      respuesta = "Cada tratamiento funciona mediante aparatología estética avanzada que estimula colágeno, quema grasa o tonifica músculo según el caso. Los resultados dependen de la constancia y diagnóstico inicial FitDays. ¿Deseas que te detalle el funcionamiento de alguno en particular?";
      break;

    case "facial":
      respuesta = "💆‍♀️ *Tratamientos Faciales Body Elite*\nDesde *$120.000 CLP* (Limpieza Facial Full) hasta *$584.000 CLP* (Full Face). Incluyen diagnóstico y aparatología avanzada.\n\n📍 Reserva acá: " + LINK_RESERVO;
      await avisarInternamente(token, telefono);
      break;

    case "body":
      respuesta = "💎 *Tratamientos Corporales Body Elite*\nDesde *$232.000 CLP* (Body Tensor) hasta *$664.000 CLP* (Lipo Body Elite). Incluyen diagnóstico FitDays y asesoría profesional.\n\n📍 Reserva acá: " + LINK_RESERVO;
      await avisarInternamente(token, telefono);
      break;

    case "agenda":
      respuesta = "📅 Puedes agendar tu diagnóstico gratuito con tecnología FitDays. Incluye evaluación corporal y facial completa.\n\nReserva directamente aquí:\n" + LINK_RESERVO;
      await avisarInternamente(token, telefono);
      break;

    default:
      respuesta = "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.\nEscribe *“quiero agendar”* o menciona el tratamiento que te interesa.";
  }

  // refuerzo: aviso si se incluye link
  if (respuesta.includes(LINK_RESERVO)) {
    await avisarInternamente(token, telefono);
  }

  return respuesta;
}
