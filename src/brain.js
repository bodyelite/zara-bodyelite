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

// --- TABLA DE PRECIOS "INFLADOS" PARA CAMPAÑA ---
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
    if (t.includes("culo") || t.includes("glúteos") || t.includes("gluteo") || t.includes("push")) key = "push_up";
    else if (t.includes("guata") || t.includes("panza") || t.includes("abdomen") || t.includes("cintura") || t.includes("lipo")) key = "lipo";
    else if (t.includes("cara") || t.includes("rostro") || t.includes("antiage")) key = "rostro";

    if (!key) return null;

    const precio = CAMPAÑA_SPECIALS[key];
    const tecnico = CLINICA[precio.ref];

    return `
    ✨ PRODUCTO ESTRELLA DETECTADO: ${precio.titulo}
    
    🧬 ARGUMENTOS DE VENTA (Seduce con esto):
    - TECNOLOGÍAS (Úsalas TODAS): ${tecnico.tecnologias}
    - DURACIÓN: ${tecnico.semanas}
    - BENEFICIO: ${tecnico.beneficio}

    💥 TABLA DE PRECIOS (Presenta con emoción):
    - Precio Normal: ${precio.normal}
    - Precio CAMPAÑA: ${precio.oferta}
    - AHORRO: ${precio.ahorro}
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

    // Contexto
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const triggersCampaña = ["35%", "off", "oferta", "lipo", "push", "glúteos", "culo", "precio", "valor"];
    const esDeCampaña = triggersCampaña.some(t => historialTexto.includes(t));
    
    const ultimoMensaje = historial[historial.length - 1].content;
    const datosProducto = obtenerDatosCampaña(ultimoMensaje) || obtenerDatosCampaña(historialTexto);

    const GUION_ACTIVO = esDeCampaña ? FLUJO_CAMPAÑA : FLUJO_MAESTRO;

    // LÓGICA DE AGENDA FRANCOTIRADOR (Elige 1 sola hora)
    const horaActual = nowChile.hour;
    const momentoDia = horaActual < 13 ? "AM" : "PM";
    
    const SYSTEM_PROMPT = `
    ERES ZARA, LA VENDEDORA ESTRELLA DE BODY ELITE. 🌟
    
    💃 TU PERSONALIDAD:
    - Entusiasta, usas emojis (✨, 💆‍♀️, 🔥, 📅) para dar vida al texto.
    - NO ERES UN ROBOT. Eres una asesora que ilusiona con el resultado.
    - VALIDACIÓN INMEDIATA: Si el cliente viene de campaña, ¡FESTÉJALO! "¡Excelente elección! Ese descuento es una bomba".

    🎯 DATOS DE CAMPAÑA (ÚSALOS TODOS):
    ${datosProducto ? datosProducto : "Detectando zona..."}

    💀 REGLAS DE MUERTE SÚBITA (SI FALLAS ESTO, PIERDES LA VENTA):
    1. **URGENCIA:** Menciona SIEMPRE que el descuento vence el **31 DE ENERO**.
    2. **AGENDA FRANCOTIRADOR:** - Abajo verás una lista de horas disponibles. **NO SE LA MUESTRES AL CLIENTE.**
       - ELEGIRÁS SOLO UNA (1) HORA ESTRATÉGICA.
       - Si es AM ahora 👉 Ofrece UNA hora PM de hoy.
       - Si es PM ahora 👉 Ofrece UNA hora AM de mañana.
       - Di: "Tengo un cupo perfecto mañana a las 10:00. ¿Te lo aseguro?" (Jamás digas "tengo a las 9, 10, 11, 12...").
    
    🗺️ TU GUIÓN:
    ${GUION_ACTIVO}

    📅 LISTA DE HORAS DISPONIBLES (SOLO PARA TUS OJOS, ELIGE UNA):
    ${agendaRaw}
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
            temperature: 0.5 // Subimos un poco para que tenga "chispa" y entusiasmo
        });
        const msg = runner.choices[0].message;
        
        if (msg.tool_calls) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.function.name === "agendar_cita") {
                const args = JSON.parse(toolCall.function.arguments);
                const exito = await crearEvento(args.fecha_iso, nombreCliente || "Cliente", args.telefono || "");
                return exito 
                    ? `¡Listo! 🎉 Quedó agendado para el ${args.fecha_iso}. Tu 35% OFF está asegurado hasta el 31 de Enero. ¡Nos vemos en Las Pircas! ✨`
                    : "Ups, me ganaron ese horario. 🙈 ¿Te sirve un poco más tarde?";
            }
        }
        return msg.content; 
    } catch (e) { return "Dame un segundo, estoy buscando el mejor cupo..."; }
}
