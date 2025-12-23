import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_MAESTRO } from '../config/persona.js';
import { CLINICA } from '../config/clinic.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombre, suffix = "") {
    try {
        const nombreReal = (nombre && nombre !== "Cliente") ? nombre : "estimada/o";
        let script = PROMPT_MAESTRO.replace("{NOMBRE_CLIENTE}", nombreReal);
        
        // DETECCIÓN INTELIGENTE PARA LLENAR EL GUION
        const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
        
        let datos = {
            producto: "Tratamiento",
            plan: "General",
            beneficio: "mejorar tu piel",
            tecnos: "tecnología avanzada",
            precio: "$128.800",
            duracion: "varias semanas"
        };

        if (historialTexto.includes("pink") || historialTexto.includes("face")) {
            datos = {
                producto: "Pink Glow",
                plan: "Face Ligth",
                beneficio: "dar efecto piel de porcelana y brillo inmediato",
                tecnos: "Vitaminas para hidratar, Enzimas para textura y Radiofrecuencia para firmeza",
                precio: "$128.800",
                duracion: "1 sesión multicomponente"
            };
        } else if (historialTexto.includes("push") || historialTexto.includes("gluteo")) {
            datos = {
                producto: "Push Up",
                plan: "Push Up",
                beneficio: "levantar y dar forma a los glúteos",
                tecnos: "Radiofrecuencia para piel, EMS Sculptor para dar forma y HIFU para tensar",
                precio: "$376.000",
                duracion: "10 a 12 semanas"
            };
        } else if (historialTexto.includes("lipo") || historialTexto.includes("reduc") || historialTexto.includes("grasa")) {
            datos = {
                producto: "Lipo Express",
                plan: "Lipo Express",
                beneficio: "reducir medidas y reafirmar",
                tecnos: "HIFU para quemar grasa y Prosculpt para tonificar",
                precio: "$432.000",
                duracion: "8 semanas"
            };
        }

        // REEMPLAZO VARIABLES EN EL GUION
        script = script
            .replace("{PRODUCTO_DETECTADO}", datos.producto)
            .replace("{BENEFICIO}", datos.beneficio)
            .replace("{TECNOLOGIAS}", datos.tecnos)
            .replace("{PLAN_NOMBRE}", datos.plan)
            .replace("{PRECIO}", datos.precio)
            .replace("{DURACION}", datos.duracion);

        const messages = [
            { role: "system", content: script },
            ...historial.map(m => ({ role: m.role === 'zara' ? 'assistant' : 'user', content: m.content }))
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            temperature: 0.0, // TEMPERATURA 0 PARA QUE NO INVENTE NADA
            max_tokens: 250
        });

        return completion.choices[0].message.content + " " + suffix;
    } catch (error) {
        return "Dame un segundo... 📅";
    }
}
