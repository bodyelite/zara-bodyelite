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
        
        📚 **MANUAL DE DIAGNÓSTICO:**
        ${PRODUCTOS}
        
        👤 **PACIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        ⚠️ **REGLAS CRÍTICAS:**
        1. **NO VENDAS SIN SABER QUÉ DUELE.** Si no sabes el síntoma, PREGUNTA.
        2. **RESPETA LAS CONTRAINDICACIONES.** Si dice "No Botox", ofrece Face Light.
        3. **SEDUCCIÓN:** Explica el beneficio ("te quita cara de cansada") antes que la máquina ("Pink Glow").
        4. **LARGO:** Mantén respuestas de chat (máx 40 palabras), amigables y con 1 emoji.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.4, // Precisión clínica
            max_tokens: 200,
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundito 😅. ¿Qué me decías?";
    }
}
