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
        
        📚 **CONOCIMIENTO CLÍNICO:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🛡️ **PROTOCOLOS DE RESPUESTA (OBLIGATORIOS):**
        
        1. **SI PIDEN INFO/¿EN QUÉ CONSISTE?:**
           - ❌ NO des precio todavía.
           - ✅ EXPLICA la tecnología (HIFU/Lipoláser) y el beneficio (reducir/tensar).
           - ✅ ILUSIONA: "Es ideal para esa zona difícil".
           - 🔚 TERMINA validando: "¿Te hace sentido algo así?".

        2. **SI PREGUNTAN "RESULTADOS":**
           - ⚠️ RESPUESTA OBLIGATORIA: "Los resultados siempre dependen de tu evaluación personal, ya que cada cuerpo y objetivo es único. Por eso usamos IA para evaluarte."

        3. **SI PREGUNTAN POR PERMISOS/SEREMI:**
           - 🛡️ RESPUESTA OBLIGATORIA: "Nuestra clínica cuenta con todos los protocolos clínicos y sanitarios necesarios para tu seguridad." (NO des más detalles).

        4. **SI PREGUNTAN PRECIO (SOLO AQUÍ):**
           - Da el precio exacto o "Desde $X".
           - AHORA SÍ ofrece: "¿Te gustaría que te llamemos para explicarte mejor o prefieres agendar tu evaluación gratis online?".

        5. **ALERTA DE LLAMADO ({CALL}):**
           - ÚSALA SOLO SI el cliente ESCRIBE SU NÚMERO de teléfono explícitamente.
           - Si solo pregunta "¿dónde llamo?", responde: "Déjame tu número aquí y te contactamos". (NO uses {CALL} todavía).

        🚦 **ETIQUETAS DE CONTROL:**
        - {WARM}: Dudas, info, precios, ubicación. (NO ALERTA).
        - {CALL}: SOLO si el cliente entregó su NÚMERO telefónico. (DISPARA ALERTA).
        - {HOT}: Si pide Link o dice "voy a agendar". (NO ALERTA).
        - {ALERT}: Quejas graves. (DISPARA ALERTA).
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.3, // Bajamos temperatura para que obedezca estrictamente los protocolos
            max_tokens: 80,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundo, se me fue la señal. 😅 ¿Me decías?";
    }
}
