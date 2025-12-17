import OpenAI from "openai";
import dotenv from "dotenv";
import { SYSTEM_PROMPT, TRATAMIENTOS, NEGOCIO } from "../config/knowledge_base.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generarContextoProductos() {
    let texto = "\n[CONTEXTO DE NEGOCIO]:\n";
    for (const [key, t] of Object.entries(TRATAMIENTOS)) {
        texto += `- ${t.nombre}: ${t.precio}. (${t.info})\n`;
    }
    texto += `Ubicación: ${NEGOCIO.ubicacion}\n`;
    texto += `Agenda: ${NEGOCIO.agenda_link}\n`;
    return texto;
}

export async function generarRespuestaIA(historial) {
  try {
    const promptCompleto = SYSTEM_PROMPT + generarContextoProductos();
    const recentHistory = historial.slice(-8);
    const messages = [{ role: "system", content: promptCompleto }, ...recentHistory];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.5,
      max_tokens: 300
    });
    return completion.choices[0].message.content;
  } catch (error) {
    return "Tuve un pequeño lapsus técnico. ¿Podrías repetirme la última parte?";
  }
}
