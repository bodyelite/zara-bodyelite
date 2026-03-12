import OpenAI from 'openai';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import { GENERAR_PROMPT } from './flow.js';
import { checkAvailability, agendarEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCliente, tipoCampana = 'default', etiquetaCliente = 'NUEVO') {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const horaActual = nowChile.toFormat('HH:mm');
    const hoyStr = nowChile.toFormat('yyyy-MM-dd');
    
    let promptBase = GENERAR_PROMPT(nombreCliente, horaActual, agendaRaw, tipoCampana, etiquetaCliente);
    
    const OVERRIDE_REGLAS = `
=== 🚨 OVERRIDE DE COMPORTAMIENTO COMERCIAL 🚨 ===
IGNORA CUALQUIER REGLA ANTERIOR QUE TE PROHIBA HABLAR DE PROMOCIONES.
1. PROMOCIONES (EL GANCHO): Si preguntan por promociones o qué ofrecen, NUNCA digas que no hay. Tienes excelentes opciones. Pregunta qué zona del cuerpo o rostro buscan mejorar para guiarlos.
2. PRECIOS: Da valores referenciales ("desde"), aclarando que el plan exacto se define con el Escáner IA.
3. HORARIOS INQUEBRANTABLES: La hora actual es ${horaActual}. NUNCA ofrezcas horas en el pasado ni fuera del cierre de hoy. Lee la DISPONIBILIDAD ACTUAL estrictamente.
4. TONO: No seas un robot. Habla natural, empática y comercial. No termines cada mensaje con una pregunta forzada. Sé consultiva.
`;

    const contextoExtra = `\n\n[SISTEMA]: Hoy es ${hoyStr}. Si el cliente confirma fecha y hora, es OBLIGATORIO usar agendar_cita.`;
    const SYSTEM_PROMPT = promptBase + "\n" + OVERRIDE_REGLAS + contextoExtra;

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
            temperature: 0.3,
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
