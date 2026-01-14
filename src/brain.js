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
import { FLUJO_CAMPAÑA } from './config/flow_campaign.js';
import { checkAvailability, crearEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PERSONALIDAD_BASE = `
IDENTIDAD:
Eres Zara, Asesora Senior de Body Elite.
- Tono: Cálido, usas emojis (✨, 🌸), pero eres EJECUTIVA.
- Misión: Guiar y Concretar Citas.
- MEMORIA: Lee los mensajes anteriores para no repetir preguntas.
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
                { role: "system", content: "CRM: Clasifica en 2 palabras: 'Esperando respuesta', 'En Seguimiento', 'Link Enviado', 'Posible Spam', 'Duda Técnica', 'Falla Precio', 'Cerrado/Viaje', 'Lead Campaña'." },
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

    // --- 1. DETECCIÓN DE ORIGEN (ENRUTADOR) ---
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    // Palabras clave que vienen SOLO de los botones de tus anuncios
    const esDeCampaña = historialTexto.includes("quiero mi evaluación") || 
                        historialTexto.includes("vi el anuncio") ||
                        historialTexto.includes("35% off");

    // Seleccionamos el guion correcto
    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;

    // --- 2. CIRCUIT BREAKER (CIERRE) ---
    const ultimoMensaje = historial.length > 0 ? historial[historial.length - 1].content.toLowerCase() : "";
    const palabrasCierre = ["gracias", "viajo", "semana que viene", "despues te hablo", "te aviso", "muy amable", "ok gracias", "hasta pronto", "chau"];
    const esCierre = palabrasCierre.some(p => ultimoMensaje.includes(p));

    const SYSTEM_PROMPT = `
    ${PERSONALIDAD_BASE}
    HOY ES: ${diaSemana} ${fechaHoy}.
    CLIENTE: ${nombreSimple}
    
    ${esDeCampaña ? "MODO: ATENCIÓN DE CAMPAÑA (Responde según el interés exacto: Glúteos, Lipo o Rostro)." : "MODO: CONSULTIVO GENERAL."}

    ${esCierre ? "⚠️ MODO CIERRE: El cliente se despide. Di solo: '¡Perfecto [Nombre]! Quedo atenta. ¡Lindo día! ✨' y corta." : `
    📜 TU GUÍA MAESTRA ES:
    ${GUION_ACTIVO}
    `}

    📅 DISPONIBILIDAD REAL:
    ${agendaInfo}

    DATOS:
    ${infoClinica}
    ${infoNegocio}
    `;

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
                const confirmacion = exito ? "¡Listo! Reserva confirmada para " + args.fecha_iso + ". ¡Te esperamos! ✨" : "Ups, justo me tomaron esa hora. ¿Probamos otra?";
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
