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

// --- TABLA DE PRECIOS "INFLADOS" PARA CAMPAÑA (NO TOCAR) ---
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
    
    // Detector de intención (Slang incluido)
    if (t.includes("culo") || t.includes("glúteos") || t.includes("gluteo") || t.includes("poto") || t.includes("push")) key = "push_up";
    else if (t.includes("guata") || t.includes("panza") || t.includes("abdomen") || t.includes("cintura") || t.includes("lipo")) key = "lipo";
    else if (t.includes("cara") || t.includes("rostro") || t.includes("antiage") || t.includes("arrugas")) key = "rostro";

    if (!key) return null;

    const precio = CAMPAÑA_SPECIALS[key];
    const tecnico = CLINICA[precio.ref]; // Datos reales de clinic.js

    return `
    🎯 PRODUCTO CAMPAÑA: ${precio.titulo}
    
    🧬 DATOS TÉCNICOS (Para tu explicación convincente):
    - Tratamiento: ${tecnico.plan}
    - Duración Real: ${tecnico.semanas}
    - Tecnologías: ${tecnico.tecnologias}
    - Beneficio Clave: ${tecnico.beneficio}

    💰 TABLA DE PRECIOS (Usa esto en el Paso 8):
    - Precio Lista (Inflado): ${precio.normal}
    - Precio 35% OFF: ${precio.oferta}
    - Ahorro Cliente: ${precio.ahorro}
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
    let agendaInfo = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const infoNegocio = JSON.stringify(NEGOCIO);

    // Contexto
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const triggersCampaña = ["35%", "off", "oferta", "lipo", "push", "glúteos", "culo", "precio", "valor"];
    const esDeCampaña = triggersCampaña.some(t => historialTexto.includes(t));
    
    // Datos del producto actual (si aplica)
    const ultimoMensaje = historial[historial.length - 1].content;
    const datosProducto = obtenerDatosCampaña(ultimoMensaje) || obtenerDatosCampaña(historialTexto);

    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;
    
    // Lógica de Horario Inteligente (AM -> PM / PM -> AM Mañana)
    const horaActual = nowChile.hour;
    const sugerenciaHorario = horaActual < 13 
        ? "Busca un cupo para HOY en la tarde (PM)" 
        : "Busca un cupo para MAÑANA en la mañana (AM)";

    const SYSTEM_PROMPT = `
    ERES ZARA, CONSULTORA DE BODY ELITE.
    
    🌟 TU MENTALIDAD:
    - Eres experta, cálida y persuasiva.
    - NO ERES INSISTENTE. Si el cliente pregunta por estacionamiento, respóndele con naturalidad y luego, sutilmente, retoma la agenda.
    - TU META: Llevar al cliente por los 9 Pasos del Flujo, pero permitiendo desvíos si el cliente quiere conversar.

    🛒 DATOS DE VENTA ACTIVOS:
    ${datosProducto ? datosProducto : "Cliente aún no define zona (Lipo/Glúteos/Rostro). Pregunta para activar la tabla."}

    🏢 INFO LOCAL: ${infoNegocio}

    📜 TU MAPA DE RUTA (9 PASOS):
    ${GUION_ACTIVO}

    🕰️ INSTRUCCIÓN DE AGENDA:
    - ${sugerenciaHorario}.
    - Disponibilidad Real: ${agendaInfo}
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
            temperature: 0.3 // Balance entre creatividad para explicar y rigor para precios
        });
        const msg = runner.choices[0].message;
        
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                return exito 
                    ? `¡Listo! Quedó agendado para el ${args.fecha_iso}. ${esDeCampaña ? "Tu 35% OFF está asegurado." : "Te esperamos."} ✨`
                    : "Ese cupo se acaba de ocupar. ¿Buscamos otro?";
            }
        }
        return msg.content; 
    } catch (e) { return "Un momento, estoy verificando..."; }
}
