// responses.js
// Genera respuestas automáticas y avisos internos

import fetch from "node-fetch";
import { generarExplicacion } from "./knowledge.js";

const NUMEROS_AVISO = [
  "56931720760",
  "56937648536",
  "56956482924"
];
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Enviar aviso interno a los números definidos
async function enviarAvisoInterno(mensaje) {
  for (const numero of NUMEROS_AVISO) {
    try {
      await fetch(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          text: { body: mensaje }
        })
      });
    } catch (err) {
      console.error("Error al enviar aviso interno:", err.message);
    }
  }
}

// Generar respuesta al cliente
export async function generarRespuesta(intencion, textoUsuario) {
  switch (intencion) {
    case "saludo":
      return "Hola 👋, soy Zara, asistente de Body Elite. Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. ¿Qué zona te gustaría mejorar?";

    case "interes_corporal":
      return generarExplicacion("lipo");

    case "interes_facial":
      return generarExplicacion("facial");

    case "pregunta_dolor":
      return "Nuestros tratamientos son totalmente no invasivos y sin dolor. Solo se percibe una leve sensación térmica o contracción leve según el equipo utilizado.";

    case "pregunta_duracion":
      return "Cada sesión dura entre 45 y 60 minutos según la zona tratada.";

    case "pregunta_resultados":
      return "Los resultados comienzan a ser visibles desde la 2ª o 3ª sesión con reducción de centímetros, mejora de firmeza y tono muscular.";

    case "pregunta_maquinas":
      return "Usamos Cavitación, Radiofrecuencia, HIFU 12D y EMS Sculptor, equipos de última generación aprobados clínicamente.";

    case "pregunta_precio":
      return "Los valores dependen del plan. Por ejemplo, *Lipo Focalizada Reductiva* tiene un valor de $480.000 CLP (6 sesiones). Puedo ayudarte a agendar una evaluación gratuita para definir el más adecuado.";

    case "intencion_agendar":
      await enviarAvisoInterno(`📩 Nuevo interesado en agendar desde Zara: "${textoUsuario}"`);
      return "📅 Puedes agendar fácilmente tu evaluación gratuita con nuestros especialistas.\nIncluye diagnóstico FitDays y asesoría personalizada.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\n✨ Te esperamos en Av. Las Perdices Nº2990, Local 23, Peñalolén.";

    default:
      return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe por ejemplo: 'quiero agendar' o el nombre del tratamiento que te interesa.";
  }
}
