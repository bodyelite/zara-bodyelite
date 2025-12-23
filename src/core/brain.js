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
        let beneficio = "revitalizar tu piel";
        let tecno = "tecnología avanzada";
        
        if (ultimoMensaje.includes("pink") || ultimoMensaje.includes("face")) {
            productoDetectado = "Pink Glow";
            beneficio = "dar efecto piel de porcelana y brillo inmediato";
            tecno = "Vitaminas para hidratar, Enzimas para textura y Radiofrecuencia para firmeza";
        } else if (ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo")) {
            productoDetectado = "Push Up";
            beneficio = "levantar y dar forma a los glúteos";
            tecno = "Radiofrecuencia para piel, EMS Sculptor para dar forma y HIFU para tensar";
        } else if (ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc")) {
            productoDetectado = "Lipo Express";
            beneficio = "reducir medidas y reafirmar";
            tecno = "HIFU para quemar grasa y Prosculpt para tonificar";
        }
        
        systemPrompt = systemPrompt
            .replace("{PRODUCTO_DETECTADO}", productoDetectado)
            .replace("{BENEFICIO_CORTO}", beneficio)
            .replace("{TECNOLOGIAS_BREVES}", tecno);

        const messages = [
            { role: "system", content: systemPrompt + "\n\nDATOS:\n" + CLINICA },
            ...historial.map(m => ({ role: m.role === 'zara' ? 'assistant' : 'user', content: m.content }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", 
            messages: messages,
            temperature: 0.0, 
            max_tokens: 300
        });

        return completion.choices[0].message.content + " " + suffix;
    } catch (error) {
        return "Dame un segundo... 📅";
    }
}
