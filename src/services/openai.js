import OpenAI from "openai";
import fs from "fs";

// Nota: app.js importa transcribirAudio de aquí
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribirAudio(filePath) {
    try {
        const res = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });
        return res.text;
    } catch (e) { return ""; }
}
