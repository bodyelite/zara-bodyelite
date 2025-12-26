import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_VENTA, PROMPT_TRIAGE } from './config/persona.js';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCompleto) {
    try {
        const nombrePila = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";
        
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        const textoCompleto = mensajesUsuario.map(m => m.content.toLowerCase()).join(" ");
        
        const detectar = (txt) => {
            if (txt.includes("face") || txt.includes("cara") || txt.includes("rostro") || txt.includes("piel") || txt.includes("arrugas") || txt.includes("manchas")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("trasero") || txt.includes("cola") || txt.includes("nalga") || txt.includes("levantar")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("guata") || txt.includes("abdomen") || txt.includes("michelines") || txt.includes("rollitos") || txt.includes("peso")) return "lipo_express";
            return null;
        };

        let key = detectar(ultimoMensaje);
        if (!key) key = detectar(textoCompleto);

        let systemPrompt = "";
        
        if (key) {
            const datos = CLINICA[key];
            if (!datos) { 
                key = "general";
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            } else {
                systemPrompt = PROMPT_VENTA
                    .replace(/{NOMBRE_CLIENTE}/g, nombrePila)
                    .replace(/{PLAN}/g, datos.plan)
                    .replace(/{PRECIO}/g, datos.precio)
                    .replace(/{DURACION}/g, datos.duracion) // NUEVO: DURACIÓN
                    .replace(/{TECNOLOGIAS}/g, datos.tecnologias)
                    .replace(/{BENEFICIO}/g, datos.beneficio)
                    .replace(/{DIRECCION}/g, CLINICA.faq.direccion)
                    .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
            }
        } else {
            systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.3, 
            max_tokens: 300
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Brain Error:", error);
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
