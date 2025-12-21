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
        
        📚 **ARGUMENTOS CLÍNICOS (ÚSALOS):**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        ⚠️ **INSTRUCCIÓN DE CONTROL:**
        - **ETIQUETAS:**
          * {CALL}: Úsala SOLO si el cliente te da su número explícitamente o dice "llámenme".
          * {HOT}: Si pide el link o dice "voy a agendar".
        - **TONO:** Experta, Segura, Chilena, Amable.
        - **FORMATO:** No uses listas numeradas aburridas. Conversa.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5, 
            max_tokens: 220, 
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
