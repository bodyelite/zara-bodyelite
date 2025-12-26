import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generarRespuestaIA(messages) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.7,
            max_tokens: 350
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error OpenAI:", error);
        return "Estoy teniendo un pequeño lapso técnico, ¿me repites eso?";
    }
}
