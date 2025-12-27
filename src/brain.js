import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_TRIAGE, PASO_1_GANCHO, PASO_2_TECNOLOGIA, PASO_3_PRECIO, PASO_4_CIERRE, RESPUESTA_LLAMADA } from './config/persona.js';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function limpiar(t) { return t ? t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : ""; }

function detectarTema(texto) {
    const t = limpiar(texto);
    if (t.includes("push") || t.includes("gluteo")) return "push_up";
    if (t.includes("fitness") || t.includes("fortalecer")) return "body_fitness";
    if (t.includes("arruga") || t.includes("rostro")) return "full_face";
    if (t.includes("lipo") || t.includes("grasa")) return "lipo_express";
    return null;
}

export async function pensar(historial, nombreCompleto) {
    const nombre = nombreCompleto ? nombreCompleto.split(" ")[0] : "estimada/o";
    const msjsUsr = historial.filter(m => m.role === 'user');
    const msjsBot = historial.filter(m => m.role === 'assistant');
    const uMsg = limpiar(msjsUsr[msjsUsr.length - 1]?.content);
    const uBot = limpiar(msjsBot[msjsBot.length - 1]?.content);

    let key = null;
    for (let i = msjsUsr.length - 1; i >= 0; i--) {
        const t = detectarTema(msjsUsr[i].content);
        if (t) { key = t; break; }
    }

    let p = "";
    if (uMsg.includes("hola") || uMsg === "ola" || !key) p = PROMPT_TRIAGE;
    else if (uMsg.includes("llam") || uMsg.includes("numero")) p = RESPUESTA_LLAMADA;
    else if (uBot.includes("como funciona")) p = PASO_2_TECNOLOGIA;
    else if (uBot.includes("sobre el precio")) p = PASO_3_PRECIO;
    else if (uBot.includes("evaluacion con ia")) p = PASO_4_CIERRE;
    else p = PASO_1_GANCHO;

    const d = CLINICA[key] || CLINICA["lipo_express"];
    const final = p.replace(/{NOMBRE}/g, nombre).replace(/{PLAN}/g, d.plan).replace(/{BENEFICIO}/g, d.beneficio).replace(/{TECNOLOGIAS}/g, d.tecnologias).replace(/{PRECIO}/g, d.precio).replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: "Eres Zara. Responde exactamente con este texto:\n" + final }],
        temperature: 0
    });
    return completion.choices[0].message.content;
}
