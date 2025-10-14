// responses.js
import { interpretarMensaje } from "./comprension.js";
import { knowledge } from "./knowledge.js";
import fetch from "node-fetch";

export async function generarRespuesta(mensaje, numero) {
  try {
    const analisis = interpretarMensaje(mensaje);

    // Si la intención es agendar, genera aviso
    if (analisis.intencion === "agenda" || mensaje.toLowerCase().includes("agendar")) {
      await enviarAvisoInterno("🗓️ Nuevo interesado en agendar evaluación gratuita", numero);
    }

    return analisis.respuesta;
  } catch (error) {
    console.error("Error generando respuesta:", error);
    return "Hubo un problema al procesar tu mensaje. Intenta nuevamente o agenda directamente en nuestro enlace.";
  }
}

// ---------------------------------------------------------------------------
// ENVÍO DE AVISOS INTERNOS
// ---------------------------------------------------------------------------
const numerosInternos = [
  "56983300262", // Recepción
  "56937648536", // Bot
  "56931720760"  // Dirección técnica
];

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

async function enviarAvisoInterno(texto, cliente) {
  const aviso = `${texto}\n📞 Cliente: +${cliente}`;
  for (const destino of numerosInternos) {
    await enviarMensaje(destino, aviso);
  }
}

// ---------------------------------------------------------------------------
// ENVÍO DE MENSAJES POR API META
// ---------------------------------------------------------------------------
export async function enviarMensaje(destino, texto) {
  try {
    const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    const body = {
      messaging_product: "whatsapp",
      to: destino,
      text: { body: texto }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Error al enviar mensaje:", err);
    } else {
      console.log(`✅ Aviso interno enviado a ${destino}`);
    }
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}

// ---------------------------------------------------------------------------
// SALUDO Y RESPUESTA GENÉRICA
// ---------------------------------------------------------------------------
export function saludoInicial() {
  return knowledge.mensajes.bienvenida;
}

export function respuestaGenerica() {
  return (
    "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. " +
    "Escribe por ejemplo: 'quiero agendar' o el nombre del tratamiento que te interese."
  );
}
