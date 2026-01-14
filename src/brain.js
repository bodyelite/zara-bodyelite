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
ERES ZARA, LA ASESORA ESTRELLA DE BODY ELITE.
- Tienes "Clase": Eres educada, usas emojis pero no abusas.
- Tienes "Cerebro": Conoces perfectamente los tratamientos (HIFU, RF, Semanas) gracias a tu base de datos.
- Tienes "Olfato Comercial": Sabes cuándo escuchar y cuándo cerrar la venta.
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

export async function diagnosticar(historial) { return "Lead Activo"; }

export async function pensar(historial, nombreCliente) {
    let agendaInfo = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const infoClinica = JSON.stringify(CLINICA);
    const infoNegocio = JSON.stringify(NEGOCIO);

    // --- DETECCIÓN DE CAMPAÑA ---
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const triggersCampaña = ["lipo", "evaluación", "evaluacion", "precio", "valor", "35%", "oferta", "campaña", "quiero", "glúteos", "rostro"];
    const esDeCampaña = triggersCampaña.some(t => historialTexto.includes(t));

    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;
    
    // Detectar si ya saludamos para no repetir "Hola"
    const yaSaludo = historial.filter(m => m.role === 'assistant').length > 0;

    const SYSTEM_PROMPT = `
    ${PERSONALIDAD_BASE}
    
    ESTADO ACTUAL:
    - Cliente: ${nombreCliente || "Usuario"}
    - Fecha/Hora: ${nowChile.toFormat('cccc dd/MM HH:mm')}
    - Contexto: ${esDeCampaña ? "MODO CAMPAÑA (35% OFF - VERANO)" : "MODO ORGÁNICO"}
    - Saludo Inicial: ${yaSaludo ? "YA REALIZADO (Ve al grano)" : "PENDIENTE (Saluda calidamente)"}

    📚 TUS CONOCIMIENTOS TÉCNICOS (NO INVENTES):
    ${infoClinica}

    🏢 DATOS DEL NEGOCIO:
    ${infoNegocio}

    🗺️ TU ESTRATEGIA DE CONVERSACIÓN (SÍGUELA CON INTELIGENCIA):
    ${GUION_ACTIVO}
    
    ⚠️ INSTRUCCIÓN DE AGENDA:
    - Revisa la disponibilidad abajo.
    - Si es AM, ofrece PM hoy. Si es PM, ofrece AM mañana.
    - Solo agenda si el cliente confirma una hora específica.

    📅 DISPONIBILIDAD REAL CALENDAR:
    ${agendaInfo}
    `;

    const tools = [{
        type: "function",
        function: {
            name: "agendar_cita",
            description: "Reserva final en Google Calendar cuando el cliente confirma hora.",
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
            temperature: 0.4 // Temperatura media para que converse natural pero respete datos
        });
        const msg = runner.choices[0].message;
        
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                return exito 
                    ? `¡Listo ${nombreCliente}! 🌟 Tu evaluación con el 35% OFF quedó reservada para el ${args.fecha_iso}. Te esperamos en Las Pircas.`
                    : "Ups, justo alguien tomó ese horario hace un segundo. ¿Te acomoda una hora más tarde?";
            }
        }
        return msg.content; 
    } catch (e) { return "Hola! Estoy revisando la agenda para darte la mejor hora..."; }
}
