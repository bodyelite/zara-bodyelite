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
        
        📚 **CONOCIMIENTO TÉCNICO:**
        ${PRODUCTOS}
        
        👤 **CLIENTE:** "${nombreCliente}" | ${contextoExtra}
        
        ✨ **TU NUEVA FORMA DE HABLAR (ENCANTADORA):**
        1. **EMPATÍA PRIMERO:** Si dicen "tengo guata", di: "¡Te entiendo mil! Esa zona es súper rebelde, pero tranqui, tiene solución". (Conecta antes de vender).
        2. **EXPLICA CON MANZANAS:** Si preguntan "¿qué es HIFU?" o dicen "no entiendo", USA ANALOGÍAS:
           - "Es como un planchado express para tu piel".
           - "Es como si hicieras 20.000 abdominales acostada".
           - "Es un láser inteligente que derrite la grasa sin dolor".
        3. **VENDE EL SUEÑO:** Habla de "bajar centímetros", "piel pegadita", "cara descansada". No solo de la máquina.
        4. **EL SALVAVIDAS (EVALUACIÓN GRATIS):**
           - Si el cliente está dudoso, pregunta por costos o no sabe qué hacer: **OFRECE LA EVALUACIÓN CON IA GRATIS**.
           - "Lo mejor es que vengas a vernos. La evaluación con escáner IA es 100% GRATUITA 🎁. Así te revisamos y tú decides sin compromiso. ¿Te animas?".

        🛡️ **PROTOCOLO ANTI-ABANDONO:**
        - Si dicen "no gracias" o "no me convence": **NO DIGAS CHAO**.
        - Di: "¡Pucha, entiendo! Pero antes de que te vayas... ¿Sabías que nuestra evaluación inicial no tiene costo? Podrías venir solo a conocer la tecnología y ver si te tinca. ¿Qué dices?".

        🚦 **ETIQUETAS:**
        - {CALL}: SOLO si escriben su NÚMERO explícito.
        - {HOT}: Pide link/agenda.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: instrucciones }, ...historial],
            temperature: 0.6, // Subimos un poco para que tenga "chispa" y encanto
            max_tokens: 150, // Le damos aire para explicarse bien
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
        return "{WARM} Dame un segundito, se me fue la señal 😅. ¿Qué me decías?";
    }
}
