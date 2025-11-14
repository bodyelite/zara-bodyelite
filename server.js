import express from "express";
import bodyParser from "body-parser";
import { procesarMensaje } from "./motor_respuesta_v6.js";
import { sendMessage } from "./sendMessage.js";

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const msg = value?.messages?.[0];

    const texto = msg?.text?.body || null;
    const usuario = msg?.from || null;

    if (texto && usuario) {
      console.log("Mensaje recibido:", texto);
      const respuesta = await procesarMensaje(usuario, texto);
      console.log("Respuesta generada:", respuesta);
      await sendMessage(usuario, respuesta);
    }
    return res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook:", e);
    return res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Zara 3.0 corriendo en puerto", process.env.PORT || 3000);
});
