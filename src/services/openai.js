import OpenAI from "openai";
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../../config/knowledge_base.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historialChat) {
  try {
    // 1. Preparamos el contexto del negocio
    const contextoNegocio = "DATOS CLINICOS OFICIALES:\n" + JSON.stringify(TRATAMIENTOS, null, 2);
    
    // 2. Le decimos a la IA: "Usa el historial para mantener la coherencia clínica"
    const mensajesParaIA = [
      { 
        role: "system", 
        content: SYSTEM_PROMPT + "\n\n" + contextoNegocio + "\n\nIMPORTANTE: Usa el historial de la conversación para saber de qué tratamiento estamos hablando. Si el usuario pregunta '¿duele?', responde sobre el dolor DEL TRATAMIENTO QUE ESTABAN DISCUTIENDO ANTES." 
      },
      ...historialChat // <--- AQUÍ INSERTAMOS LA MEMORIA
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: mensajesParaIA,
      temperature: 0.5, // Bajamos un poco la creatividad para que sea más precisa clínicamente
      max_tokens: 350
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error OpenAI:", error);
    return "¡Ups! Estoy ordenando mis fichas clínicas 📂. ¿Podrías repetirme la pregunta?";
  }
}
