import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "../config/personalidad.js";
import { PRODUCTOS } from "../config/productos.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historial, nombreCliente, contextoExtra = "") {
    try {
        const instrucciones = `
        ${SYSTEM_PROMPT}
        
        📚 **CONOCIMIENTO CLÍNICO (Precios Reales):**
        ${PRODUCTOS}
        
        👤 **CLIENTE:**
        - Nombre: ${nombreCliente}
        - Contexto: ${contextoExtra}
        
        ⚠️ **RECORDATORIO:**
        - Usa siempre el nombre "${nombreCliente}".
        - Si piden precio, dalo exacto.
        - ¡Cierre con doble opción!
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.7,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "¡Hola preciosa! 💖 Dame un segundo que estoy revisando la agenda.";
    }
}
