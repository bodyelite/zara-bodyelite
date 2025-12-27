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
    if (t.includes("papada") || t.includes("menton")) return "lipo_papada";
    if (t.includes("smart")) return "face_smart";
    if (t.includes("tensor")) return "body_tensor";
    if (t.includes("elite")) return "lipo_body_elite";
    const cuerpo = t.includes("lipo") || t.includes("reduc") || t.includes("grasa") || t.includes("rollito") || t.includes("abdomen");
    const gluteo = t.includes("push") || t.includes("gluteo") || t.includes("cola");
    if (cuerpo && gluteo) return "push_up";
    if (t.includes("facial") || t.includes("rostro") || t.includes("arrugas")) return "full_face";
    if (gluteo) return "push_up";
    if (cuerpo) return "lipo_express";
    return null;
}

export async function pensar(historial, nombreCompleto) {
    try {
        const msjsUsr = historial.filter(m => m.role === 'user');
        const msjsBot = historial.filter(m => m.role === 'assistant');
        const uMsg = limpiarTexto(msjsUsr.length > 0 ? msjsUsr[msjsUsr.length - 1].content : "");
        const uBot = limpiarTexto(msjsBot.length > 0 ? msjsBot[msjsBot.length - 1].content : "");

        let key = null;
        for (let i = msjsUsr.length - 1; i >= 0; i--) {
            const tema = detectarTema(msjsUsr[i].content);
            if (tema) { key = tema; break; }
        }

        const afirmacion = uMsg.includes("si") || uMsg.includes("vale") || uMsg.includes("ya") || uMsg.includes("y?") || uMsg.includes("dale") || uMsg.includes("cuentame");
        const pidePrecio = uMsg.includes("precio") || uMsg.includes("cuanto") || uMsg.includes("valor") || uMsg.includes("cuesta");

        let promptFinal = "";
        if (uMsg.includes("llam") || uMsg.includes("numero")) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (!key) {
            promptFinal = PROMPT_TRIAGE;
        } else if (pidePrecio || uBot.includes("sobre el precio")) {
            promptFinal = PASO_3_PRECIO;
        } else if (uBot.includes("como funciona") && afirmacion) {
            promptFinal = PASO_2_TECNOLOGIA;
        } else if (uBot.includes("evaluacion con ia")) {
            promptFinal = PASO_4_CIERRE;
        } else if (uBot.includes("objetivo es reducir")) {
            promptFinal = PASO_1_GANCHO;
        } else {
            promptFinal = PASO_1_GANCHO;
        }

        const d = CLINICA[key] || CLINICA["lipo_express"];
        promptFinal = promptFinal
            .replace(/{PLAN}/g, d.plan).replace(/{BENEFICIO}/g, d.beneficio)
            .replace(/{TECNOLOGIAS}/g, d.tecnologias).replace(/{PRECIO}/g, d.precio)
            .replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: "ERES ZARA. USA ESTE TEXTO EXACTO, NO AÑADAS NADA MÁS:\n\n" + promptFinal }],
            temperature: 0,
            max_tokens: 150 
        });
        return completion.choices[0].message.content;
    } catch (error) { return "¡Hola! 👋 Cuéntame tu objetivo: ¿Reducir rollitos, levantar glúteos o rostro?"; }
}
