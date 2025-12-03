import fs from "fs";
import OpenAI from "openai";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../../config/knowledge_base.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historial) {
  try {
    const ctx = "DATOS:\\n" + JSON.stringify(TRATAMIENTOS, null, 2);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT + "\n\n" + ctx }, ...historial],
      temperature: 0.7,
      max_tokens: 350
    });
    return completion.choices[0].message.content;
  } catch (e) { return "¡Ups! Tuve un lapsus 🤯. ¿Me repites?"; }
}

export async function transcribirAudio(path) {
  try {
    const res = await openai.audio.transcriptions.create({ file: fs.createReadStream(path), model: "whisper-1", language: "es" });
    return res.text;
  } catch (e) { return null; }
}
