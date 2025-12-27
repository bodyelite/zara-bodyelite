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
    if (t.includes("fitness") || t.includes("fortalecer") || t.includes("musculo")) return "body_fitness";
    if (t.includes("papada") || t.includes("menton") || t.includes("cuello")) return "lipo_papada";
    if (t.includes("exosoma")) return "exosomas";
    if (t.includes("smart")) return "face_smart";
    if (t.includes("tensor") || t.includes("post parto") || t.includes("bariatrica")) return "body_tensor";
    if (t.includes("elite")) return "lipo_body_elite";
    if (t.includes("focalizada")) return "lipo_focalizada";
    const cuerpo = t.includes("lipo") || t.includes("reduc") || t.includes("grasa") || t.includes("rollito") || t.includes("abdomen");
    const gluteo = t.includes("push") || t.includes("gluteo") || t.includes("cola");
    if (cuerpo && gluteo) return "push_up";
    if (t.includes("facial") || t.includes("rostro") || t.includes("cara") || t.includes("arrugas")) return "full_face";
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
            if (temaEncontrado) { key = temaEncontrado; break; }
        }

        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const afirmacion = ultimoMensaje.includes("si") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("ok") || ultimoMensaje.includes("dale") || ultimoMensaje.includes("interesa");
        
        const botPreguntoFuncionamiento = ultimoBot.includes("como funciona");
        const botPreguntoPrecio = ultimoBot.includes("sobre el precio");
        const botPreguntoEvaluacion = ultimoBot.includes("evaluacion con ia");

        let promptFinal = "";
        if (pideLlamada) promptFinal = RESPUESTA_LLAMADA;
        else if (!key) promptFinal = PROMPT_TRIAGE;
        else if (botPreguntoFuncionamiento && afirmacion) promptFinal = PASO_2_TECNOLOGIA;
        else if (botPreguntoPrecio && afirmacion) promptFinal = PASO_3_PRECIO;
        else if (botPreguntoEvaluacion) promptFinal = PASO_4_CIERRE;
        else promptFinal = PASO_1_GANCHO;

        if (key && CLINICA[key]) {
            const d = CLINICA[key];
            promptFinal = promptFinal
                .replace(/{PLAN}/g, d.plan).replace(/{BENEFICIO}/g, d.beneficio)
                .replace(/{TECNOLOGIAS}/g, d.tecnologias).replace(/{PRECIO}/g, d.precio)
                .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
        } else { promptFinal = PROMPT_TRIAGE; }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: promptFinal + " Sé directa y usa el formato de los 4 pilares. No inventes info extra." }, ...historial],
            temperature: 0.0,
            max_tokens: 150 
        });
        return completion.choices[0].message.content;
    } catch (error) { return "¡Hola! 👋 Cuéntame: ¿Tu objetivo es reducir rollitos 🌿, levantar glúteos 🍑 o rejuvenecer tu rostro ✨?"; }
}
