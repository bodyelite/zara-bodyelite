// index.js
// Zara IA – Body Elite con botón interactivo y compatibilidad completa Meta + Render
// No se alteran conexiones ni estructura, solo se usa el ID de número de WhatsApp real

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { getKnowledge, normalizarTexto } from "./entrenador.js";
import { generarRespuesta } from "./responses.js";
import { registrarConversacion, actualizarContexto } from "./conversations.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ID REAL DEL NÚMERO DE WHATSAPP (según panel de Meta)
const PHONE_NUMBER_ID = "840360109156943";

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

        // Si incluye "✳️", enviar con botón interactivo
        if (respuesta.includes("✳️")) {
          await enviarBotonAgendar(sender, respuesta);
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
      body: {
        text: mensaje,
      },
      action: {
        buttons: [
          {
            type: "url",
            url: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
            title: "Agenda Gratis ✳️",
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
