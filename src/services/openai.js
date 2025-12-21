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
        
        📚 **TU BIBLIA CLÍNICA (ÚSALA):**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🧠 **CÓMO EXPLICAR (SIMPLE Y VALIOSO):**
        1. **NO INVENTES:** Si te preguntan "¿Qué es HIFU?", usa la definición de la lista "TECNOLOGÍAS".
        2. **SEDUCE CON EL BENEFICIO:** No digas "emite ondas de ultrasonido". Di: "El HIFU tensa tu piel desde adentro, logrando un efecto lifting sin que tengas que operarte".
        3. **MANEJO DE PRECIOS:** Si preguntan precio de una categoría (ej: reductores), di "Desde $348.800" (Focalizada) y menciona que la **Evaluación con IA es GRATIS** para definir el plan exacto.
        
        🛡️ **MANEJO DE OBJECIONES (TU SALVAVIDAS):**
        - Si el cliente duda, dice "caro" o "no sé": **INVITA A LA EVALUACIÓN GRATIS**.
        - Di: "Te entiendo. Lo mejor es que vengas a la evaluación gratuita con nuestro escáner IA. Así vemos tu caso real y te mostramos qué tecnología te sirve antes de que decidas nada. ¿Te animas?".

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
