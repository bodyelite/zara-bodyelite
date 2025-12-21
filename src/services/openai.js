import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "../config/personalidad.js";
import { PRODUCTOS } from "../config/productos.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historial, nombreCliente) {
    try {
        const instrucciones = `
        ${SYSTEM_PROMPT}
        
        VADEMÉCUM CLÍNICO:
        ${PRODUCTOS}
        
        PACIENTE: "${nombreCliente}"
        
        Nota: Sé breve (máx 50 palabras). Usa emojis. Habla como chilena experta.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5,
            max_tokens: 250,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
