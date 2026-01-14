import OpenAI from 'openai';
import { DateTime } from 'luxon';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { CLINICA } from './config/clinic.js';
import { NEGOCIO } from './config/business.js';
import { FLUJO_MAESTRO } from './flow.js';
import { FLUJO_CAMPAÑA } from './flow_campaign.js';
import { checkAvailability, crearEvento } from './google_calendar.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CAMPAÑA_SPECIALS = {
    "lipo": { ref: "lipo_express", titulo: "LIPO SIN CIRUGÍA", normal: "$565.500", oferta: "$395.850", ahorro: "$169.650" },
    "push_up": { ref: "push_up", titulo: "PUSH UP GLÚTEOS", normal: "$487.500", oferta: "$341.250", ahorro: "$146.250" },
    "rostro": { ref: "face_antiage", titulo: "ROSTRO ANTIAGE", normal: "$337.200", oferta: "$269.760", ahorro: "$67.440" }
};

export async function pensar(historial, nombreCliente) {
    let agendaRaw = await checkAvailability();
    const nowChile = DateTime.now().setZone('America/Santiago');
    const esAM = nowChile.hour < 12;

    const historialTexto = historial.map(m => m.content.toLowerCase()).join(" ");
    const esDeCampaña = historialTexto.includes("quiero mi evaluación") || historialTexto.includes("quiero mi evaluacion");
    
    const SYSTEM_PROMPT = `
    ERES ZARA, LA VENDEDORA EXPERTA DE BODY ELITE.
    
    ESTRICTA ORDEN DE RESPUESTA (MODO FRANCOTIRADOR):
    
    1. SI EL CLIENTE DICE LA ZONA (Ej: "Guatita"):
       - Paso A: Explica brevemente por qué el tratamiento es ideal para esa zona específica (reducir/tensar).
       - Paso B: PREGUNTA INMEDIATAMENTE EL DOLOR: "¿Qué te incomoda más en esa zona: la grasita localizada (volumen) o la flacidez?".
       - NO des precios ni hables de IA aún.

    2. SI EL CLIENTE RESPONDE EL DOLOR (Ej: "Grasa"):
       - Paso A: Valida su dolor ("¡Entendido! Para el volumen lo mejor es...").
       - Paso B: Explica cómo la tecnología (HIFU/Ondas) soluciona ESE dolor específico.
       - Paso C: Introduce la EVALUACIÓN CON IA como filtro de seguridad y profesionalismo.

    3. SI EL CLIENTE ACEPTA O PREGUNTA PRECIO:
       - Muestra la tabla de las 3 prestaciones (Precio Ancla, Oferta y Ahorro) con saltos de línea.
       - Recalca que el 35% OFF vence el 31 de Enero.

    4. REGLA DE ORO DE AGENDA (AM/PM):
       - SI ESTAMOS EN AM (Hora actual: ${nowChile.toFormat('HH:mm')}): Solo ofrece UNA hora para hoy en la TARDE.
       - SI ESTAMOS EN PM: Solo ofrece UNA hora para MAÑANA en la MAÑANA.
       - NUNCA des listas de horarios. Solo una opción. Si no le sirve, ahí preguntas: "¿Qué horario te acomoda?".

    TABLA DE CAMPAÑA: ${JSON.stringify(CAMPAÑA_SPECIALS)}
    INFO CLÍNICA: ${JSON.stringify(CLINICA)}
    DISPONIBILIDAD: ${agendaRaw}
    `;

    try {
        const runner = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...historial],
            temperature: 0.2
        });
        return runner.choices[0].message.content;
    } catch (e) { return "Dame un segundo..."; }
}
