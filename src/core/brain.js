import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_MAESTRO } from '../config/persona.js';
import { CLINICA } from '../config/clinic.js';
import { NEGOCIO } from '../config/business.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombre, suffix = "") {
    try {
        const nombreReal = (nombre && nombre !== "Cliente") ? nombre : "";
        const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
        
        let key = "pink_glow";
        if (historialTexto.includes("push") || historialTexto.includes("gluteo")) key = "push_up";
        else if (historialTexto.includes("lipo") || historialTexto.includes("reduc") || historialTexto.includes("express")) key = "lipo_express";
        
        const datos = CLINICA[key];
        const faq = CLINICA["faq"];

        // Forzamos la inyección de la URL cruda para evitar que la IA la modifique
        let script = PROMPT_MAESTRO
            .replace("{NOMBRE_CLIENTE}", nombreReal)
            .replace("{PLAN}", datos.plan)
            .replace("{PRECIO}", datos.precio)
            .replace("{DURACION}", datos.duracion)
            .replace("{TECNOLOGIAS}", datos.tecnologias)
            .replace("{BENEFICIO}", datos.beneficio)
            .replace("{DIRECCION}", faq.direccion)
            .replace("{TIPO_EVAL}", faq.tipo)
            .replace("{DETALLE_EVAL}", faq.detalle)
            .replace("{LINK_AGENDA}", NEGOCIO.agenda_link); 

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
