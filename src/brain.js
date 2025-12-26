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
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaZonas = ultimoMensaje.includes("zonas") || ultimoMensaje.includes("sesiones") || ultimoMensaje.includes("veces") || ultimoMensaje.includes("cuanto dura");
        const afirmacion = ultimoMensaje === "si" || ultimoMensaje.includes("si ") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno");

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("cara") || txt.includes("rostro") || txt.includes("piel") || txt.includes("arrugas") || txt.includes("glow")) return "pink_glow";
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
                    basePrompt += "\n\n🚨 CLIENTE PIDE LLAMADA. PIDE SU NÚMERO. NO ENVÍES EL LINK.";
                } else if (preguntaZonas) {
                    basePrompt += "\n\n🚨 PREGUNTA CRÍTICA SOBRE ZONAS/SESIONES. USA EL 'CASO ESPECIAL A' (ARGUMENTO DE AHORRO CON IA).";
                } else if (pidePrecio) {
                    basePrompt += "\n\n🚨 CLIENTE PIDE PRECIO. SALTA AL PASO 3 (PRECIO + ARGUMENTO DE AHORRO IA).";
                } else if (afirmacion) {
                    basePrompt += "\n\n🚨 EL CLIENTE DIJO 'SÍ'. REVISA EL HISTORIAL Y DALE EL SIGUIENTE PASO DEL PING-PONG.";
                } else {
                    basePrompt += "\n\n🚨 CLIENTE PIDE INFO. EMPIEZA POR EL PASO 1 (GANCHO).";
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
                 systemPrompt = `ERES ZARA. RESPONDE SOLO ESTO: "¡Hola ${nombrePila}! 👋 Los valores dependen de tu objetivo. ¿Buscas Corporal 🍑 o Facial ✨? Cuéntame."`;
            } else {
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.1, 
            max_tokens: 200
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
