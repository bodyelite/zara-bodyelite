import OpenAI from 'openai';
import { DateTime } from 'luxon';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';
import { FLUJO_MAESTRO } from './flow.js';
import { FLUJO_CAMPAÑA } from './flow_campaign.js';
import { checkAvailability, crearEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CAMPAÑA_SPECIALS = {
    "lipo": { 
        ref: "lipo_express", 
        titulo: "LIPO SIN CIRUGÍA",
        normal: "$565.500", 
        oferta: "$395.850", 
        ahorro: "$169.650" 
    },
    "push_up": { 
        ref: "push_up", 
        titulo: "PUSH UP GLÚTEOS",
        normal: "$487.500", 
        oferta: "$341.250", 
        ahorro: "$146.250" 
    },
    "rostro": { 
        ref: "face_antiage", 
        titulo: "ROSTRO ANTIAGE",
        normal: "$337.200", 
        oferta: "$269.760", 
        ahorro: "$67.440" 
    }
};

function obtenerDatosCampaña(texto) {
    const t = texto.toLowerCase();
    let key = null;
    
    if (t.includes("glúteos") || t.includes("gluteos") || t.includes("culo") || t.includes("push")) key = "push_up";
    else if (t.includes("lipo") || t.includes("guata") || t.includes("abdomen") || t.includes("cintura") || t.includes("espalda") || t.includes("brazo")) key = "lipo";
    else if (t.includes("rostro") || t.includes("cara") || t.includes("antiage")) key = "rostro";

    if (!key) return null;
    
    const precio = CAMPAÑA_SPECIALS[key];
    const tecnico = CLINICA[precio.ref];

    return `
    ✨ PRODUCTO CAMPAÑA: ${precio.titulo}
    🧬 ARGUMENTOS TÉCNICOS (SOLO USAR DESPUÉS DE SABER EL DOLOR):
    - TECNOLOGÍAS: ${tecnico.tecnologias}
    - DURACIÓN: ${tecnico.semanas}
    - BENEFICIO: ${tecnico.beneficio}
    💰 PRECIOS (Urgencia 31 Enero):
    - Normal: ${precio.normal} -> Oferta: ${precio.oferta}
    - Ahorro: ${precio.ahorro}
    `;
}

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
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const infoNegocio = JSON.stringify(NEGOCIO);

    // Detección estricta de botón Meta
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const triggerSagrado = "quiero mi evaluación"; 
    const esDeCampaña = historialTexto.includes(triggerSagrado) || historialTexto.includes("quiero mi evaluacion");
    
    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;

    const ultimoMensaje = historial[historial.length - 1].content;
    const datosProducto = esDeCampaña ? (obtenerDatosCampaña(ultimoMensaje) || obtenerDatosCampaña(historialTexto)) : null;

    const SYSTEM_PROMPT = `
    ERES ZARA, CONSULTORA DE BODY ELITE.
    
    🚨 MODO CAMPAÑA: ${esDeCampaña ? "ACTIVADO ✅" : "DESACTIVADO ❌"}

    ${esDeCampaña ? `
    🔥 REGLAS DE ORO DEL MODO CAMPAÑA:
    1. **INDAGACIÓN PURA:** Cuando el cliente diga la zona (ej: "Cintura"), **TIENES PROHIBIDO** hablar de tecnologías (HIFU/RF). Tu única misión es preguntar: "¿Te molesta más la grasa (volumen) o la flacidez?".
    2. **GOLPE DE AUTORIDAD:** Si el cliente dice "no sé" o "ustedes son los expertos", TOMA EL MANDO. Di: "¡Perfecto! Entonces déjamelo a mí. Lo que necesitas es..." (y ahí sueltas la tecnología).
    3. **MANEJO DE OBJECIONES:** Si dice "No" a la cita, NO DIGAS ADIÓS. Pregunta: "¿Te complica el horario o te gustaría saber más del procedimiento primero?".
    4. **PRECIOS VISUALES:** Usa saltos de línea y emojis.

    🎯 DATOS TÉCNICOS: ${datosProducto || "Esperando zona..."}
    ` : `
    💁‍♀️ MODO ATENCIÓN GENERAL: Responde dudas puntuales sin script de ventas.
    `}

    🏢 INFO NEGOCIO: ${infoNegocio}
    📜 TU GUIÓN: ${GUION_ACTIVO}
    📅 AGENDA: ${agendaRaw}
    `;

    const tools = [{
        type: "function",
        function: {
            name: "agendar_cita",
            description: "Reserva final.",
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
            temperature: 0.3
        });
        const msg = runner.choices[0].message;
        
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                return exito 
                    ? `¡Listo ${nombreCliente}! Quedó agendado para el ${args.fecha_iso}. Tu 35% OFF está blindado hasta el 31 de Enero. ✨`
                    : "Ups, se ocupó. ¿Busquemos otro?";
            }
        }
        return msg.content; 
    } catch (e) { return "Dame un segundo..."; }
}
