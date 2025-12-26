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
        
        // DETECCIÓN: ¿PIDE PRECIO?
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("vale") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale");

        // DETECCIÓN: ¿SABEMOS DE QUÉ HABLA?
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
            // CONTEXTO ESPECÍFICO (Sabe qué quiere)
            const datos = CLINICA[key];
            if (!datos) { 
                // CASO RARO: Detectó algo pero no hay datos -> General
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            } else {
                let basePrompt = PROMPT_VENTA;
                
                // SI PIDE PRECIO Y SABEMOS QUÉ ES -> ORDEN DIRECTA
                if (pidePrecio) {
                    basePrompt += "\n\n🚨 CLIENTE PIDE VALOR. DALE EL PRECIO ({PRECIO}) DIRECTAMENTE. NO USES LA PALABRA 'PROMO'.";
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
            // NO HAY CONTEXTO (No nombró tratamiento)
            if (pidePrecio) {
                // CASO CRÍTICO: Pide precio pero no sabemos de qué -> MENÚ ELEGANTE
                systemPrompt = PROMPT_VENTA
                    .replace(/{NOMBRE_CLIENTE}/g, nombrePila)
                    + "\n\n🚨 EL CLIENTE DIJO 'PRECIO' PERO NO SABEMOS DE QUÉ. EJECUTA EL 'CASO 1' (MENÚ ELEGANTE) MOSTRANDO LOS DOS VALORES (PUSH UP Y LIPO).";
            } else {
                // Saludo normal
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
        console.error("Brain Error:", error);
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
