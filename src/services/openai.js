import OpenAI from "openai";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../../config/knowledge_base.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(mensajeUsuario) {
  try {
    // Le pasamos a la IA los precios actuales para que los lea
    const contexto = "DATOS ACTUALIZADOS:\n" + JSON.stringify(TRATAMIENTOS, null, 2);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cerebro rápido y barato
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\n" + contexto },
        { role: "user", content: mensajeUsuario }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error OpenAI:", error);
    // Si falla la IA (ej. se acabó el saldo), damos un mensaje amable
    return "¡Ups! Estoy actualizando mis neuronas 💆‍♀️. ¿Me podrías preguntar de nuevo en unos segundos?";
  }
}
