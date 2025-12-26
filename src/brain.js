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
        
        // SOLO MIRAMOS EL ÚLTIMO MENSAJE
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        
        // DETECCIONES
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaQueEs = ultimoMensaje.includes("que es") || ultimoMensaje.includes("consiste") || ultimoMensaje.includes("como funciona") || ultimoMensaje.includes("explicame");
        const preguntaZonas = ultimoMensaje.includes("zona") || ultimoMensaje.includes("sesion");
        
        // Detección de MIX (Conflicto de intereses)
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito") || ultimoMensaje.includes("abdomen");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero") || ultimoMensaje.includes("cola");
        const esMix = (mencionaCuerpo && mencionaGluteo) || (historial.some(m => m.content.includes("Reloj de Arena")) && !pidePrecio && !preguntaQueEs && !preguntaZonas);

        // Selección de tema base
        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("rostro") || txt.includes("piel")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("cola")) return "push_up";
            if (txt.includes("lipo") || txt.includes("rollito") || txt.includes("grasa")) return "lipo_express";
            return null;
        };
        
        let key = detectar(ultimoMensaje);
        let systemPrompt = "";

        // LÓGICA DE RESPUESTA
        if (esMix) {
            // LÓGICA ESPECÍFICA PARA EL MIX (PRIORIDAD ALTA)
            const datos = CLINICA["lipo_express"]; // Cargamos datos base para tener el link
            let basePrompt = PROMPT_VENTA;

            if (pideLlamada) basePrompt += "\n\n🚨 ALERTA: CLIENTE PIDE LLAMADA. PIDE NÚMERO.";
            else if (preguntaZonas) basePrompt += "\n\n🚨 ALERTA: PREGUNTA ZONAS. USA GUION 'D' (ZONAS/IA).";
            else if (pidePrecio) basePrompt += "\n\n🚨 ALERTA: PIDE PRECIO MIXTO. USA GUION 'C' (SUMA VS AHORRO).";
            else if (preguntaQueEs) basePrompt += "\n\n🚨 ALERTA: PREGUNTA EN QUÉ CONSISTE. USA GUION 'B' (TECNOLOGÍA).";
            else basePrompt += "\n\n🚨 ALERTA: CLIENTE PIDE MIX. USA GUION 'A' (GANCHO RELOJ DE ARENA).";

            systemPrompt = basePrompt.replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);

        } else if (key) {
            // LÓGICA TRATAMIENTO ÚNICO
            const datos = CLINICA[key];
            let basePrompt = PROMPT_VENTA;
            
            if (pideLlamada) basePrompt += "\n\n🚨 ALERTA: PIDE LLAMADA. PIDE NÚMERO.";
            else if (preguntaZonas) basePrompt += "\n\n🚨 ALERTA: PREGUNTA ZONAS. USA GUION 'D'.";
            else if (pidePrecio) basePrompt += "\n\n🚨 ALERTA: PIDE PRECIO. USA GUION 'C' (ADAPTADO A UN SOLO PLAN).";
            else if (preguntaQueEs) basePrompt += `\n\n🚨 ALERTA: EXPLICA EL ${datos.plan} EN 2 LÍNEAS MÁXIMO. LUEGO PREGUNTA SI QUIERE PRECIO.`;
            else basePrompt += `\n\n🚨 ALERTA: USA EL GUION DE GANCHO PARA ${datos.plan}.`;

            systemPrompt = basePrompt
                .replace(/{PLAN}/g, datos.plan)
                .replace(/{PRECIO}/g, datos.precio)
                .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
        } else {
            // TRIAGE
            systemPrompt = PROMPT_TRIAGE;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.2, 
            max_tokens: 200
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
