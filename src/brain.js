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
        
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        const textoCompleto = mensajesUsuario.map(m => m.content.toLowerCase()).join(" ");
        
        // 1. DETECCIÓN DE URGENCIA (PRECIO)
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("vale") || ultimoMensaje.includes("costo") || ultimoMensaje.includes("sale") || ultimoMensaje.includes("promocion") || ultimoMensaje.includes("cuanto");

        // 2. DETECCIÓN DE TRATAMIENTO (DICCIONARIO AMPLIADO)
        const detectar = (txt) => {
            // FACIAL (Pink Glow / Rejuvenecimiento)
            if (
                txt.includes("facial") || txt.includes("face") || txt.includes("cara") || 
                txt.includes("rostro") || txt.includes("piel") || txt.includes("cutis") || 
                txt.includes("arrugas") || txt.includes("manchas") || txt.includes("acne") || 
                txt.includes("granos") || txt.includes("botox") || txt.includes("vitamina") || 
                txt.includes("peeling") || txt.includes("rejuveneci") || txt.includes("nasogeniano") ||
                txt.includes("ojeras") || txt.includes("papada") || txt.includes("hifu facial")
            ) return "pink_glow";
            
            // GLÚTEOS (Push Up)
            if (
                txt.includes("push") || txt.includes("gluteo") || txt.includes("glúteo") || 
                txt.includes("trasero") || txt.includes("cola") || txt.includes("nalga") || 
                txt.includes("poto") || txt.includes("pompis") || txt.includes("levantar") || 
                txt.includes("celulitis") || txt.includes("firmeza") || txt.includes("aumentar")
            ) return "push_up";
            
            // REDUCTIVO / CORPORAL (Lipo Express)
            if (
                txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || 
                txt.includes("guata") || txt.includes("barriga") || txt.includes("abdomen") || 
                txt.includes("michelines") || txt.includes("rollitos") || txt.includes("peso") || 
                txt.includes("gordit") || txt.includes("cintura") || txt.includes("modelar") || 
                txt.includes("corporal") || txt.includes("body") || txt.includes("faja")
            ) return "lipo_express";
            
            // DEPILACIÓN (Si preguntan, lo mandamos al menú general para no alucinar precios)
            if (
                txt.includes("depila") || txt.includes("laser") || txt.includes("vellos") || 
                txt.includes("pelo") || txt.includes("soprano") || txt.includes("alexandrita")
            ) return null; // Retorna NULL para activar el Menú Elegante (Triage)
            
            return null;
        };

        let key = detectar(ultimoMensaje);
        if (!key) key = detectar(textoCompleto);

        let systemPrompt = "";
        
        if (key) {
            // CASO: TRATAMIENTO DETECTADO
            const datos = CLINICA[key];
            if (!datos) { 
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            } else {
                let basePrompt = PROMPT_VENTA;
                
                // SI PIDE PRECIO -> ORDEN DIRECTA
                if (pidePrecio) {
                    basePrompt += "\n\n🚨 ALERTA: EL CLIENTE PIDE PRECIO. DALE EL VALOR ({PRECIO}) DIRECTAMENTE. NO USES LA PALABRA 'PROMO'.";
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
            // CASO: NO SE DETECTA TRATAMIENTO ESPECÍFICO
            if (pidePrecio) {
                // Si pide precio pero no sabemos de qué -> MENÚ ELEGANTE
                systemPrompt = PROMPT_VENTA
                    .replace(/{NOMBRE_CLIENTE}/g, nombrePila)
                    + "\n\n🚨 EL CLIENTE DIJO 'PRECIO' PERO NO SABEMOS DE QUÉ. EJECUTA EL 'CASO 1' (MENÚ ELEGANTE) MOSTRANDO LOS DOS VALORES (PUSH UP Y LIPO).";
            } else {
                // Saludo / Triage normal
                systemPrompt = PROMPT_TRIAGE.replace(/{NOMBRE_CLIENTE}/g, nombrePila);
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: systemPrompt }, ...historial],
            temperature: 0.2, 
            max_tokens: 350
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Brain Error:", error);
        return "Dame un segundo, estoy revisando la agenda... 📅";
    }
}
