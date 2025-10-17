import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const WHATSAPP_TOKEN = process.env.ZARA_TOKEN;

// Números internos Body Elite
const ADMIN_NUMBERS = [
  "56983300262",
  "56931720760",
  "56937648536"
];

// Verificación base
app.get("/", (req, res) => {
  res.send("✅ Zara operativa. Monitoreando clics y confirmaciones de Reservo.");
});

// Evento 1: Lead hace clic en link de agenda
app.post("/lead-click", async (req, res) => {
  try {
    const { from, nombre, contexto } = req.body;
    const mensaje = `📲 Lead interesado en agendar.
👤 Posible cliente: ${nombre || "No identificado"}
🗒 Contexto: ${contexto || "Clic directo en enlace de agenda"}
🔗 Confirmado desde WhatsApp (${from || "sin número"}).`;

    for (const numero of ADMIN_NUMBERS) {
      await fetch("https://graph.facebook.com/v19.0/311816848671292/messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          type: "text",
          text: { body: mensaje }
        })
      });
    }

    console.log("✅ Aviso de clic en agenda enviado correctamente.");
    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error en lead-click:", err.message);
    res.status(500).send("Error interno");
  }
});

// Evento 2: Cita confirmada desde Reservo (llamado desde function finish())
app.post("/lead-confirm", async (req, res) => {
  try {
    const { nombre, fecha, hora, codigo, local, tratamiento } = req.body;

    const mensaje = `📅 *Nueva reserva confirmada en Reservo*
👤 Nombre: ${nombre || "Sin nombre"}
💆‍♀️ Tratamiento: ${tratamiento || "Evaluación Body Elite"}
🗓 Fecha: ${fecha || "Sin fecha"}
⏰ Hora: ${hora || "Sin hora"}
🔢 Código: ${codigo || "Sin código"}
📍 Local: ${local || "Body Elite Peñalolén"}
⚠️ Aviso automático enviado por Zara.`;

    for (const numero of ADMIN_NUMBERS) {
      await fetch("https://graph.facebook.com/v19.0/311816848671292/messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          type: "text",
          text: { body: mensaje }
        })
      });
    }

    console.log("✅ Aviso interno de cita confirmada enviado correctamente.");
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error en lead-confirm:", error);
    res.status(500).send("Error interno");
  }
});

// Escucha activa
app.listen(PORT, () => {
  console.log(`✅ Zara activa. Escuchando en puerto ${PORT}`);
});
