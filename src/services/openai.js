import OpenAI from "openai";
import dotenv from "dotenv";
import { SYSTEM_PROMPT, TRATAMIENTOS, NEGOCIO } from "../config/knowledge_base.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generarContexto() {
    let t = "\n[CATÁLOGO]:\n";
    for (const [k, v] of Object.entries(TRATAMIENTOS)) t += `- ${v.nombre}: ${v.precio} (${v.info})\n`;
    return t;
}

export async function generarRespuestaIA(historial) {
  try {
    const messages = [{ role: "system", content: SYSTEM_PROMPT + generarContexto() }, ...historial.slice(-10)];
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.6,
      max_tokens: 300
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Estoy consultando la agenda, dame un momento... ⏳";
  }
}
