/* =========================================================
   MOTOR RESPUESTA V7 – Limpio, seguro, empático y estable
   ========================================================= */

export function procesarMensaje(texto) {
    if (!texto || typeof texto !== "string") return "fallback";

    const msg = texto.toLowerCase().trim();

    // --- SALUDO / INICIO ---
    const saludos = ["hola", "buenas", "holi", "ola", "hello"];
    if (saludos.some(s => msg.includes(s))) {
        return `Hola ✨, soy Zara del equipo Body Elite 🤍. Estoy aquí para ayudarte a encontrar tu mejor versión con total honestidad clínica. Cuéntame, ¿qué zona o tratamiento te gustaría mejorar?`;
    }

    // --- ZONAS COLOQUIALES ---
    const zonas = {
        "guata": "abdomen",
        "guatita": "abdomen",
        "poto": "glúteos",
        "trasero": "glúteos",
        "gluteo": "glúteos",
        "glúteo": "glúteos",
        "panza": "abdomen",
        "papada": "papada",
        "brazos": "brazos",
        "piernas": "piernas",
        "muslos": "muslos",
        "cara": "rostro",
        "arrugas": "rostro",
        "patas de gallo": "contorno ocular"
    };

    for (const [coloq, zonaReal] of Object.entries(zonas)) {
        if (msg.includes(coloq)) {
            return generarRespuestaZona(zonaReal);
        }
    }

    // --- PALABRAS CLAVE ---
    if (msg.includes("precio") || msg.includes("vale")) {
        return "En tu evaluación gratuita revisamos tu caso y definimos el plan exacto según tus necesidades 🤍. ¿Quieres que te deje el link para agendar?";
    }

    if (msg.includes("duel") || msg.includes("duele")) {
        return "Nuestras tecnologías son no invasivas 🤍. Puedes sentir calor o vibración, pero nada doloroso. ¿Quieres que te deje tu evaluación?";
    }

    // --- FALLBACK INTELIGENTE ---
    return `Disculpa, no logré interpretar bien tu mensaje 🙊. En tu evaluación gratuita (40 min) una especialista puede explicarte todo paso a paso 🤍. ¿Quieres que te deje el link para agendar?`;
}

/* ============================================
   RESPUESTAS POR ZONA / TRATAMIENTO
   ============================================ */
function generarRespuestaZona(zona) {
    const tratamientos = {
        "abdomen": "reducción de volumen, contorno y firmeza con HIFU 12D, cavitación y radiofrecuencia",
        "glúteos": "levantamiento, forma y firmeza con Pro Sculpt (20.000 contracciones en 30 min)",
        "papada": "reducción de grasa submentoniana y firmeza con lipolítico + radiofrecuencia",
        "rostro": "firmeza, luminosidad y rejuvenecimiento con RF, Pink Glow o Face Elite",
        "contorno ocular": "suavizado de arrugas, firmeza y mejora de textura con Pink Glow",
        "brazos": "reducción de flacidez y afinamiento del contorno con RF + HIFU",
        "piernas": "reducción de celulitis, firmeza y drenaje con RF + cavitación",
        "muslos": "reducción de contorno, celulitis y firmeza con cavitación + RF"
    };

    const texto = tratamientos[zona] || "mejoras estéticas según tu objetivo";

    return `En ${zona} trabajamos ${texto} ✨.  
Si quieres avanzar, puedes agendar tu evaluación gratuita (40 min) aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0MnrxU8d7W64x5t2S6L4h9 🤍  

¿Te dejo tu hora para que revisemos tu caso?`;
}

