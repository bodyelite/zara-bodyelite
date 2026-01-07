import OpenAI from 'openai';
import { DateTime } from 'luxon';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';
import { FLUJO_MAESTRO } from './config/flow.js';
import { checkAvailability, crearEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PERSONALIDAD_INTOCABLE = `
IDENTIDAD:
Eres Zara, Asesora Senior de Body Elite.
- Tono: Cálido, usas emojis (✨, 🌸).
- Misión: Guiar y Concretar.
`;

export async function transcribirAudio(urlDescarga) {
    const tempPath = path.join(os.tmpdir(), `audio_${Date.now()}.ogg`);
    try {
        const writer = fs.createWriteStream(tempPath);
        const response = await axios({ url: urlDescarga, method: 'GET', responseType: 'stream', headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` } });
        response.data.pipe(writer);
        await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });
        const transcription = await openai.audio.transcriptions.create({ file: fs.createReadStream(tempPath), model: "whisper-1", language: "es" });
        fs.unlinkSync(tempPath);
        return transcription.text;
    } catch (e) { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); return null; }
}

export async function diagnosticar(historial) {
    try {
        const historiaReciente = historial.slice(-10);
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "CRM: Clasifica en 2 palabras: 'Esperando respuesta', 'En Seguimiento', 'Link Enviado', 'Posible Spam', 'Duda Técnica', 'Falla Precio'." },
                ...historiaReciente
            ],
            temperature: 0,
            max_tokens: 15
        });
        return response.choices[0].message.content;
    } catch (e) { return "Analizando..."; }
}

export async function pensar(historial, nombreCliente) {
    let agendaInfo = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const fechaHoy = nowChile.toFormat('yyyy-MM-dd HH:mm');
    const diaSemana = nowChile.toFormat('cccc', { locale: 'es' });
    const infoClinica = JSON.stringify(CLINICA);
    const infoNegocio = JSON.stringify(NEGOCIO);
    const nombreSimple = nombreCliente ? nombreCliente.split(' ')[0] : "Linda";

    const tools = [{
        type: "function",
        function: {
            name: "agendar_cita",
            description: "Reserva en Google Calendar.",
            parameters: {
                type: "object",
                properties: {
                    fecha_iso: { type: "string", description: "YYYY-MM-DD HH:mm" },
                    nombre: { type: "string" },
                    telefono: { type: "string" }
                },
                required: ["fecha_iso"]
            }
        }
    }];

    const SYSTEM_PROMPT = `
    ${PERSONALIDAD_INTOCABLE}
    HOY ES: ${diaSemana} ${fechaHoy}.
    CLIENTE: ${nombreSimple}

    📜 TU GUÍA ES EL ARCHIVO 'flow.js':
    ${FLUJO_MAESTRO}

    🧠 CÓMO USAR LA AGENDA (PASO 5):
    1. **Mira la 'DISPONIBILIDAD REAL' abajo.** (Ahí verás los próximos 7 días).
    2. **Si el cliente pide un día específico (ej: "Viernes"):** BUSCA ese día en la lista.
       - Si hay horas: Dile "Sí tengo. ¿Qué hora te acomoda más?" (Y ofrece 2 opciones).
       - Si NO hay horas ese día: Di "Ese día está full, pero tengo el [Día Alternativo]".
    3. **Si el cliente NO dice día:** Ofrece tú la hora más cercana disponible.

    📅 DISPONIBILIDAD REAL:
    ${agendaInfo}

    DATOS:
    ${infoClinica}
    ${infoNegocio}
    `;

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            tools: tools,
            tool_choice: "auto", 
            temperature: 0.1
        });
        const msg = runner.choices[0].message;
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                const confirmacion = exito ? "¡Listo! Reserva confirmada para " + args.fecha_iso + ". ¡Te esperamos! ✨" : "Error técnico.";
                const secondResponse = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial, msg, { role: "tool", tool_call_id: toolCall.id, content: confirmacion }]
                });
                return secondResponse.choices[0].message.content.replace(/^"|"$/g, '');
            }
        }
        return msg.content.replace(/^"|"$/g, ''); 
    } catch (e) { return "Hola! 🌸"; }
}
