import fs from "fs";
import OpenAI from "openai";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../../config/knowledge_base.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. FUNCIÓN CEREBRO (TEXTO)
export async function generarRespuestaIA(historialChat) {
  try {
    const contexto = "DATOS OFICIALES:\n" + JSON.stringify(TRATAMIENTOS, null, 2);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\n" + contexto },
        ...historialChat
      ],
      temperature: 0.7,
      max_tokens: 350
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error OpenAI Chat:", error);
    return "¡Ups! Tuve un pequeño lapsus 🤯. ¿Me repites la pregunta?";
  }
}

// 2. FUNCIÓN OÍDO (AUDIO -> TEXTO)
export async function transcribirAudio(filePath) {
  try {
    console.log("👂 Escuchando audio...");
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "es", // Forzamos español para mejor precisión
    });
    console.log("📝 Transcripción:", transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("❌ Error OpenAI Whisper:", error);
    return null;
  }
}
