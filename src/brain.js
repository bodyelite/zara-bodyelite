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
        
        // MAPA DE CONTEXTO
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale");
        const preguntaComoFunciona = ultimoMensaje.includes("como") || ultimoMensaje.includes("funciona") || ultimoMensaje.includes("consiste") || ultimoMensaje.includes("que es") || ultimoMensaje.includes("tecnologia");
        const respuestaEvaluacion = ultimoMensaje.includes("no") || ultimoMensaje.includes("si") || ultimoMensaje.includes("nunca") || ultimoMensaje.includes("evalua");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");

        // DETECCIÓN MIXTO
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero");
        const esMix = mencionaCuerpo && mencionaGluteo;

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("rostro")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("cola")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("rollito")) return "lipo_express";
            return null;
        };

        let key = esMix ? "lipo_express" : detectar(ultimoMensaje); // Si es mix, usamos base Lipo pero el Prompt maneja el texto.
        
        // Si no hay key en el último mensaje, intentamos recuperar del historial reciente
        if (!key && mensajesUsuario.length > 1) {
             const penultimo = mensajesUsuario[mensajesUsuario.length - 2].content.toLowerCase();
             key = detectar(penultimo);
        }

        let systemPrompt = "";
        
        if (key) {
            const datos = CLINICA[key];
            let basePrompt = PROMPT_VENTA;
            
            // INSTRUCCIONES DE NAVEGACIÓN DE PASOS
            if (pideLlamada) {
                basePrompt += "\n\n🚨 CLIENTE PIDE LLAMADA. RESPONDE: '¡Claro! Déjame tu número 👇 y te llamamos ya.'";
            } else if (pidePrecio) {
                basePrompt += "\n\n🚨 CLIENTE ESTÁ EN PASO 3 (PRECIO). RESPONDE CON EL SCRIPT DEL PASO 3 EXACTO.";
            } else if (preguntaComoFunciona) {
                basePrompt += "\n\n🚨 CLIENTE ESTÁ EN PASO 2 (CÓMO FUNCIONA). RESPONDE CON EL SCRIPT DEL PASO 2 EXACTO. NO DES PRECIO AÚN.";
            } else if (respuestaEvaluacion && historial.length > 2) { 
                // Asumimos que si responde sí/no y ya hablamos, estamos en el cierre
                basePrompt += "\n\n🚨 CLIENTE RESPONDIÓ SOBRE LA EVALUACIÓN. VE AL PASO 4 (CIERRE).";
            } else if (esMix) {
                basePrompt += "\n\n🚨 CLIENTE PIDE MIX. USA EL SCRIPT DE 'CASO ESPECIAL MIXTO - PASO 1'.";
            } else {
                // Por defecto, si pide info o saluda con intención
                basePrompt += "\n\n🚨 INICIO DE VENTA. USA EL SCRIPT DEL PASO 1 (GANCHO).";
            }

            systemPrompt = basePrompt
                .replace(/{PLAN}/g, datos.plan)
                .replace(/{PRECIO}/g, datos.precio)
                .replace(/{TECNOLOGIAS}/g, datos.tecnologias)
                .replace(/{BENEFICIO}/g, datos.beneficio)
                .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
        } else {
            // Si no hay tema, TRIAGE
            systemPrompt = PROMPT_TRIAGE;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.1, 
            max_tokens: 150
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
