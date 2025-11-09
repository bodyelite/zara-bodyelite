import dotenv from "dotenv";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";

dotenv.config();

export async function handleMessage(text, from, channel) {
  try {
    const respuesta = await procesarMensaje(from, text);
    await sendMessage(from, respuesta, channel);
    await registrarEnMonitor(from, text, respuesta, channel);
  } catch (e) {
    console.error("⚠️ Error en handleMessage:", e);
  }
}

async function registrarEnMonitor(from, texto, respuesta, canal) {
  try {
    await fetch("https://zara-monitor-2-1.onrender.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        canal,
        from,
        texto,
        respuesta,
        estado: "recibido",
      }),
    });
  } catch (err) {
    console.error("⚠️ Error registrando en monitor:", err);
  }
}
