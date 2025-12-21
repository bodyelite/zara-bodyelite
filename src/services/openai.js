import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "../config/personalidad.js";
import { PRODUCTOS } from "../config/productos.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(historial, nombreCliente, contextoExtra = "") {
    try {
        // INYECCIÓN DE PERSONALIDAD "BKN" Y RESTRICCIÓN DE LONGITUD
        const instrucciones = `
        ${SYSTEM_PROMPT}
        
        📚 **TUS PRODUCTOS Y PRECIOS (NO INVENTES):**
        ${PRODUCTOS}
        
        👤 **CLIENTE ACTUAL:** "${nombreCliente}"
        🌍 **CONTEXTO:** ${contextoExtra}
        
        🔥 **REGLAS DE ORO (ESTRICTAS):**
        1. **CERO LADRILLOS:** Tu respuesta debe ser CORTA (Máx 40 palabras).
        2. **TONO:** Eres cercana, experta y "bkn". Usa emojis pero no parezcas un folleto. Habla como una amiga chilena experta.
        3. **PRECIOS:** Si preguntan "desde", di el menor precio de la categoría. Si preguntan uno específico, da el precio exacto.
        4. **NO REPITAS SALUDOS:** Si en el historial ya saludaste, ve directo al grano.
        5. **CIERRE:** Siempre termina con una pregunta o doble opción para que el cliente responda.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.6, // Bajamos un poco para que no alucine tanto
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        return "¡Ups! Se me fue la señal un segundo 😅. ¿Me repites?";
    }
}
