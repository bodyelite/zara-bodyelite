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
        
        📚 **TUS ARGUMENTOS CLÍNICOS:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        ⚠️ **CONTROL DE CALIDAD:**
        1. **NO DES PRECIO SI NO TE LO PIDEN.** Primero enamora.
        2. **SI EL CLIENTE DUDA, EXPLICA MEJOR.** No huyas a la "evaluación gratis" como salida fácil.
        3. **SELECCIONA EL PLAN CORRECTO:**
           - Piel Seca -> Face Light.
           - Arrugas -> Face Antiage.
           - Flacidez -> Face Elite.
           - NO ofrezcas el plan de $358k para una piel seca.
        4. **FORMATO:** Corto, amable, con emojis. Máx 50 palabras.
        
        🚦 **ETIQUETAS:**
        - {CALL}: Solo si dan el número.
        - {HOT}: Si piden agenda/link.
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
        return "{WARM} Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
