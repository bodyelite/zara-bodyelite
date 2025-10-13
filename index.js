// index.js
// Zara IA – Body Elite con aviso interno con hora local (Chile)
// Conexiones Meta y Render intactas

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { getKnowledge, normalizarTexto } from "./entrenador.js";
import { generarRespuesta, obtenerFechaChile } from "./responses.js";
import { registrarConversacion, actualizarContexto } from "./conversations.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ID real del número de WhatsApp Business
const PHONE_NUMBER_ID = "840360109156943";

// Números internos de Body Elite (sin + ni espacios)
const NUMEROS_INTERNOS = ["56983300262", "56937648536"];

// ======================================================
// WEBHOOK META
// ======================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Fallo en la verificación del webhook");
    res.sendStatus(403);
  }
});

// ======================================================
// RECEPCIÓN DE MENSAJES
// ======================================================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message) {
        const sender = message.from;
        let texto = "";

        if (message.type === "text") {
          texto = message.text.body;
        } else if (message.type === "image") {
          texto = message.image.caption || "imagen promocional";
        } else if (message.type === "button" || message.type === "interactive") {
          texto =
            message.button?.text ||
            message.interactive?.button_reply?.title ||
            "interacción anuncio";
        }

        const textoNormalizado = normalizarTexto(texto);
        const zaraData = getKnowledge();
        const contextoPrevio = actualizarContexto(sender, textoNormalizado);
        const respuesta = await generarRespuesta(
          textoNormalizado,
          zaraData,
          contextoPrevio
        );

        registrarConversacion(sender, textoNormalizado, respuesta);

        if (respuesta.includes("✳️")) {
          await enviarBotonAgendar(sender, respuesta);
          await enviarAvisoInterno(sender, textoNormalizado);
        } else {
          await enviarMensaje(sender, respuesta);
        }
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error procesando mensaje:", error.message);
    res.sendStatus(500);
  }
});

// ======================================================
// ENVÍO DE MENSAJES NORMALES
// ======================================================
async function enviarMensaje(to, text) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error al enviar mensaje:", errorData);
    } else {
      console.log(`✅ Mensaje enviado a ${to}`);
    }
  } catch (error) {
    console.error("Error al contactar API Meta:", error.message);
  }
}

// ======================================================
// ENVÍO DE AVISO INTERNO
// ======================================================
async function enviarAvisoInterno(usuario, mensajeUsuario) {
  const fecha = obtenerFechaChile();
  const aviso = `📩 Nuevo interesado en agendar evaluación.\n📆 Fecha: ${fecha}\n📞 Número: +${usuario}\n💬 Mensaje: "${mensajeUsuario}"`;

  for (const interno of NUMEROS_INTERNOS) {
    await enviarMensaje(interno, aviso);
  }
  console.log("📤 Aviso interno enviado a recepción Body Elite");
}

// ======================================================
// ENVÍO DE BOTÓN INTERACTIVO
// ======================================================
async function enviarBotonAgendar(to, text) {
  const mensaje = text.replace("✳️", "").trim();

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: mensaje },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "btn_agendar",
              title: "Agenda Gratis ✳️",
            },
          },
        ],
      },
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error al enviar botón:", errorData);
    } else {
      console.log(`✅ Botón interactivo enviado a ${to}`);
    }
  } catch (error) {
    console.error("Error al enviar botón interactivo:", error.message);
  }
}

// ======================================================
// INICIO DEL SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Zara IA ejecutándose en puerto ${PORT}`);
});

export default app;
