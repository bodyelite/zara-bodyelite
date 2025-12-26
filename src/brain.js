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
        
        // 1. OBTENER MENSAJES CLAVE (USUARIO Y BOT ANTERIOR)
        const mensajesUsuario = historial.filter(m => m.role === 'user');
        const mensajesBot = historial.filter(m => m.role === 'assistant');
        
        const ultimoMensaje = mensajesUsuario.length > 0 ? mensajesUsuario[mensajesUsuario.length - 1].content.toLowerCase() : "";
        const ultimoBot = mensajesBot.length > 0 ? mensajesBot[mensajesBot.length - 1].content.toLowerCase() : "";

        // 2. DETECTORES DE INTENCIÓN DEL USUARIO (LO QUE DICE AHORA)
        const pidePrecio = ultimoMensaje.includes("precio") || ultimoMensaje.includes("valor") || ultimoMensaje.includes("costo");
        const pideLlamada = ultimoMensaje.includes("llamen") || ultimoMensaje.includes("llamada") || ultimoMensaje.includes("fono") || ultimoMensaje.includes("numero");
        const preguntaComo = ultimoMensaje.includes("como") || ultimoMensaje.includes("funciona") || ultimoMensaje.includes("consiste") || ultimoMensaje.includes("que es");
        const afirmacion = ultimoMensaje === "si" || ultimoMensaje.includes("si ") || ultimoMensaje.includes("claro") || ultimoMensaje.includes("bueno") || ultimoMensaje.includes("ok") || ultimoMensaje.includes("dale");
        const negacion = ultimoMensaje === "no" || ultimoMensaje.includes("no ");

        // 3. DETECTOR DE CONTEXTO DEL BOT (LO QUE PREGUNTÓ ANTES) -> LA CLAVE DE LA ESCALERA
        const botPreguntoFuncionamiento = ultimoBot.includes("como logramos") || ultimoBot.includes("como funciona") || ultimoBot.includes("resultados reales");
        const botPreguntoPrecio = ultimoBot.includes("conocer el valor") || ultimoBot.includes("sobre el precio") || ultimoBot.includes("inversion");
        const botPreguntoEvaluacion = ultimoBot.includes("evaluacion") || ultimoBot.includes("ahorrar asi") || ultimoBot.includes("te hace sentido");

        // 4. DETECCIÓN DE TEMA (PLAN)
        const mencionaCuerpo = ultimoMensaje.includes("lipo") || ultimoMensaje.includes("reduc") || ultimoMensaje.includes("grasa") || ultimoMensaje.includes("rollito");
        const mencionaGluteo = ultimoMensaje.includes("push") || ultimoMensaje.includes("gluteo") || ultimoMensaje.includes("trasero") || ultimoMensaje.includes("cola");
        const esMix = mencionaCuerpo && mencionaGluteo;

        const detectar = (txt) => {
            if (txt.includes("facial") || txt.includes("face") || txt.includes("rostro")) return "pink_glow";
            if (txt.includes("push") || txt.includes("gluteo") || txt.includes("cola")) return "push_up";
            if (txt.includes("lipo") || txt.includes("reduc") || txt.includes("grasa") || txt.includes("rollito")) return "lipo_express";
            return null;
        };

        // Recuperar tema del historial si no está en el mensaje actual
        let key = esMix ? "lipo_express" : detectar(ultimoMensaje);
        if (!key && mensajesUsuario.length > 1) {
             key = detectar(mensajesUsuario[mensajesUsuario.length - 2].content.toLowerCase());
        }

        // 5. MÁQUINA DE ESTADOS (LÓGICA DE ESCALERA)
        let promptFinal = "";

        // INTERRUPCIONES PRIORITARIAS
        if (pideLlamada) {
            promptFinal = RESPUESTA_LLAMADA;
        } else if (esMix) {
            promptFinal = PASO_MIX_ESTRATEGA;
        } else if (!key) {
            promptFinal = PROMPT_TRIAGE; 
        
        // SECUENCIA LÓGICA (EL PING-PONG REAL)
        } else {
            if (pidePrecio) {
                // Si el usuario pide precio explícitamente, vamos al Paso 3
                promptFinal = PASO_3_PRECIO;
            } else if (preguntaComo) {
                // Si el usuario pregunta cómo funciona, vamos al Paso 2
                promptFinal = PASO_2_TECNOLOGIA;
            } else if (botPreguntoFuncionamiento && afirmacion) {
                // ESTRUCTURA: Bot preguntó "¿Quieres saber cómo funciona?" + User "Sí" -> PASO 2
                promptFinal = PASO_2_TECNOLOGIA;
            } else if (botPreguntoPrecio && afirmacion) {
                // ESTRUCTURA: Bot preguntó "¿Quieres precio?" + User "Sí" -> PASO 3
                promptFinal = PASO_3_PRECIO;
            } else if (botPreguntoEvaluacion && (afirmacion || negacion)) {
                // ESTRUCTURA: Bot preguntó sobre evaluación + User responde lo que sea -> PASO 4
                promptFinal = PASO_4_CIERRE;
            } else {
                // Si no estamos en ninguno de los anteriores, asumimos inicio del ciclo (Hook)
                promptFinal = PASO_1_GANCHO;
            }
        }

        // 6. INYECCIÓN DE DATOS
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
