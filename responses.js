// responses.js
import { interpretarMensaje } from "./comprension.js";
import { knowledge } from "./knowledge.js";
import fetch from "node-fetch";

export async function generarRespuesta(mensaje, numero) {
  try {
    const analisis = interpretarMensaje(mensaje);

    // --- si existe aviso de agenda, enviarlo al equipo interno ---
    if (analisis.aviso) {
      await enviarAvisoInterno(analisis.aviso, numero);
    }

    return analisis.respuesta;
  } catch (error) {
    console.error("Error generando respuesta:", error);
    return "Hubo un problema al procesar tu mensaje. Intenta nuevamente o agenda directamente en nuestro enlace.";
  }
}

// ---------------------------------------------------------------------------
// --- ENVÍO DE AVISOS INTERNOS POR WHATSAPP ---
// ---------------------------------------------------------------------------

// Estos son los números que recibirán alertas cuando alguien agenda o muestra interés
const numerosInternos = [
  "56983300262", // recepción principal Body Elite
  "56937648536", // teléfono actual del bot
  "56931720760"  // nuevo número de respaldo
];

// Usa el mismo PAGE_ACCESS_TOKEN del .env
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

async function enviarAvisoInterno(texto, cliente) {
  const mensaje = `📩 ${texto}\nCliente: +${cliente}`;
  for (const destino of numerosInternos) {
    await enviarMensaje(destino, mensaje);
  }
}

// ---------------------------------------------------------------------------
// --- ENVÍO DE MENSAJES POR API DE META ---
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
    }
  } catch (error) {
    console.error("Fallo en enviarMensaje:", error);
  }
}

// ---------------------------------------------------------------------------
// --- MENSAJE DE PRESENTACIÓN Y REINTRODUCCIÓN ---
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
