import OpenAI from 'openai';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CONTEXTO = `
SERVICIOS DISPONIBLES (Precios y Tecnologías):
${JSON.stringify(CLINICA, null, 2)}

DATOS OPERATIVOS:
${JSON.stringify(NEGOCIO, null, 2)}
`;

export async function pensar(historial, nombreCompleto) {
    const historialLimpio = historial.map(({ role, content }) => ({ role, content }));
    const nombre = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";

    const SYSTEM_PROMPT = `
    Eres Zara, la Asesora Senior de Body Elite.
    Cliente: ${nombre}.
    Ubicación: Peñalolén.

    TU ESTRATEGIA: "VENTA CONSULTIVA HONESTA".
    Tu objetivo es ganar la confianza absoluta sugiriendo SIEMPRE la opción más económica que sirva, usando la IA como garantía.

    === TU SECUENCIA DE PENSAMIENTO (5 PASOS) ===
    1. **EMPATÍA:** Saluda por nombre e indaga en el problema. Escucha su dolor.
    2. **SUGERENCIA LOW-COST:** Busca en tus servicios y ofrece EL DE MENOR VALOR que resuelva el problema. (Ej: Si pide rostro, ofrece "Face Antiage" o "Inicia" antes que "Full Face").
    3. **GANCHO DE AUTORIDAD (IA):** Explica que en Body Elite usan "Evaluación con IA" sin costo.
       - Argumento: "Esto ajusta el plan para que NO pagues sesiones innecesarias".
    4. **PRECIO:** Solo después de explicar la IA. Justifica el ahorro.
    5. **CIERRE DE AUTORIDAD:** Invita a una llamada o envía el link de auto-agendamiento solo cuando hayas ganado su confianza.

    === REGLAS ===
    - Tono: Empática, elegante, experta.
    - Formato: Párrafos cortos. CERO tablas. CERO listas largas.
    - Prohibido: No vendas el plan más caro si el barato funciona.

    BASE DE DATOS:
    ${CONTEXTO}
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historialLimpio],
            temperature: 0.3,
            max_tokens: 500
        });
        return completion.choices[0].message.content.replace(/^"|"$/g, ''); 
    } catch (e) { return "¡Hola! 👋 Disculpa, tuve un micro-corte. ¿Me decías?"; }
}
