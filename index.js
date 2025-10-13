import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import fetch from "node-fetch";
import { getResponse } from "./responses.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const token = process.env.WHATSAPP_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// === REGISTRO AUTOMÁTICO DE CONVERSACIONES ===
function registrarConversacion(origen, mensaje, respuesta) {
  const registro = {
    fecha: new Date().toISOString(),
    usuario: origen,
    mensaje_cliente: mensaje,
    respuesta_bot: respuesta,
  };
  fs.appendFileSync("logs_conversaciones.txt", JSON.stringify(registro) + "\n");
  console.log("🗂 Registro guardado:", registro);
}

// === RUTA PARA CONSULTAR CONVERSACIONES ===
app.get("/conversaciones", (req, res) => {
  const auth = req.query.auth;
  if (auth !== "bodyelite2025") {
    return res.status(403).send("Acceso denegado. Token incorrecto.");
  }
  if (!fs.existsSync("logs_conversaciones.txt")) {
    return res.status(404).send("No hay registros aún.");
  }

  const data = fs.readFileSync("logs_conversaciones.txt", "utf8");
  const registros = data
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  res.json({ total: registros.length, registros });
});

// === VERIFICACIÓN DE META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verifyToken) {
    console.log("✅ Webhook verificado correctamente con Meta.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Error de verificación con Meta.");
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.object && data.entry && data.entry[0].changes) {
      const change = data.entry[0].changes[0].value;
      const message = change.messages && change.messages[0];

      if (message && message.type === "text") {
        const from = message.from;
        const text = message.text.body;
        console.log(`📩 Mensaje recibido de ${from}: ${text}`);

        // Obtiene la respuesta del bot
        const respuesta = await getResponse(text);

        // Envía la respuesta por WhatsApp
        await fetch(
          `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              text: { body: respuesta },
            }),
          }
        );

        // Guarda conversación en logs
        registrarConversacion(from, text, respuesta);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error al procesar webhook:", error);
    res.sendStatus(500);
  }
});

// === ENDPOINT PRINCIPAL ===
app.get("/", (req, res) => {
  res.send("Zara bot activo y escuchando mensajes correctamente ✅");
});

// === INICIO DE SERVIDOR ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Zara bot corriendo en puerto ${PORT}`);
});
