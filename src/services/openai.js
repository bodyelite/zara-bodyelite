import OpenAI from "openai";
import dotenv from "dotenv";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../config/knowledge_base.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generarContexto() {
    let t = "\n[CATÁLOGO RAPIDO]:\n";
    for (const [k, v] of Object.entries(TRATAMIENTOS)) t += `- ${v.nombre}: ${v.precio}\n`;
    return t;
}

export async function generarRespuestaIA(historial) {
  try {
    const messages = [
        { role: "system", content: SYSTEM_PROMPT + generarContexto() + "\nNOTA: Si tienes el nombre del cliente, ÚSALO. Sé breve." }, 
        ...historial.slice(-10)
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.5,
      max_tokens: 150 
    });
    return completion.choices[0].message.content;
  } catch (error) {
    return "Dame un segundo, estoy verificando... 🗓️";
  }
}
