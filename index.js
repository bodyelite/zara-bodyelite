import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "zara-bodyelite-token";
const WHATSAPP_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// === CONFIGURAR OPENAI ===
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// === WEBHOOK GET (verificación con Meta) ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === WEBHOOK POST (mensajes entrantes) ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages.length > 0) {
        const msg = messages[0];
        const from = msg.from;
        const text = msg.text?.body || "";

        console.log("📩 Mensaje recibido:", text, "de", from);

        // === Generar respuesta con IA (modelo Zara-BodyElite) ===
        const prompt = `
Eres Zara 💙, asistente inteligente de Body Elite Estética Avanzada (centro en Peñalolén, Chile).
Tu tono es cálido, profesional y femenino. Responde en español.
Ofreces ayuda sobre:
- tratamientos faciales (Face Elite, Face Smart, Face Light, etc.)
- tratamientos corporales (Lipo Body Elite, Push Up, Body Fitness, etc.)
- reservas o evaluaciones gratuitas en https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
- promociones vigentes o beneficios de Body Elite.
No inventes precios nuevos, usa los oficiales. Si no sabes algo, ofrece derivar a una asesora humana.

Usuario: ${text}
Zara:
`;

        const completion = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        });

        const aiReply = completion.choices[0].message.content.trim();
        console.log("🤖 Respuesta IA:", aiReply);

        // === Enviar la respuesta al usuario ===
        await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: aiReply },
          }),
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
});

// === PUERTO DE RENDER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
