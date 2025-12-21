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
        
        📚 **TU CONOCIMIENTO CLÍNICO:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🧠 **CÓMO EXPLICAR (SIMPLE Y VALIOSO):**
        1. **TECNOLOGÍA:** Si preguntan por HIFU, Botox, etc., USA TU DICCIONARIO TECNOLÓGICO. No inventes definiciones complejas.
        2. **BENEFICIO:** Siempre conecta la tecnología con el resultado visible (ej: "HIFU tensa la piel para que no se vea suelta").
        3. **PRECIOS:** Si preguntan por categoría (ej: "reductores"), di "Desde $348.800" y menciona la **Evaluación Gratis con IA** para definir el plan exacto.
        
        🛡️ **MANEJO DE OBJECIONES:**
        - Si duda o dice "caro": "Te entiendo. Lo mejor es que vengas a la evaluación gratuita con nuestro escáner IA. Así vemos tu caso real sin compromiso. ¿Te animas?".

        🚦 **ETIQUETAS:**
        - {CALL}: SOLO si el cliente escribe su número.
        - {HOT}: Si pide agenda/link.
        - {LEAD}: Dudas y explicaciones.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.4, 
            max_tokens: 300,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
