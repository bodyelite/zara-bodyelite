import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribirAudio(path) {
    try {
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "whisper-1",
            language: "es"
        });
        return response.text;
    } catch (e) {
        return "";
    }
}
