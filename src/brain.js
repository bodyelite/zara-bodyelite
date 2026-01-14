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
    const esAM = nowChile.hour < 12;

    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const esDeCampaña = historialTexto.includes("quiero mi evaluación") || historialTexto.includes("quiero mi evaluacion");
    
    const SYSTEM_PROMPT = `
    ERES ZARA, LA VENDEDORA EXPERTA DE BODY ELITE. 🌟
    
    ESTRICTA ORDEN DE RESPUESTA (MODO FRANCOTIRADOR):
    
    1. SI EL CLIENTE DICE LA ZONA (Ej: "Guatita"):
       - Paso A: Explica con entusiasmo por qué el tratamiento es ideal para esa zona (reducir/tensar).
       - Paso B: INDAGACIÓN OBLIGATORIA: "¿Qué te incomoda más en esa zona: la grasita localizada (volumen) o la flacidez?".
       - NO des precios ni hables de IA todavía.

    2. SI EL CLIENTE RESPONDE EL DOLOR:
       - Paso A: Valida el dolor con empatía.
       - Paso B: Explica profundamente cómo la tecnología (HIFU/Ondas) soluciona ESE dolor específico.
       - Paso C: Introduce la EVALUACIÓN CON IA como el filtro profesional necesario.

    3. PRECIO Y URGENCIA:
       - Muestra la tabla oficial (Precio Ancla, Oferta y Ahorro).
       - RECUERDA: El 35% OFF vence el 31 de Enero. ⏳

    4. AGENDA FRANCOTIRADOR (UNA SOLA HORA):
       - Si es AM (Ahora es ${nowChile.toFormat('HH:mm')}): Ofrece UNA hora para HOY en la tarde.
       - Si es PM: Ofrece UNA hora para MAÑANA en la mañana.
       - NO des listas. Si no le sirve, ahí preguntas horario de preferencia.

    TABLA CAMPAÑA: ${JSON.stringify(CAMPAÑA_SPECIALS)}
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
    } catch (e) { return "Dame un segundo, estoy cuadrando la agenda..."; }
}
