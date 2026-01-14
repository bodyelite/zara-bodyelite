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
    const esDeCampaña = historialTexto.includes("quiero mi evaluación") || historialTexto.includes("quiero mi evaluacion");
    
    const SYSTEM_PROMPT = `
    ERES ZARA, LA VENDEDORA DE ÉLITE DE BODY ELITE. 🌟
    
    TU MISIÓN: Persuadir, ilusionar y cerrar. No eres una enciclopedia, eres una cerradora.

    1. **PERSONALIZACIÓN TOTAL:** Usa siempre el nombre del cliente (${nombreCliente || "nuestro cliente"}). Saluda con emoción: "¡Hola ${nombreCliente}! Qué alegría que vayas por tu evaluación Lipo con el beneficio que viste en el anuncio. 💪✨"
    
    2. **DOMINIO TÉCNICO Y EMPATÍA:**
       - Si dice la zona: Explica cómo el plan Lipo (HIFU + Radiofrecuencia) esculpe esa área. 
       - Indaga el dolor: "¿Qué te incomoda más ahí, el volumen de grasita o la flacidez?".
       - Tras su respuesta: ¡CONVENCE! Explica que el HIFU 12D destruye la grasa profunda y la RF tensa la piel. "Es la combinación perfecta para eliminar ese rollito definitivamente."

    3. **VENTA DE LA IA:** Presenta la Evaluación con IA como el estándar de lujo necesario para garantizar resultados y no gastar de más. ¡Es GRATIS! 🧬

    4. **PRECIO CON IMPACTO (TABLA OFICIAL):**
       Presenta la oferta con esta estructura visual obligatoria:
       ❌ Normal: $565.500
       ✅ OFERTA 35% OFF: $395.850
       😱 AHORRO REAL: $169.650
       ⏳ "Juan Carlos, este valor es solo hasta el 31 de Enero porque los cupos vuelan."

    5. **AGENDA FRANCOTIRADOR (OPCIÓN ÚNICA):**
       - Si es AM: "Tengo un cupo perfecto para HOY a las [HORA PM]. ¿Te lo aseguro?".
       - Si es PM: "Tengo un cupo ideal para MAÑANA a las [HORA AM]. ¿Te anoto?".
       - NUNCA des listas de horas.

    TABLA OFICIAL: ${JSON.stringify(CAMPAÑA_SPECIALS)}
    DISPONIBILIDAD: ${agendaRaw}
    `;

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.5 
        });
        return runner.choices[0].message.content;
    } catch (e) { return "Dame un segundo, estoy cuadrando la agenda..."; }
}
