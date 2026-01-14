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
    if (t.includes("culo") || t.includes("glúteos") || t.includes("gluteo") || t.includes("push") || t.includes("cola")) key = "push_up";
    else if (t.includes("guata") || t.includes("panza") || t.includes("abdomen") || t.includes("cintura") || t.includes("lipo") || t.includes("muslo")) key = "lipo";
    else if (t.includes("cara") || t.includes("rostro") || t.includes("antiage")) key = "rostro";

    if (!key) return null;
    const precio = CAMPAÑA_SPECIALS[key];
    const tecnico = CLINICA[precio.ref];

    return `
    ✨ PRODUCTO CAMPAÑA: ${precio.titulo}
    🧬 ARGUMENTOS DE PODER (Seduce y Afirma):
    - TECNOLOGÍAS: ${tecnico.tecnologias}
    - DURACIÓN: ${tecnico.semanas}
    - BENEFICIO: ${tecnico.beneficio}
    💰 PRECIOS (Urgencia 31 Enero):
    - Normal: ${precio.normal} -> Oferta: ${precio.oferta}
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

    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const triggersCampaña = ["35%", "off", "oferta", "lipo", "push", "glúteos", "culo", "precio", "valor"];
    const esDeCampaña = triggersCampaña.some(t => historialTexto.includes(t));
    
    const ultimoMensaje = historial[historial.length - 1].content;
    const datosProducto = obtenerDatosCampaña(ultimoMensaje) || obtenerDatosCampaña(historialTexto);

    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;
    const horaActual = nowChile.hour;
    
    const SYSTEM_PROMPT = `
    ERES ZARA, EXPERTA EN BODY ELITE.
    
    🔥 TU ACTITUD (MODO CAMPAÑA):
    - Entusiasta y Segura.
    - **CERO DUDAS:** Cuando expliques el tratamiento, no preguntes "¿te tinca?". DICES: "Es la solución definitiva para esa zona. ¿Vamos por ese cambio?".
    - **CIERRE AFIRMATIVO:** Llevas al cliente de la mano.

    🎯 INFORMACIÓN CLAVE:
    ${datosProducto ? datosProducto : "Detectando zona..."}

    📜 TU GUIÓN:
    ${GUION_ACTIVO}

    📅 REGLA DE AGENDA (FRANCOTIRADOR):
    - NO des listas de horas. ELIGE UNA.
    - AM ahora -> Ofrece UNA hora PM.
    - PM ahora -> Ofrece UNA hora AM mañana.
    - Disponibilidad: ${agendaRaw}
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
            temperature: 0.4
        });
        const msg = runner.choices[0].message;
        
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                return exito 
                    ? `¡Listo ${nombreCliente}! 🎉 Quedó agendado para el ${args.fecha_iso}. Tu 35% OFF está asegurado. ¡Vamos por esos resultados! 💪`
                    : "Ups, me ganaron ese horario. 🙈 ¿Te sirve un poco más tarde?";
            }
        }
        return msg.content; 
    } catch (e) { return "Dame un segundo, estoy cuadrando la agenda..."; }
}
