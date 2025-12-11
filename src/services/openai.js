import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { SYSTEM_PROMPT } from "../../config/personalidad.js";
import { TRATAMIENTOS } from "../../config/productos.js";
import { NEGOCIO } from "../../config/negocio.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generarContextoProductos() {
    let texto = "\n📋 **LISTA DE PRECIOS Y SERVICIOS ACTUALIZADA:**\n";
    for (const [key, t] of Object.entries(TRATAMIENTOS)) {
        texto += `- ${t.nombre}: ${t.precio}. (${t.info})\n`;
    }
    texto += `\n📍 Ubicación: ${NEGOCIO.ubicacion}\n`;
    texto += `🔗 Link Agenda: ${NEGOCIO.agenda_link}\n`;
    return texto;
}

export async function generarRespuestaIA(historial) {
  try {
    const promptCompleto = SYSTEM_PROMPT + generarContextoProductos();

    const messages = [
      { role: "system", content: promptCompleto },
      ...historial
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 400
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error OpenAI:", error);
    return "¡Hola! Tuve un pequeño lapsus. ¿Me repites eso? 😅";
  }
}

export async function transcribirAudio(filePath) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });
    return transcription.text;
  } catch (error) {
    console.error("❌ Error Whisper:", error);
    return null;
  }
}
