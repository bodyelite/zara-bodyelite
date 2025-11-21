import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { procesarMensaje } from "./motor_respuesta_v3.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// NUMEROS DE RECEPCION PARA ALERTAS
const RECEPCION = [
  "56983300262",
  "56937648536",
  "56931720760"
];

// ---------------------------------------------
// GET WEBHOOK
// ---------------------------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ---------------------------------------------
// POST WEBHOOK - MENSAJES DE WHATSAPP
// ---------------------------------------------
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const mensaje = value?.messages?.[0];
      const texto = mensaje?.text?.body;
      const usuario = mensaje?.from;

      if (texto && usuario) {
        console.log("MENSAJE RECIBIDO:", texto);

        const respuesta = procesarMensaje(texto, usuario);

        console.log("RESPUESTA GENERADA:", respuesta);

        // ENVIAR RESPUESTA AL PACIENTE
        if (respuesta) {
          await enviarMensajeWhatsApp(usuario, respuesta);
        }

        // DETECTAR SI EL CLIENTE ENTREGA NUMERO
        if (/^\+?56|9\d{7,8}/.test(texto)) {
          const alerta = "ALERTA ZARA: Paciente solicita llamada. Numero: " + texto;

          for (const num of RECEPCION) {
            await enviarMensajeWhatsApp(num, alerta);
          }

          console.log("ALERTA ENVIADA A RECEPCION:", RECEPCION);
        }
      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);
  } catch (error) {
    console.error("ERROR EN WEBHOOK:", error);
    return res.sendStatus(500);
  }
});

// ---------------------------------------------
// FUNCION PARA ENVIAR MENSAJE VIA WHATSAPP
// ---------------------------------------------
async function enviarMensajeWhatsApp(to, body) {
  try {
    const url = "https://graph.facebook.com/v17.0/" + PHONE_NUMBER_ID + "/messages";

    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: String(body) }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + PAGE_ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("ERROR AL ENVIAR MENSAJE:", err);
  }
}

// ---------------------------------------------
// LEVANTAR SERVIDOR
// ---------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara corriendo en puerto " + PORT);
});
