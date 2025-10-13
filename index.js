import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { getResponse } from "./responses.js";

const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bodyelitezara";
const PORT = process.env.PORT || 10000;

// === RUTA DE VERIFICACIÓN WEBHOOK META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES DE META ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body;

      if (from && text) {
        console.log(`📩 Mensaje recibido de ${from}: ${text}`);

        // Guardar conversación
        guardarConversacion(from, text);

        // Obtener respuesta
        const reply = getResponse(text);

        // Enviar respuesta por consola (Meta gestiona envío)
        console.log(`🤖 Respuesta de Zara: ${reply}`);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.error("❌ Error en webhook:", e);
    res.sendStatus(500);
  }
});

// === GUARDAR CONVERSACIONES EN JSON ===
function guardarConversacion(numero, mensaje) {
  const file = "./conversaciones.json";
  const nueva = {
    fecha: new Date().toLocaleString("es-CL"),
    numero,
    mensaje
  };
  let data = [];
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file);
    data = JSON.parse(raw);
  }
  data.push(nueva);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// === EXPORTAR CONVERSACIONES ===
app.get("/conversaciones", (req, res) => {
  const auth = req.query.auth;
  if (auth !== "bodyelite2025") return res.status(401).send("No autorizado");

  const formato = req.query.formato || "json";
  const file = "./conversaciones.json";
  if (!fs.existsSync(file)) return res.status(404).send("Sin registros");

  const data = JSON.parse(fs.readFileSync(file));
  if (formato === "csv") {
    const header = "fecha,numero,mensaje\n";
    const rows = data
      .map(d =>
        `"${d.fecha}","${d.numero}","${d.mensaje.replace(/"/g, "'")}"`
      )
      .join("\n");
    res.header("Content-Type", "text/csv");
    res.attachment("conversaciones.csv");
    res.send(header + rows);
  } else {
    res.json(data);
  }
});

// === INICIAR SERVIDOR ===
app.listen(PORT, () => {
  console.log(`✅ Zara bot corriendo correctamente en puerto ${PORT}`);
});
