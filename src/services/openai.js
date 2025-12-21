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
        
        📚 **TUS FICHAS TÉCNICAS:**
        ${PRODUCTOS}
        
        👤 **DATOS DEL CLIENTE:**
        - Nombre: "${nombreCliente}"
        - Contexto: ${contextoExtra}
        
        ⚠️ **INSTRUCCIÓN FINAL AL MODELO:**
        - Respeta el **MAPA DE VENTA** de personalidad.js paso a paso.
        - NO inventes precios. Usa los de la lista.
        - Si el cliente pregunta precio, SIEMPRE ofrece la **Evaluación Gratis** en la misma respuesta.
        - Sé breve. Máximo 40-50 palabras por mensaje.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5,
            max_tokens: 200,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
