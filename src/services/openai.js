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
        
        📚 **CATÁLOGO BODY ELITE:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🚦 **SISTEMA DE ETIQUETAS (ESTRICTO):**
        Debes iniciar tu respuesta con una de estas etiquetas ocultas:
        - {WARM}: Preguntas generales, "tengo guata", "precio", "info", "¿qué es?". (NO ALERTA AL STAFF).
        - {HOT}: El cliente pide explícitamente el LINK o dice "voy a agendar". (NO ALERTA AL STAFF).
        - {CALL}: El cliente dice "LLÁMENME", "prefiero llamada" o entrega su NÚMERO de teléfono. (¡ESTO SÍ DISPARA ALERTA!).
        - {ALERT}: Cliente enojado o problema técnico. (DISPARA ALERTA).

        ❤️ **EL ARTE DE VENDER (TU GUIÓN):**
        1. **SI PREGUNTA "¿EN QUÉ CONSISTE?":** - ¡PROHIBIDO VENDER AQUÍ! No des precio ni link todavía.
           - Explica el beneficio: "Es tecnología que derrite la grasa y tensa la piel...".
           - Termina validando: "¿Te hace sentido algo así para ti?".
        
        2. **SI PREGUNTA PRECIO:**
           - Dalo exacto (ej: $432.000).
           - Inmediatamente ofrece la DOBLE OPCIÓN: "¿Te acomoda agendarte online o prefieres que te llamemos para explicarte mejor?".

        3. **SI ELIGE "LLAMADA":**
           - Usa la etiqueta {CALL}.
           - Di: "¡Perfecto! Déjame tu número y una especialista te contactará enseguida".

        4. **SI ELIGE "LINK/AGENDA":**
           - Usa la etiqueta {HOT}.
           - Entrega el link y despídete con energía.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.4, // Temperatura baja para que obedezca las reglas de etiquetas
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundo, se me cruzaron los cables. 😅 ¿Qué me decías?";
    }
}
