import OpenAI from "openai";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../../config/knowledge_base.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(mensajeUsuario) {
  try {
    // Le pasamos a la IA los precios y la info de tu negocio
    const contexto = "DATOS OFICIALES:\n" + JSON.stringify(TRATAMIENTOS, null, 2);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // El modelo rápido y económico
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\n" + contexto },
        { role: "user", content: mensajeUsuario }
      ],
      temperature: 0.7,
      max_tokens: 350
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error OpenAI:", error);
    return "¡Ups! Estoy ajustando mis neuronas 💆‍♀️. ¿Me preguntas de nuevo en un segundo?";
  }
}
