import dotenv from "dotenv";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";
import fetch from "node-fetch";

dotenv.config();

/**
 * Controla el flujo general:
 *  - recibe mensaje desde server.js
 *  - obtiene respuesta desde motor_respuesta_v3
 *  - envía respuesta al usuario
 *  - registra interacción en el monitor
 */
export async function handleMessage(from, text, channel) {
  try {
    console.log(`⚙️ handleMessage activado (${channel}) de ${from}: ${text}`);

    const respuesta = await procesarMensaje(from, text);

    if (!respuesta || respuesta.trim() === "") {
      console.log("⚠️ Sin respuesta generada por motor, se omite envío");
      return;
    }

    await sendMessage(from, respuesta, channel);
    await registrarEnMonitor(from, text, respuesta, channel);

  } catch (error) {
    console.error("❌ Error en handleMessage:", error);
  }
}

/**
 * Envía datos al monitor (para dashboard en Render)
 */
async function registrarEnMonitor(from, texto, respuesta, canal) {
  try {
    const log = {
      fecha: new Date().toISOString(),
      canal,
      from,
      texto,
      respuesta,
      estado: "recibido",
    };

    await fetch("https://zara-monitor-2-1.onrender.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });

    console.log("🧾 Registro enviado al monitor correctamente");
  } catch (error) {
    console.error("⚠️ Error registrando en monitor:", error);
  }
}
