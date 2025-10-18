import express from "express";
import bodyParser from "body-parser";
import { generarRespuestaClinica } from "./motor_clinico.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

// === Función principal Zara ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return res.sendStatus(200);

    const from = entry.from;
    const text = entry.text?.body?.toLowerCase() || "";

    console.log(`📩 Mensaje recibido de ${from}: ${text}`);

    const zonas = ["abdomen","cintura","gluteo","trasero","pompis","pierna","muslo","brazo","cara","rostro","facial","papada","cuello"];
    const objetivos = ["reducir","grasa","reafirmar","tonificar","levantar","definir","rejuvenecer","flacidez","celulitis","arrugas"];

    let zonaDetectada = zonas.find(z => text.includes(z));
    let objetivoDetectado = objetivos.find(o => text.includes(o));

    const respuesta = generarRespuestaClinica(zonaDetectada, objetivoDetectado);

    console.log(`🤖 Respuesta generada: ${respuesta}`);
    await enviarMensaje(from, respuesta);
  } catch (err) {
    console.error("Error procesando mensaje:", err);
  }
  res.sendStatus(200);
});

// === Envío de mensajes ===
async function enviarMensaje(numero, mensaje) {
  const token = process.env.PAGE_ACCESS_TOKEN; // <--- correcto
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: numero,
    type: "text",
    text: { body: mensaje }
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const result = await resp.json();
  console.log("📤 Enviado:", result);
}

// === Rutas y servidor ===
app.get("/", (req, res) => {
  res.send("✅ Zara Body Elite activa con motor clínico v6 y token corregido.");
});

app.listen(PORT, () => {
  console.log(`✅ Zara Body Elite corriendo en puerto ${PORT}`);
});
