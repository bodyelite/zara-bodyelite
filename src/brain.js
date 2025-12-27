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

function limpiarTexto(texto) {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function pensar(historial, nombreCompleto) {
    try {
        const nombrePila = nombreCompleto ? nombreCompleto.split(" ")[0] : "Hola";
        
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const mensajesBot = historial.filter(m => m.role === 'assistant');
        
        const ultimoMensaje = limpiarTexto(mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content : "");
        const ultimoBot = limpiarTexto(mensajesBot.length > 0 ? mensajesBot[mensajesBot.length - 1].content : "");

        const mencionaFacial = ultimoMensaje.includes("facial") || ultimoMensaje.includes("face") || ultimoMensaje.includes("rostro") || ultimoMensaje.includes("arrugas") || ultimoMensaje.includes("manchas") || ultimoMensaje.includes("piel") || ultimoMensaje.includes("rejuvenec");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero") || ultimoMensaje.includes("cola");
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito") || ultimoMensaje.includes("peso") || ultimoMensaje.includes("abdomen");
        const esMix = mencionaCuerpo && mencionaGluteo;

        let key = null;
        if (esMix) key = "mix_corporal";
        else if (mencionaFacial) key = "pink_glow";
        else if (mencionaGluteo) key = "push_up";
        else if (mencionaCuerpo) key = "lipo_express";

        if (!key && mensajesUsuario.length > 1) {
             const penultimo = limpiarTexto(mensajesUsuario[mensajesUsuario.length - 2].content);
             if (penultimo.includes("arrugas") || penultimo.includes("facial")) key = "pink_glow";
             else if (penultimo.includes("gluteo")) key = "push_up";
             else if (penultimo.includes("lipo") || penultimo.includes("rollito")) key = "lipo_express";
             else if (historial.some(m => m.content.includes("Reloj de Arena"))) key = "mix_corporal";
        }

        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const afirmacion = ultimoMensaje.includes("si") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno") || ultimoMensaje.includes("ok") || ultimoMensaje.includes("dale");
        const negacion = ultimoMensaje.includes("no");
        const preguntaPrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor");

        const botPreguntoFuncionamiento = ultimoBot.includes("como funciona");
        const botPreguntoPrecio = ultimoBot.includes("sobre el precio");
        const botPreguntoEvaluacion = ultimoBot.includes("evaluacion con ia") || ultimoBot.includes("hecho una evaluacion");

        let promptFinal = "";

        if (pideLlamada) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (esMix && !botPreguntoFuncionamiento && !botPreguntoPrecio && !botPreguntoEvaluacion) {
             promptFinal = PASO_MIX_ESTRATEGA;
        } else if (!key && !preguntaPrecio) {
            promptFinal = PROMPT_TRIAGE; 
        } else {
            if (preguntaPrecio) {
                promptFinal = PASO_3_PRECIO;
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
            temperature: 0.0, 
            max_tokens: 100 
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
