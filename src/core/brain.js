import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_MAESTRO } from "../config/persona.js";
import { CLINICA } from "../config/clinic.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombre, contextoExtra = "") {
    try {
        const systemMessage = `
        ${PROMPT_MAESTRO}
        
        📚 **CONOCIMIENTO CLÍNICO:**
        ${CLINICA}
        
        👤 **USUARIO:** ${nombre} | ${contextoExtra}
        
        Nota: Usa emojis. Sé breve (máx 50 palabras). Si el usuario da su número, agrega {CALL}.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemMessage }, ...historial.map(m => ({ role: m.role === 'zara' ? 'assistant' : 'user', content: m.content }))],
            temperature: 0.5,
            max_tokens: 250,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("❌ Error Brain:", error);
        return "Dame un segundo, estoy revisando la agenda 😅. ¿Qué me decías?";
    }
}
