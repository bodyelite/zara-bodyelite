// responses.js
// Lógica de respuestas clínicas y comerciales de Zara IA para Body Elite
import fetch from "node-fetch";
import { detectarIntencion } from "./comprension.js";

const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Números internos que reciben notificación
const NUMEROS_INTERNOS = ["56983300262", "56937648536", "56931720760"];

// Envío de notificación interna
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
      console.error("Error enviando aviso interno:", err);
    }
  }
}

// Generar respuesta principal
export async function generarRespuesta(mensaje, token, telefono) {
  const intencion = detectarIntencion(mensaje);
  const encabezado = "✨ Agenda tu evaluación gratuita ✨";

  let respuesta = "";

  switch (intencion) {
    case "lipo":
      respuesta = `🔥 *Lipo Focalizada Reductiva*\nReduce grasa localizada y mejora firmeza con Cavitación, RF y Sculptor.\n💰 *$480.000 CLP* | 6 sesiones.\nIncluye diagnóstico FitDays y asesoría corporal.\n\nParte desde acá 👉 ${LINK_RESERVO}\n\n${encabezado}`;
      break;

    case "haifu":
      respuesta = `💠 *HIFU 12D Body Elite*\nTecnología ultrasónica que estimula colágeno, redefine contornos y tensa la piel sin cirugía.\n💰 *$664.000 CLP* | 6 sesiones.\nIdeal para rostro o zonas corporales con flacidez.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "sculptor":
      respuesta = `💪 *Body Fitness Sculptor Pro*\nTratamiento para tonificar y definir musculatura con contracciones electromagnéticas profundas.\n💰 *$360.000 CLP* | 6 sesiones.\nEquivale a 20.000 abdominales por sesión.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "pink glow":
      respuesta = `🌸 *Pink Glow Facial Revitalizante*\nBioestimulación dérmica con vitaminas y péptidos para una piel más luminosa.\n💰 *$198.400 CLP* | 4 sesiones.\nIdeal para piel apagada o con manchas.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "toxina":
      respuesta = `✨ *Toxina Botulínica Profesional*\nRelaja los músculos faciales responsables de líneas de expresión, logrando un aspecto natural y descansado.\n💰 *$180.000 CLP* | 1 sesión.\nResultados desde el tercer día.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "antiage":
      respuesta = `💫 *Face Antiage Premium*\nCombina HIFU, Radiofrecuencia y Toxina Botulínica para rejuvenecer y mejorar la firmeza.\n💰 *$281.600 CLP* | 6 sesiones.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "facial":
      respuesta = `💆‍♀️ *Tratamientos Faciales Body Elite*\nTenemos opciones desde *$120.000 CLP* (Limpieza Facial Full) hasta *$584.000 CLP* (Full Face).\nCada plan incluye diagnóstico personalizado y aparatología avanzada.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "body":
      respuesta = `💎 *Planes Corporales Body Elite*\nDesde *$232.000 CLP* (Body Tensor) hasta *$664.000 CLP* (Lipo Body Elite).\nTodos incluyen diagnóstico FitDays y asesoría profesional.\n\n${encabezado}\n${LINK_RESERVO}`;
      break;

    case "agenda":
      respuesta = `📅 *Agenda tu diagnóstico gratuito con nuestros especialistas.*\nIncluye análisis FitDays y asesoría personalizada.\n\n${LINK_RESERVO}`;
      await avisarInternamente(token, telefono);
      break;

    default:
      respuesta = `Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.\nEscribe *"quiero agendar"* o menciona el tratamiento que te interesa.`;
  }

  // Si la respuesta incluye el link de agendamiento, notifica internamente
  if (respuesta.includes(LINK_RESERVO) && intencion !== "agenda") {
    await avisarInternamente(token, telefono);
  }

  return respuesta;
}
