import OpenAI from 'openai';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import { GENERAR_PROMPT } from './flow.js'; // <--- ESTO BUSCA EN SRC (EL CORRECTO)
import { checkAvailability } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente, tipoCampana = 'default', etiquetaCliente = 'NUEVO') {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago').toFormat('HH:mm');

    // USAMOS EL FLOW HUMANO (ZARA 9.9)
    const SYSTEM_PROMPT = GENERAR_PROMPT(nombreCliente, nowChile, agendaRaw, tipoCampana, etiquetaCliente);

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT }, 
                ...historial
            ],
            temperature: 0.2,
            max_tokens: 350
        });
        return runner.choices[0].message.content;
    } catch (e) { 
        console.error("Error Brain:", e);
        return "Dame un segundo, estoy verificando..."; 
    }
}
export async function transcribirAudio(url) { return "(Audio recibido)"; }
