import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_MAESTRO } from '../config/persona.js';
import { CLINICA } from '../config/clinic.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombre, suffix = "") {
    try {
        const nombreReal = (nombre && nombre !== "Cliente" && nombre !== "Visitante") ? nombre : "estimada/o";
        
        let systemPrompt = PROMPT_MAESTRO.replace("{NOMBRE_CLIENTE}", nombreReal);
        
        const ultimoMensaje = historial.length > 0 ? historial[historial.length - 1].content.toLowerCase() : "";
        
        let productoDetectado = "tratamiento";
        if (ultimoMensaje.includes("pink glow") || ultimoMensaje.includes("pinkglow")) productoDetectado = "Pink Glow";
        else if (ultimoMensaje.includes("hifu")) productoDetectado = "HIFU 12D";
        else if (ultimoMensaje.includes("lipo")) productoDetectado = "Lipo Enzimática";
        else if (ultimoMensaje.includes("push")) productoDetectado = "Push Up";
        
        systemPrompt = systemPrompt.replace(/{PRODUCTO_DETECTADO}/g, productoDetectado);

        const messages = [
            { role: "system", content: systemPrompt + "\n\nINFORMACIÓN TÉCNICA Y PRECIOS:\n" + CLINICA },
            ...historial.map(m => ({ role: m.role === 'zara' ? 'assistant' : 'user', content: m.content }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", 
            messages: messages,
            temperature: 0.3, 
            max_tokens: 350
        });

        return completion.choices[0].message.content + " " + suffix;
    } catch (error) {
        console.error("Error Brain:", error);
        return "¡Hola! Dame un segundo para revisar la información... 📅";
    }
}
