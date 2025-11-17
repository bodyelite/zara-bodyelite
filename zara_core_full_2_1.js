import dotenv from "dotenv";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";
import fetch from "node-fetch";

dotenv.config();

/**
 * Flow real de Zara:
 *  - recibe mensaje desde server.js
 *  - envía al motor mínimo procesarMensaje(texto, plataforma)
 *  - envía la respuesta al usuario
 *  - registra en monitor
 */
export async function handleMessage(from, text, channel) {
  try {
    console.log(`⚙️ handleMessage activado (${channel}) de ${from}: ${text}`);

    // 🔥 CORREGIDO: el motor siempre recibe (texto, plataforma)
    const respuesta = await procesarMensaje(text, channel);

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
 * Enviar registro al monitor
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
