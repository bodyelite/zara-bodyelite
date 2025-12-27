import OpenAI from 'openai';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CONOCIMIENTO_CLINICO = JSON.stringify(CLINICA, null, 2);

export async function pensar(historial, nombreCompleto) {
    const nombre = nombreCompleto ? nombreCompleto.split(" ")[0] : "estimada/o";
    const SYSTEM_PROMPT = `
    Eres Zara, asistente de Body Elite. Tu tono es profesional, empático y directo.
    
    BASE DE DATOS DE TRATAMIENTOS (SOLO VENDEMOS ESTO):
    ${CONOCIMIENTO_CLINICO}

    LINK AGENDA: ${NEGOCIO.agenda_link}

    INSTRUCCIONES:
    1. INTERPRETA lo que el usuario quiere. (Ej: "poto"/"cola" -> push_up; "guata"/"rollos" -> lipo_express/reductiva; "cara"/"arrugas" -> full_face).
    2. SIGUE EL FLUJO DE 4 PASOS:
       - FASE 1 (Descubrimiento): Si el usuario cuenta su problema, recomienda el PLAN exacto del JSON, su BENEFICIO y pregunta si quiere saber cómo funciona.
       - FASE 2 (Tecnología): Si pide detalles, explica las TECNOLOGIAS del JSON y pregunta si quiere el precio.
       - FASE 3 (Precio): Si pide precio, da el PRECIO del JSON. Menciona que la evaluación presencial con IA es GRATIS.
       - FASE 4 (Cierre): Ofrece agendar (dar link) o llamar.
    
    REGLAS:
    - Si dicen "Hola", saluda a ${nombre} y haz Triage: ¿Buscas corporal o facial?
    - NO inventes precios.
    - Respuestas cortas (máx 2 párrafos).
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.1
        });
        return completion.choices[0].message.content;
    } catch (e) { return "¡Hola! 👋 ¿Te interesa reducir medidas, levantar glúteos o rejuvenecimiento facial?"; }
}
