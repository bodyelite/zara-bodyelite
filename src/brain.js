import OpenAI from 'openai';
import dotenv from 'dotenv';
import { 
    PROMPT_TRIAGE, PASO_1_GANCHO, PASO_2_TECNOLOGIA, 
    PASO_3_PRECIO, PASO_4_CIERRE, PASO_MIX_ESTRATEGA, RESPUESTA_LLAMADA 
} from './config/persona.js';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function pensar(historial, nombreCompleto) {
    try {
        const nombrePila = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";
        
        // 1. ANÁLISIS DEL ÚLTIMO MENSAJE
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        
        // DETECTORES DE INTENCIÓN
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaComo = ultimoMensaje.includes("como") || ultimoMensaje.includes("funciona") || ultimoMensaje.includes("consiste") || ultimoMensaje.includes("que es") || ultimoMensaje.includes("tecnologia");
        const respuestaCierre = ultimoMensaje.includes("si") || ultimoMensaje.includes("no") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno") || ultimoMensaje.includes("ok");
        
        // DETECCIÓN DE MIX (Conflicto)
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero");
        const esMix = mencionaCuerpo && mencionaGluteo;

        // SELECCIÓN DE PLAN
        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("rostro")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("cola")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("rollito")) return "lipo_express";
            return null;
        };

        // Buscamos tema en el último mensaje, o en el penúltimo si el último fue un "sí/no/precio"
        let key = esMix ? "lipo_express" : detectar(ultimoMensaje);
        if (!key && mensajesUsuario.length > 1) {
             key = detectar(mensajesUsuario[mensajesUsuario.length - 2].content.toLowerCase());
        }

        let promptFinal = "";

        // LÓGICA DE SELECCIÓN DE PASO (STATE MACHINE)
        if (pideLlamada) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (esMix) {
            promptFinal = PASO_MIX_ESTRATEGA;
        } else if (!key) {
            promptFinal = PROMPT_TRIAGE; // Si no sé de qué hablamos, pregunto.
        } else {
            // Ya tenemos un plan (key), ahora elegimos el PASO
            if (pidePrecio) {
                promptFinal = PASO_3_PRECIO;
            } else if (preguntaComo) {
                promptFinal = PASO_2_TECNOLOGIA;
            } else if (respuestaCierre && historial.length >= 4) {
                // Si dice sí/no y ya hemos hablado un poco, es cierre
                promptFinal = PASO_4_CIERRE;
            } else {
                // Por defecto, empezamos
                promptFinal = PASO_1_GANCHO;
            }
        }

        // INYECCIÓN DE DATOS AL PROMPT ELEGIDO
        if (key && CLINICA[key]) {
            const d = CLINICA[key];
            promptFinal = promptFinal
                .replace(/{PLAN}/g, d.plan)
                .replace(/{BENEFICIO}/g, d.beneficio)
                .replace(/{TECNOLOGIAS}/g, d.tecnologias)
                .replace(/{PRECIO}/g, d.precio)
                .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: promptFinal }, ...historial], // AQUÍ ESTÁ EL TRUCO: Solo le pasamos el prompt de ese paso específico
            temperature: 0.1, 
            max_tokens: 200
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
