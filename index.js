import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Webhook verificación
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recepción y respuesta de mensajes
app.post("/webhook", async (req, res) => {
  try {
  // bloque try corregido
} catch (error) {
  console.error(error);
}
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.text && message.from) {
        const phone_number_id = changes.value.metadata.phone_number_id;
        const from = message.from;
        const msg_body = message.text.body.toLowerCase();

        console.log("📩 Mensaje recibido:", msg_body);

        const respuesta =
          "Hola 👋 Soy *Zara IA* de Body Elite.\n" +
          "Te acompaño en tu evaluación estética gratuita 🌸\n\n" +
          "¿Quieres conocer nuestros planes corporales o faciales?\n" +
          "👉 Responde *1* para corporales o *2* para faciales.";

        const url = `https://graph.facebook.com/v17.0/${phone_number_id}/messages`;

        const payload = {
          messaging_product: "whatsapp",
          to: from,
            }
            // Análisis con inteligencia local
                await sendMessage(from, posible);
            }
          text: { body: respuesta }
        };

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        };

        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("✅ Enviado correctamente:", data);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
});

// Servidor
app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Servidor Zara IA activo en puerto ${process.env.PORT || 3000}`);
});
