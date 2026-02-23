import OpenAI from 'openai';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import { GENERAR_PROMPT } from './flow.js';
import { checkAvailability, agendarEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente, tipoCampana = 'default', etiquetaCliente = 'NUEVO') {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago').toFormat('HH:mm');
    const hoyStr = DateTime.now().setZone('America/Santiago').toFormat('yyyy-MM-dd');

    // Inyectamos la fecha actual y la orden de usar la herramienta
    const contextoExtra = `\n\n[SISTEMA]: Hoy es ${hoyStr}. Si el cliente confirma la fecha y hora, es OBLIGATORIO usar la herramienta agendar_cita.`;
    const SYSTEM_PROMPT = GENERAR_PROMPT(nombreCliente, nowChile, agendaRaw, tipoCampana, etiquetaCliente) + contextoExtra;

    const tools = [
        {
            type: "function",
            function: {
                name: "agendar_cita",
                description: "Ejecuta esta función ÚNICAMENTE cuando el cliente ya confirmó el día y la hora de su reserva.",
                parameters: {
                    type: "object",
                    properties: {
                        fecha_iso: { 
                            type: "string", 
                            description: `La fecha y hora exacta acordada en formato ISO 8601 con zona horaria de Chile. Ejemplo para hoy a las 15:00: ${hoyStr}T15:00:00-03:00` 
                        }
                    },
                    required: ["fecha_iso"]
                }
            }
        }
    ];

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT }, 
                ...historial
            ],
            temperature: 0.2,
            max_tokens: 350,
            tools: tools,
            tool_choice: "auto"
        });

        const msg = runner.choices[0].message;

        // Si Zara decide que es momento de agendar:
        if (msg.tool_calls && msg.tool_calls.length > 0) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === 'agendar_cita') {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await agendarEvento(nombreCliente, args.fecha_iso);
                
                if (exito) {
                    return `¡Perfecto! Tu cita ha quedado confirmada y agendada en nuestro calendario. ¿Te puedo ayudar con algo más?`;
                } else {
                    return `Tuve un inconveniente técnico al guardar tu cita. En breve alguien del equipo te confirmará manualmente.`;
                }
            }
        }

        return msg.content || "Entiendo, cuéntame más.";
    } catch (e) { 
        console.error("Error Brain:", e);
        return "Dame un segundo, estoy verificando..."; 
    }
}
export async function transcribirAudio(url) { return "(Audio recibido)"; }