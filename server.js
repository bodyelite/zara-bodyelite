import express from "express";
import bodyParser from "body-parser";
import { procesarMensaje } from "./motor_respuesta.js";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Zara 2.1 corriendo en puerto 3000");
});

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
        const respuesta = procesarMensaje(usuario, texto);
        console.log("Mensaje recibido:", texto);
        console.log("Respuesta generada:", respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("✅ Zara 2.1 corriendo en puerto 3000"));
