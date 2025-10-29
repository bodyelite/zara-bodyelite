import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import procesarMensaje from "./memoria.js";

const app = express();
app.use(bodyParser.json());

const token = process.env.PAGE_ACCESS_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;
const port = process.env.PORT || 3000;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verifyTokenParam = req.query["hub.verify_token"];
  if (mode === "subscribe" && verifyTokenParam === verifyToken) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry.changes?.[0];
      const message = changes?.value?.messages?.[0];
      if (message && message.text) {
        const texto = message.text.body.toLowerCase();
        const from = message.from;
        const respuesta = procesarMensaje(texto);
        await enviarMensaje(from, respuesta);
        await registrarEnMonitor({ from, texto, respuesta, estado: "recibido" });
        await registrarEnMonitor({ from, texto: respuesta, respuesta: "(respuesta automática)", estado: "enviado" });
      }
      res.sendStatus(200);
    } else res.sendStatus(404);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

async function enviarMensaje(to, text) {
  try {
    await fetch(`https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to, text: { body: text } }),
    });
  } catch (e) {
    console.error("Error enviando mensaje a WhatsApp:", e);
  }
}

async function registrarEnMonitor(data) {
  try {
    await fetch("https://zara-monitor-2-1.onrender.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        canal: "whatsapp",
        from: data.from || "usuario_desconocido",
        texto: data.texto,
        respuesta: data.respuesta,
        estado: data.estado,
      }),
    });
  } catch (err) {
    console.error("Error enviando al monitor:", err);
  }
}

app.listen(port, () => console.log(`✅ Zara 2.1 corriendo en puerto ${port}`));
import igRouter from "./instagram/ig_webhook.js";
app.use("/ig", igRouter);
