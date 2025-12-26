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

// 1. FUNCIÓN DE LIMPIEZA (La clave para que no falle con tildes)
function limpiarTexto(texto) {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function pensar(historial, nombreCompleto) {
    try {
        const nombrePila = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";
        
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const mensajesBot = historial.filter(m => m.role === 'assistant');
        
        // 2. APLICAMOS LIMPIEZA AQUÍ
        const ultimoMensaje = limpiarTexto(mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content : "");
        const ultimoBot = limpiarTexto(mensajesBot.length > 0 ? mensajesBot[mensajesBot.length - 1].content : "");

        // 3. DETECCIONES (Ahora funcionan aunque el cliente use tildes)
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaComo = ultimoMensaje.includes("como") || ultimoMensaje.includes("funciona") || ultimoMensaje.includes("consiste") || ultimoMensaje.includes("que es");
        const afirmacion = ultimoMensaje.includes("si") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno") || ultimoMensaje.includes("ok") || ultimoMensaje.includes("dale");
        const negacion = ultimoMensaje.includes("no");

        // CONTEXTO DE PREGUNTA ANTERIOR (La Escalera)
        const botPreguntoFuncionamiento = ultimoBot.includes("como logramos") || ultimoBot.includes("como funciona") || ultimoBot.includes("resultados reales");
        const botPreguntoPrecio = ultimoBot.includes("conocer el valor") || ultimoBot.includes("sobre el valor") || ultimoBot.includes("inversion");
        const botPreguntoEvaluacion = ultimoBot.includes("evaluacion") || ultimoBot.includes("ahorrar asi") || ultimoBot.includes("te hace sentido");

        // DETECCIÓN DE MIX (Ahora detecta "glúteo" correctamente como "gluteo")
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero") || ultimoMensaje.includes("cola");
        const esMix = mencionaCuerpo && mencionaGluteo;

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("rostro")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("cola")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("rollito")) return "lipo_express";
            return null;
        };

        // SELECCIÓN DE LLAVE
        let key = esMix ? "mix_corporal" : detectar(ultimoMensaje);
        
        // Memoria corta (si no hay tema en este mensaje, mira el anterior)
        if (!key && mensajesUsuario.length > 1) {
             const penultimo = limpiarTexto(mensajesUsuario[mensajesUsuario.length - 2].content);
             key = detectar(penultimo);
        }
        // Persistencia del Mix
        if (!key && historial.some(m => m.content.includes("Reloj de Arena"))) key = "mix_corporal";

        let promptFinal = "";

        // MÁQUINA DE ESTADOS
        if (pideLlamada) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (esMix && !preguntaComo && !pidePrecio) {
            promptFinal = PASO_MIX_ESTRATEGA;
        } else if (!key) {
            promptFinal = PROMPT_TRIAGE; 
        } else {
            if (pidePrecio) {
                promptFinal = PASO_3_PRECIO;
            } else if (preguntaComo) {
                promptFinal = PASO_2_TECNOLOGIA;
            } else if (botPreguntoFuncionamiento && afirmacion) {
                promptFinal = PASO_2_TECNOLOGIA;
            } else if (botPreguntoPrecio && afirmacion) {
                promptFinal = PASO_3_PRECIO;
            } else if (botPreguntoEvaluacion && (afirmacion || negacion)) {
                promptFinal = PASO_4_CIERRE;
            } else {
                promptFinal = PASO_1_GANCHO;
            }
        }

        // LEEMOS LA ENCICLOPEDIA
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
            messages: [{ role: "system", content: promptFinal }, ...historial],
            temperature: 0.1, 
            max_tokens: 200
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
