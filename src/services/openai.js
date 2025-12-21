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
        
        📚 **ENCICLOPEDIA CLÍNICA BODY ELITE:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        ⚠️ **CONTROL FINAL:**
        - Si preguntan por lipolíticos -> SÍ TENEMOS (LFP).
        - No repitas "¿Te imaginas el cambio?". Pregunta "¿Te explico más?".
        - Si el cliente cambia de tema (ej: de cara a cuerpo), fluye con él, no reinicies.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5, 
            max_tokens: 250, 
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "Dame un segundito 😅. ¿Qué me decías?";
    }
}
