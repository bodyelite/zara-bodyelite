import OpenAI from 'openai';
import { DateTime } from 'luxon';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { GENERAR_PROMPT } from './flow.js';
import { checkAvailability } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    } catch (e) { 
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); 
        return null; 
    }
}

export async function pensar(historial, nombreCliente) {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago').toFormat('HH:mm');
    
    // Inyectamos el prompt dinámico unificado
    const SYSTEM_PROMPT = GENERAR_PROMPT(nombreCliente, nowChile, agendaRaw);

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT }, 
                ...historial
            ],
            temperature: 0.2, 
            max_tokens: 350
        });
        return runner.choices[0].message.content;
    } catch (e) { 
        console.error("Error Brain:", e);
        return "Dame un segundo, estoy revisando la agenda..."; 
    }
}
