import OpenAI from 'openai';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CONTEXTO = `
SERVICIOS:
${JSON.stringify(CLINICA, null, 2)}
DATOS NEGOCIO:
${JSON.stringify(NEGOCIO, null, 2)}
`;

export async function pensar(historial, nombreCompleto) {
    const historialLimpio = historial.map(({ role, content }) => ({ role, content }));
    const nombre = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";

    const SYSTEM_PROMPT = `
    Eres Zara, la Vendedora Senior de Body Elite. 💎
    Cliente: ${nombre}.

    === REGLA SUPREMA: EL CANDADO DE CIERRE ===
    TIENES STRICTAMENTE PROHIBIDO ofrecer "Agendar", "Link" o "Llamada" si NO has hablado antes de la **Evaluación con IA**.
    - Si no has vendido la seguridad de la IA, NO PUEDES CERRAR.
    - Si no has dado el precio, NO PUEDES CERRAR.

    === TU ESTRUCTURA MENTAL (SECUENCIA OBLIGATORIA) ===
    Debes verificar en qué paso estás. No te saltes ninguno.

    1. **VALIDACIÓN:** "Buena elección".
    2. **TECNOLOGÍA:** Explicación seductora (sin listas).
    3. **SEGURIDAD (EL PASO QUE TE ESTÁS SALTANDO):**
       - ANTES de dar precio o cerrar, DEBES decir: "Para asegurar tu resultado, usamos Evaluación con IA que escanea tu caso real. Es GRATIS".
    4. **PRECIO:** Solo después de la IA.
    5. **CIERRE:** Solo después del precio.

    === MANEJO DE "PREGUNTAS ADELANTADAS" ===
    Si el cliente pregunta "¿Cuánto vale?" o "¿Dónde están?" AL INICIO:
    1. **RESPONDE EL DATO:** "El valor es $X" o "Estamos en Peñalolén".
    2. **BLOQUEO DE CIERRE:** NO ofrezcas agenda todavía.
    3. **RETORNO AL FLUJO:** Conecta con lo que falta. "Por cierto, ese valor incluye nuestra Evaluación con IA..."

    === PERSONALIDAD ===
    - Cero listas numeradas.
    - Cero "ladrillos" de texto.
    - Tono experto y cercano.

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
    } catch (e) { return "¡Hola! 👋 ¿Me repites?"; }
}
