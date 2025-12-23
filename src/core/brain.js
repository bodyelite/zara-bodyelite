import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_MAESTRO } from '../config/persona.js';
import { CLINICA } from '../config/clinic.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombre, suffix = "") {
    try {
        const nombreReal = (nombre && nombre !== "Cliente") ? nombre : "";
        const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
        const ultimoMensaje = historial.length > 0 ? historial[historial.length - 1].content.toLowerCase() : "";
        
        let key = "pink_glow";
        if (historialTexto.includes("push") || historialTexto.includes("gluteo")) key = "push_up";
        else if (historialTexto.includes("lipo") || historialTexto.includes("reduc") || historialTexto.includes("express")) key = "lipo_express";
        
        const datos = CLINICA[key];
        const faq = CLINICA["faq"];

        let script = PROMPT_MAESTRO
            .replace("{NOMBRE_CLIENTE}", nombreReal)
            .replace("{PLAN}", datos.plan)
            .replace("{PRECIO}", datos.precio)
            .replace("{DURACION}", datos.duracion)
            .replace("{TECNOLOGIAS}", datos.tecnologias)
            .replace("{BENEFICIO}", datos.beneficio)
            .replace("{DIRECCION}", faq.direccion)
            .replace("{DETALLE_EVAL}", faq.detalle_eval);

        // Inyectamos instrucción extra si el usuario pregunta detalles específicos para romper el bucle
        if (ultimoMensaje.includes("donde") || ultimoMensaje.includes("como") || ultimoMensaje.includes("online") || ultimoMensaje.includes("app") || ultimoMensaje.includes("ubicacion")) {
            script += "\n\nIMPORTANTE: El usuario está preguntando detalles de la evaluación (dónde es, cómo es, si es online). USA EL CASO A. NO USES EL GUION DE PRECIOS AHORA.";
        } else {
            script += "\n\nIMPORTANTE: El usuario sigue el flujo normal. USA EL CASO B (Fase que corresponda).";
        }

        const messages = [
            { role: "system", content: script },
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
