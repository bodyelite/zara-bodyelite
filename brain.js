import OpenAI from 'openai';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import { GENERAR_PROMPT } from './flow.js';
import { checkAvailability } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente, tipoCampana = 'default', etiquetaCliente = 'NUEVO', notas = []) {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago').toFormat('HH:mm');

    // Inyectamos las notas para que Zara tenga memoria de lo que pasó en el monitor
    const contextoNotas = notas.length > 0 
        ? `IMPORTANTE - Lo que ha pasado con este cliente: ${notas.map(n => n.text).join(' | ')}` 
        : "Sin notas previas.";

    const SYSTEM_PROMPT = GENERAR_PROMPT(nombreCliente, nowChile, agendaRaw, tipoCampana, etiquetaCliente, contextoNotas);

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.3,
            max_tokens: 400
        });
        return runner.choices[0].message.content;
    } catch (e) { 
        console.error("Error Brain:", e);
        return "Dame un segundo, estoy verificando los detalles para ti..."; 
    }
}
