import OpenAI from 'openai';
import dotenv from 'dotenv';
import { PROMPT_TRIAGE, PASO_1_GANCHO, PASO_2_TECNOLOGIA, PASO_3_PRECIO, PASO_4_CIERRE, RESPUESTA_LLAMADA } from './config/persona.js';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';
dotenv.config();
function limpiar(t) { return t ? t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""; }
function detectarTema(texto) {
    const t = limpiar(texto);
    if (t.includes("push") || t.includes("gluteo") || t.includes("cola") || t.includes("pompa")) return "push_up";
    if (t.includes("fitness") || t.includes("fortalecer") || t.includes("musculo")) return "body_fitness";
    if (t.includes("full face") || t.includes("rostro")) return "full_face";
    if (t.includes("elite")) return "lipo_body_elite";
    if (t.includes("tensor")) return "body_tensor";
    if (t.includes("reductiva")) return "lipo_reductiva";
    if (t.includes("lipo") || t.includes("grasa") || t.includes("rollito")) return "lipo_express";
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
        const tema = detectarTema(msjsUsr[i].content);
        if (tema) { key = tema; break; }
    }
    let p = "";
    const afirmacion = uMsg.includes("si") || uMsg.includes("vale") || uMsg.includes("ya") || uMsg.includes("y?") || uMsg.includes("claro") || uMsg.length < 3;
    const negacion = uMsg.includes("no");
    if (uMsg.includes("llam") || uMsg.includes("numero")) p = RESPUESTA_LLAMADA;
    else if (!key || uMsg === "hola") p = PROMPT_TRIAGE;
    else if (uBot.includes("como funciona") && afirmacion) p = PASO_2_TECNOLOGIA;
    else if (uBot.includes("sobre el precio") && afirmacion) p = PASO_3_PRECIO;
    else if (uBot.includes("evaluacion con ia") && (afirmacion || negacion)) p = PASO_4_CIERRE;
    else if (uMsg.includes("precio") || uMsg.includes("cuanto")) p = PASO_3_PRECIO;
    else p = PASO_1_GANCHO;
    const d = CLINICA[key] || CLINICA["lipo_express"];
    return p.replace(/{NOMBRE}/g, nombre).replace(/{PLAN}/g, d.plan).replace(/{BENEFICIO}/g, d.beneficio).replace(/{TECNOLOGIAS}/g, d.tecnologias).replace(/{PRECIO}/g, d.precio).replace(/{LINK_AGENDA}/g, NEGOCIO.agenda_link);
}
