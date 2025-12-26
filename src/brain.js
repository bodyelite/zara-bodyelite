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
        
        // 1. SOLO MIRAMOS EL ÚLTIMO MENSAJE (CERO MEMORIA ZOMBIE)
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        
        // Detección de intenciones
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaZonas = ultimoMensaje.includes("zonas") || ultimoMensaje.includes("sesiones") || ultimoMensaje.includes("veces");
        const afirmacion = ultimoMensaje === "si" || ultimoMensaje.includes("si ") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno");
        
        // Detección de conflicto (Mix de tratamientos)
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollitos") || ultimoMensaje.includes("abdomen");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("cola") || ultimoMensaje.includes("nalga");
        const esMix = mencionaCuerpo && mencionaGluteo;

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("cara") || txt.includes("rostro") || txt.includes("piel") || txt.includes("glow")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("trasero") || txt.includes("cola") || txt.includes("nalga")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("guata") || txt.includes("abdomen") || txt.includes("rollitos")) return "lipo_express";
            if (txt.includes("depila") || txt.includes("laser") || txt.includes("vello")) return "depilacion";
            return null;
        };

        // Solo detectamos tema en el ÚLTIMO mensaje. Si no hay, no hay.
        let key = esMix ? "lipo_express" : detectar(ultimoMensaje); // Si es mix, cargamos base Lipo pero el Prompt manejará el Mix.
        
        let systemPrompt = "";
        
        if (key) {
            const datos = CLINICA[key];
            if (!datos) { 
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            } else {
                let basePrompt = PROMPT_VENTA;
                
                if (esMix) {
                    basePrompt += "\n\n🚨 ALERTA CRÍTICA: EL CLIENTE QUIERE MIX (ROLLITOS Y GLÚTEOS). EJECUTA EL 'CASO ESPECIAL A' (OFRECE EVALUACIÓN PARA PLAN MIXTO).";
                } else if (pideLlamada) {
                    basePrompt += "\n\n🚨 ALERTA: CLIENTE PIDE LLAMADA. USA 'CASO C'. PIDE SU NÚMERO.";
                } else if (preguntaZonas) {
                    basePrompt += "\n\n🚨 ALERTA: PREGUNTA POR ZONAS. USA 'CASO B' (ARGUMENTO DE AHORRO).";
                } else if (pidePrecio) {
                    basePrompt += "\n\n🚨 ALERTA: PIDE PRECIO. SALTA AL PASO 3.";
                } else if (afirmacion) {
                    basePrompt += "\n\n🚨 ALERTA: DIJO SÍ. MIRA EL HISTORIAL Y DALE EL SIGUIENTE PASO DEL PING-PONG.";
                } else {
                    basePrompt += "\n\n🚨 ALERTA: CLIENTE PIDE INFO. EMPIEZA POR EL PASO 1.";
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
            // Si no hay tema claro en el último mensaje, TRIAGE INMEDIATO.
            systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.1, 
            max_tokens: 250
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
