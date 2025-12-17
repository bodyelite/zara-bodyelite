import OpenAI from "openai";
import dotenv from "dotenv";
import { SYSTEM_PROMPT, TRATAMIENTOS, NEGOCIO } from "../config/knowledge_base.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generarContexto() {
    let texto = "\n[TRATAMIENTOS DISPONIBLES]:\n";
    for (const [key, t] of Object.entries(TRATAMIENTOS)) {
        texto += `- ${t.nombre}: ${t.precio}. (${t.info})\n`;
    }
    return texto;
}

export async function generarRespuestaIA(historial) {
  try {
    const messages = [{ role: "system", content: SYSTEM_PROMPT + generarContexto() }, ...historial.slice(-8)];
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 350
    });
    return completion.choices[0].message.content;
  } catch (error) {
    return "Dame un segundo, estoy consultando mi sistema... 🗓️";
  }
}
