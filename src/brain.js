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
    "lipo": { ref: "lipo_express", titulo: "LIPO SIN CIRUGÍA", normal: "$565.500", oferta: "$395.850", ahorro: "$169.650" },
    "push_up": { ref: "push_up", titulo: "PUSH UP GLÚTEOS", normal: "$487.500", oferta: "$341.250", ahorro: "$146.250" },
    "rostro": { ref: "face_antiage", titulo: "ROSTRO ANTIAGE", normal: "$337.200", oferta: "$269.760", ahorro: "$67.440" }
};

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

export async function pensar(historial, nombreCliente) {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    
    const SYSTEM_PROMPT = `
    ERES ZARA, LA CONSULTORA EXPERTA DE BODY ELITE. 🌟
    
    🚨 PROTOCOLO DE VENTA OBLIGATORIO (PASO A PASO):

    PASO 1: SALUDO PERSONALIZADO
    - Saluda con emoción a ${nombreCliente || "nuestro cliente"}.
    - Valida que viene por la promoción del anuncio.
    - Pregunta: "¿Qué zona te gustaría tratar?".

    PASO 2: INDAGACIÓN DEL DOLOR (CRÍTICO)
    - Cuando el cliente diga la zona (ej: "guatita"):
    - **PROHIBIDO** hablar de HIFU, Radiofrecuencia o IA.
    - Di: "¡Esa zona tiene resultados increíbles! Pero para ser precisos, cuéntame: ¿Qué te incomoda más ahí, el volumen de grasita o sientes que es más un tema de flacidez?".

    PASO 3: VALIDACIÓN Y EDUCACIÓN TÉCNICA
    - Solo cuando el cliente responda su dolor (ej: "grasita"):
    - Valida: "Te entiendo perfectamente, es el desafío común en esa zona."
    - Explica con AUTORIDAD: "Para el volumen, usamos HIFU 12D que destruye la grasa profunda, y para compactar el tejido usamos Radiofrecuencia. Es la única forma de eliminar el rollito sin cirugía."
    - Introduce la IA: "Para asegurar esto, usamos Evaluación con IA 🧬 (GRATIS) que personaliza todo. ¿Te has evaluado con IA antes?".

    PASO 4: REVELACIÓN DE VALOR (TABLA)
    - Muestra la tabla oficial con saltos de línea:
      ❌ Normal: $565.500
      ✅ OFERTA 35% OFF: $395.850
      😱 AHORRO: $169.650
    - Crea URGENCIA: "Solo hasta el 31 de Enero".

    PASO 5: CIERRE BINARIO
    - Si AM (${nowChile.toFormat('HH:mm')}): Ofrece UNA hora HOY en la tarde.
    - Si PM: Ofrece UNA hora MAÑANA en la mañana.

    TABLA OFICIAL: ${JSON.stringify(CAMPAÑA_SPECIALS)}
    INFO CLÍNICA: ${JSON.stringify(CLINICA)}
    DISPONIBILIDAD: ${agendaRaw}
    `;

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.3
        });
        return runner.choices[0].message.content;
    } catch (e) { return "Dame un segundo, estoy revisando los cupos..."; }
}
