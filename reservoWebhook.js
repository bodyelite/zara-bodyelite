import express from "express";
import bodyParser from "body-parser";
import { manejarWebhookReservo } from "./responses.js";

const app = express();
app.use(bodyParser.json());

app.post("/", manejarWebhookReservo);

app.listen(3001, () => {
  console.log("✅ Webhook Reservo activo en puerto 3001");
});
