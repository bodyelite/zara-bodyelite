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

function detectarTema(texto) {
    if (!texto) return null;
    const t = limpiarTexto(texto);
    
    const cuerpo = t.includes("lipo") || t.includes("reduc") || t.includes("grasa") || t.includes("rollito") || t.includes("rollos") || t.includes("peso") || t.includes("abdomen") || t.includes("cintura");
    const gluteo = t.includes("push") || t.includes("gluteo") || t.includes("trasero") || t.includes("cola") || t.includes("nalga");
    
    if (cuerpo && gluteo) return "mix_corporal";
    if (t.includes("facial") || t.includes("face") || t.includes("rostro") || t.includes("arrugas") || t.includes("manchas") || t.includes("piel") || t.includes("rejuvenec")) return "pink_glow";
    if (gluteo) return "push_up";
    if (cuerpo) return "lipo_express";
    
    return null;
}

export async function pensar(historial, nombreCompleto) {
    try {
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const mensajesBot = historial.filter(m => m.role === 'assistant');
        
        const ultimoMensaje = limpiarTexto(mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content : "");
        const ultimoBot = limpiarTexto(mensajesBot.length > 0 ? mensajesBot[mensajesBot.length - 1].content : "");

        let key = null;
        for (let i = mensajesUsuario.length - 1; i >= 0; i--) {
            const temaEncontrado = detectarTema(mensajesUsuario[i].content);
            if (temaEncontrado) {
                key = temaEncontrado;
                break; 
            }
        }
        if (!key && historial.some(m => m.content.includes("Reloj de Arena"))) key = "mix_corporal";

        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero") || ultimoMensaje.includes("contactar");
        
        const afirmacion = ultimoMensaje.includes("si") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno") || ultimoMensaje.includes("ok") || ultimoMensaje.includes("dale") || ultimoMensaje.includes("ya") || ultimoMensaje.includes("a ver") || ultimoMensaje.includes("me interesa") || ultimoMensaje.includes("cuentame") || ultimoMensaje.includes("obvio");
        
        const negacion = ultimoMensaje.includes("no") || ultimoMensaje.includes("paso") || ultimoMensaje.includes("nada");
        const preguntaPrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("cuesta") || ultimoMensaje.includes("sale");

        const botPreguntoFuncionamiento = ultimoBot.includes("como funciona");
        const botPreguntoPrecio = ultimoBot.includes("sobre el precio");
        const botPreguntoEvaluacion = ultimoBot.includes("evaluacion con ia") || ultimoBot.includes("hecho una evaluacion");
        
        const esMixActual = detectarTema(ultimoMensaje) === "mix_corporal";

        let promptFinal = "";

        if (pideLlamada) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (esMixActual && !botPreguntoFuncionamiento && !botPreguntoPrecio && !botPreguntoEvaluacion) {
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
        } else {
            if(promptFinal !== RESPUESTA_LLAMADA) promptFinal = PROMPT_TRIAGE;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: promptFinal }, ...historial],
            temperature: 0.0,
            max_tokens: 150 
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
