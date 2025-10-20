import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import { analizarMensaje } from "./inteligencia.js";
dotenv.config();
const app = express();
app.use(bodyParser.json());
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;
async function sendMessage(to, text) {
try {
const url = "https://graph.facebook.com/v18.0/" + PHONE_NUMBER_ID + "/messages";
const headers = { Authorization: "Bearer " + PAGE_ACCESS_TOKEN, "Content-Type": "application/json" };
const body = { messaging_product: "whatsapp", recipient_type: "individual", to: to, type: "text", text: { preview_url: false, body: text } };
const r = await axios.post(url, body, { headers });
console.log("Mensaje enviado:", r.data);
} catch (e) {
console.error("Error al enviar mensaje:", e.response?.data || e.message);
}}
app.get("/webhook", (req, res) => {
const mode = req.query["hub.mode"];
const token = req.query["hub.verify_token"];
const challenge = req.query["hub.challenge"];
if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
else res.sendStatus(403);
});
app.post("/webhook", async (req, res) => {
try {
const entry = req.body.entry?.[0];
const message = entry?.changes?.[0]?.value?.messages?.[0];
const from = message?.from;
const text = message?.text?.body?.toLowerCase();
if (from && text) {
const respuesta = await analizarMensaje(text);
await sendMessage(from, respuesta);
}
res.sendStatus(200);
} catch (e) {
console.error("Error:", e);
res.sendStatus(500);
}});
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
