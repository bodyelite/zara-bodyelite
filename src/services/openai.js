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
        
        📚 **LISTA DE PRECIOS:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        🔥 **REGLAS DE ORO (MODO CHAT RÁPIDO):**
        1. **LONGITUD:** ¡CORTA! Máximo 25-30 palabras. La gente no lee biblias.
        2. **PRECIOS:** Si preguntan por un tratamiento general (ej: "Botox", "Reductivo"), **SIEMPRE** di el precio MÁS BAJO de esa categoría usando "Desde $X". (Ej: "Planes con Botox desde $281.600").
        3. **GANCHO:** En tu primera respuesta técnica, menciona SIEMPRE que la **Evaluación con IA es GRATIS**.
        4. **ESTILO:** Fresco, chileno sutil, usa 1 emoji por mensaje. No seas formal.
        
        🚦 **ETIQUETAS INTERNAS (PARA EL SISTEMA):**
        - Usa {CALL} SOLO si dicen "llámame" o dan su número. (ESTO AVISA AL STAFF).
        - Usa {ALERT} si hay quejas.
        - Para todo lo demás (preguntas, precios, agendar), NO uses etiquetas especiales, el sistema lo manejará.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.5, 
            max_tokens: 60, // Limite forzado técnico para evitar ladrillos
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
