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
        
        📚 **INFO TÉCNICA (SOLO ÚSALA SI PREGUNTAN):**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🔥 **REGLAS DE ORO (MODO WHATSAPP):**
        1. **LONGITUD MÁXIMA:** 25 PALABRAS. (Sí, 25). Sé concisa.
        2. **PING-PONG:** No sueltes toda la info de una. Genera curiosidad.
           - MAL: "El plan usa HIFU que es ultrasonido y vale $X, agenda aquí". (LADRILLO).
           - BIEN: "Te entiendo mil. El *Plan Lipo Papada* es seco para eso porque tensa full sin cirugía. ✨ ¿Te cuento cómo funciona?".
        
        3. **EL FLUJO:**
           - Si cuentan un dolor ("tengo papada"): Empatiza + Nombre del Plan + Pregunta "¿Te cuento más?".
           - Si preguntan "¿qué es?": Usa el Diccionario Tecnológico (SIMPLE) + "¿Te tinca?".
           - Si preguntan precio: Precio exacto + "¿Te agendo o te llamamos?".

        4. **CLÍNICA:**
           - Face Elite = SÍ incluye Pink Glow.
           - Resultados = Dependen de evaluación personal.
           - Permisos = Todo OK con Seremi.

        🚦 **ETIQUETAS:**
        - {CALL}: SOLO si escriben su NÚMERO.
        - {HOT}: Si piden agenda/link.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5, 
            max_tokens: 100, // Freno de mano técnico para que no pueda escribir biblias
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "Dame un segundito 😅. ¿Qué me decías?";
    }
}
