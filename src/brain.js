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
        
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero") || ultimoMensaje.includes("celular");

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("cara") || txt.includes("rostro") || txt.includes("piel") || txt.includes("arrugas") || txt.includes("manchas") || txt.includes("glow")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("trasero") || txt.includes("cola") || txt.includes("nalga") || txt.includes("celulitis")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("guata") || txt.includes("abdomen") || txt.includes("rollitos") || txt.includes("peso")) return "lipo_express";
            if (txt.includes("depila") || txt.includes("laser") || txt.includes("vello")) return "depilacion";
            return null;
        };

        let key = detectar(ultimoMensaje);

        if (!key) {
             const textoCompleto = mensajesUsuario.map(m => m.content.toLowerCase()).join(" ");
             key = detectar(textoCompleto);
        }

        let systemPrompt = "";
        
        if (key) {
            const datos = CLINICA[key];
            if (!datos) { 
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            } else {
                let basePrompt = PROMPT_VENTA;
                
                if (pideLlamada) {
                    basePrompt += "\n\n🚨 INSTRUCCIÓN SUPREMA: EL CLIENTE PIDIÓ LLAMADA. PIDE SU NÚMERO. NO ENVÍES EL LINK.";
                } else if (pidePrecio) {
                    basePrompt += "\n\n🚨 INSTRUCCIÓN: CLIENTE PIDE PRECIO. EJECUTA EL PILAR 3 (PRECIO + EVALUACIÓN IA) Y EL PILAR 4 (CIERRE DOBLE).";
                }

                systemPrompt = basePrompt
                    .replace(/{NOMBRE_CLIENTE}/g, nombrePila)
                    .replace(/{PLAN}/g, datos.plan)
                    .replace(/{PRECIO}/g, datos.precio)
                    .replace(/{DURACION}/g, datos.duracion)
                    .replace(/{TECNOLOGIAS}/g, datos.tecnologias)
                    .replace(/{BENEFICIO}/g, datos.beneficio)
                    .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
            }
        } else {
            if (pidePrecio) {
                systemPrompt = `ERES ZARA. EL CLIENTE PIDIÓ PRECIO PERO NO SABES DE QUÉ.
                RESPONDE CON EL PILAR 1 (INDAGACIÓN):
                "¡Hola ${nombrePila}! 👋 Los valores dependen de lo que necesites. ¿Tu objetivo es Corporal (Rollitos/Glúteos) 🍑 o Facial ✨? Cuéntame para darte el plan exacto."`;
            } else {
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.2, 
            max_tokens: 350
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
