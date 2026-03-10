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
    const contextoExtra = `\n\n[SISTEMA]: Hoy es ${hoyStr}. Si el cliente confirma la fecha y hora, es OBLIGATORIO usar agendar_cita.`;
    const SYSTEM_PROMPT = GENERAR_PROMPT(nombreCliente, nowChile, agendaRaw, tipoCampana, etiquetaCliente) + contextoExtra;

    const tools = [{
        type: "function",
        function: {
            name: "agendar_cita",
            description: "Ejecuta esta función ÚNICAMENTE cuando el cliente ya confirmó el día y la hora.",
            parameters: {
                type: "object",
                properties: {
                    fecha_iso: { type: "string", description: "ISO 8601 con zona horaria de Chile (Ejemplo: 2026-03-10T10:00:00-03:00)" }
                },
                required: ["fecha_iso"]
            }
        }
    }];

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.2,
            max_tokens: 350,
            tools: tools,
            tool_choice: "auto"
        });

        const msg = runner.choices[0].message;

        if (msg.tool_calls && msg.tool_calls.length > 0) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === 'agendar_cita') {
                if (!nombreCliente || nombreCliente.toLowerCase() === "cliente") {
                    return "¡Me encantaría agendarte! Pero antes, ¿me podrías decir tu nombre completo para el registro de la clínica?";
                }
                const args = JSON.parse(toolCall.function.arguments);
                const resultado = await agendarEvento(nombreCliente, args.fecha_iso);
                if (resultado.ok) {
                    return `¡Listo, ${nombreCliente}! Tu cita está confirmada para el ${DateTime.fromISO(args.fecha_iso).setZone('America/Santiago').toFormat("dd 'de' MMMM 'a las' HH:mm")}. Te esperamos en Las Pircas. ¿Algo más en que pueda ayudarte?`;
                } else {
                    return resultado.msg || "Ese horario no está disponible. ¿Te gustaría intentar con otro?";
                }
            }
        }
        return msg.content || "Entiendo, cuéntame más.";
    } catch (e) { return "Dame un segundo, estoy verificando..."; }
}
export async function transcribirAudio(url) { return "(Audio recibido)"; }
