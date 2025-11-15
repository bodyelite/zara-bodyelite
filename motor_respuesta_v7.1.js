/* ============================================================
   MOTOR RESPUESTA V7.1 – Cálido, clínico, comercial y estable
   ============================================================ */

export function procesarMensaje(contexto, texto, platform) {
    if (!texto || typeof texto !== "string") return fallback(contexto);

    const msg = texto.toLowerCase().trim();

    // inicializar contexto si no existe
    if (!contexto.estado) contexto.estado = {};
    if (!contexto.estado.agendaIntentos) contexto.estado.agendaIntentos = 0;
    if (!contexto.estado.llamadaOfrecida) contexto.estado.llamadaOfrecida = false;
    if (!contexto.estado.numeroSolicitado) contexto.estado.numeroSolicitado = false;

    /* ============================================================
       1. SALUDO
       ============================================================ */
    const saludos = ["hola", "holi", "hello", "buenas", "consulta", "info"];
    if (saludos.some(s => msg.includes(s))) {
        return saludoInicial();
    }

    /* ============================================================
       2. INTENCIÓN DE AGENDA / RESPUESTA "SÍ"
       ============================================================ */
    const afirmativos = ["si", "sí", "dale", "quiero", "ok", "listo", "perfecto", "hagamos", "hágamos"];
    if (afirmativos.some(a => msg === a || msg.includes(a))) {

        // SI YA ESTAMOS EN LA ETAPA DE PEDIR NÚMERO (INSTAGRAM)
        if (contexto.estado.numeroSolicitado && platform === "instagram") {
            // usuario acaba de enviar número
            if (validarNumero(texto)) {
                const numero = normalizarNumero(texto);
                return confirmacionLlamadaIG(contexto, numero);
            }
        }

        // SI YA SE DIJO "SÍ" AL ENLACE
        return manejarAfirmacion(contexto, platform);
    }

    /* ============================================================
       3. ZONAS COLOQUIALES
       ============================================================ */
    const zonas = {
        "guata": "abdomen",
        "guatita": "abdomen",
        "panza": "abdomen",
        "abdomen": "abdomen",
        "rollito": "abdomen",
        "rollitos": "abdomen",
        "poto": "glúteos",
        "potito": "glúteos",
        "trasero": "glúteos",
        "cola": "glúteos",
        "gluteo": "glúteos",
        "glúteo": "glúteos",
        "gluteos": "glúteos",
        "glúteos": "glúteos",
        "muslos": "muslos",
        "piernas": "piernas",
        "papada": "papada",
        "barbilla": "papada",
        "mentón": "papada",
        "patas de gallo": "contorno ocular",
        "arrugas": "rostro",
        "cara": "rostro"
    };

    for (const [coloq, zonaReal] of Object.entries(zonas)) {
        if (msg.includes(coloq)) {
            return respuestaZona(contexto, zonaReal);
        }
    }

    /* ============================================================
       4. PRECIO
       ============================================================ */
    if (msg.includes("precio") || msg.includes("vale") || msg.includes("valor")) {
        return respuestaPrecio(contexto);
    }

    /* ============================================================
       5. RESULTADOS
       ============================================================ */
    if (msg.includes("resultado") || msg.includes("cambios") || msg.includes("cuando") || msg.includes("cuándo")) {
        return respuestaResultados(contexto);
    }

    /* ============================================================
       6. DOLOR
       ============================================================ */
    if (msg.includes("duele") || msg.includes("dolor")) {
        return respuestaDolor(contexto);
    }

    /* ============================================================
       7. SI EL USUARIO ENVÍA UN NÚMERO DESPUÉS DE SOLICITARLO EN IG
       ============================================================ */
    if (contexto.estado.numeroSolicitado && platform === "instagram") {
        if (validarNumero(texto)) {
            const numero = normalizarNumero(texto);
            return confirmacionLlamadaIG(contexto, numero);
        }
    }

    /* ============================================================
       8. FALLBACK
       ============================================================ */
    return fallback(contexto);
}

/* ============================================================
   FUNCIONES DE RESPUESTA
   ============================================================ */

function saludoInicial() {
    return `Hola! Soy Zara ✨🤍 del equipo Body Elite.
Estoy aquí para ayudarte con total honestidad clínica y sin presiones.
Cuéntame, ¿qué zona te gustaría mejorar o qué cambio te gustaría lograr?`;
}

function respuestaZona(contexto, zona) {
    contexto.estado.agendaIntentos++;

    const textos = {
        "abdomen": `En abdomen trabajamos 3 frentes ✨:
• Reducción de grasa resistente con **HIFU 12D**  
• Modelado del contorno con **cavitación**  
• Firmeza de piel con **radiofrecuencia**

Esta combinación funciona súper bien cuando hay rollitos o acumulación en la "guatita" porque mejora grasa, agua retenida y firmeza al mismo tiempo 🤍.`,
        "glúteos": `En glúteos logramos **levantamiento, forma y firmeza** usando Pro Sculpt 🍑✨.
Ideal si buscas proyección o efecto “push up” sin cirugías.`,
        "muslos": `En muslos trabajamos **celulitis, contorno y firmeza** con HIFU 12D, cavitación y RF.
Según tu tipo de tejido ajustamos el plan para mejorar textura y compactar piel ✨.`,
        "piernas": `En piernas podemos trabajar retención de líquido, celulitis y definición de contorno usando cavitación y RF ✨.`,
        "papada": `En papada combinamos **lipolítico facial + radiofrecuencia + HIFU focalizado** para reducir grasa y tensar la piel del perfil 🤍.`,
        "contorno ocular": `Para contorno de ojos usamos Pink Glow + RF suave ✨.
Ayuda a mejorar líneas finas, mirada cansada y textura de piel.`,
        "rostro": `En rostro podemos trabajar firmeza, luminosidad y líneas finas con RF, HIFU o Pink Glow según tu objetivo ✨.`
    };

    const explicacion = textos[zona] || "Podemos revisar tu caso en evaluación y ver el plan más adecuado 🤍.";

    return explicacion + "\n\n" + decidirAgenda(contexto);
}

function respuestaPrecio(contexto) {
    contexto.estado.agendaIntentos++;

    return `El valor exacto depende de tu punto de partida y del objetivo que quieras lograr 🤍.
En tu evaluación gratuita (40 min) una especialista revisa tu tejido y te explica cuántas sesiones necesitas realmente.

${decidirAgenda(contexto)}`;
}

function respuestaResultados(contexto) {
    contexto.estado.agendaIntentos++;

    return `Los primeros cambios suelen verse entre la 2° y 4° sesión, dependiendo de tu metabolismo, retención de líquido y nivel de firmeza 🤍.

En la evaluación gratuita (40 min) te mostramos qué resultados puedes esperar según tu caso.

${decidirAgenda(contexto)}`;
}

function respuestaDolor(contexto) {
    contexto.estado.agendaIntentos++;

    return `Todas nuestras tecnologías son no invasivas 🤍.
Puedes sentir calor profundo o vibración intensa, pero nada doloroso.

¿Quieres que veamos qué plan es el mejor para ti?

${decidirAgenda(contexto)}`;
}

/* ============================================================
   AGENDA INTELIGENTE (4 intentos)
   ============================================================ */

function decidirAgenda(contexto) {
    const intentos = contexto.estado.agendaIntentos;

    // INTENTO 1 → preguntar
    if (intentos === 1) {
        return "¿Quieres que te deje el link para reservar tu evaluación gratuita?";
    }

    // INTENTO 2 y 3 → enviar botón embebido
    if (intentos === 2 || intentos === 3) {
        return botonAgenda();
    }

    // INTENTO 4 → ofrecer llamada
    if (intentos >= 4 && !contexto.estado.llamadaOfrecida) {
        contexto.estado.llamadaOfrecida = true;
        return botonAgenda() + 
        `\n\nSi quieres, también puedo pedir que una de nuestras profesionales te llame para orientarte mejor 🙌.
¿Quieres que te contacten?`;
    }

    // Si ya se ofreció llamada, seguir con botón
    return botonAgenda();
}

function botonAgenda() {
    return `Aquí tienes tu acceso directo a la agenda 🤍:
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
}

/* ============================================================
   LLAMADAS – HORARIOS Y CANALES
   ============================================================ */

function manejarAfirmacion(contexto, platform) {
    // Si estamos en IG y falta número
    if (platform === "instagram" && contexto.estado.llamadaOfrecida) {
        contexto.estado.numeroSolicitado = true;
        return `Genial! 🤍 ¿Me dejas tu numerito para coordinar que te llamen?`;
    }

    // Si estamos en WhatsApp con llamada ofrecida
    if (platform === "whatsapp" && contexto.estado.llamadaOfrecida) {
        return procesarLlamadaWSP();
    }

    // Si no es llamada → mandar botón
    return botonAgenda();
}

function procesarLlamadaWSP() {
    if (dentroHorario()) {
        return `Perfecto 🤍. Una profesional te llamará en unos minutos desde **+56 9 8330 0262**.`;
    }

    return `Súper 🤍. Nuestro horario de llamadas es:
• Lun–Vie 09:30–19:00  
• Sáb 09:30–14:00  

Puedo dejar agendado que te llamen en el próximo horario disponible 🙌.

¿Quieres que deje la llamada programada?`;
}

/* ============================================================
   LLAMADA IG (requiere número del usuario)
   ============================================================ */

function confirmacionLlamadaIG(contexto, numero) {
    contexto.estado.numeroSolicitado = false;

    if (dentroHorario()) {
        return `Perfecto 🤍. Haré que te llamen desde **+56 9 8330 0262** en unos minutos.`;
    }

    return `Súper! 🤍 Nuestro horario de llamadas es:
• Lun–Vie 09:30–19:00  
• Sáb 09:30–14:00  

Dejaré la llamada programada para el próximo horario disponible 🙌.`;
}

/* ============================================================
   HORARIOS
   ============================================================ */

function dentroHorario() {
    const ahora = new Date();
    const dia = ahora.getDay(); // 0 domingo, 6 sábado
    const hora = ahora.getHours();
    const minuto = ahora.getMinutes();

    // domingo
    if (dia === 0) return false;

    // sábado después de 14:00
    if (dia === 6 && (hora > 14 || (hora === 14 && minuto > 0))) return false;

    // lunes a viernes fuera de 09:30–19:00
    const mins = hora * 60 + minuto;
    const inicio = 9 * 60 + 30;
    const fin = 19 * 60;
    if (mins < inicio || mins > fin) return false;

    return true;
}

/* ============================================================
   UTILIDADES
   ============================================================ */

function validarNumero(num) {
    return /\+?56 ?9 ?\d{8}/.test(num);
}

function normalizarNumero(num) {
    return num.replace(/[^0-9\+]/g, "");
}

function fallback(contexto) {
    contexto.estado.agendaIntentos++;

    return `Disculpa, creo que no logré interpretar bien tu mensaje 🙈.

En tu evaluación gratuita (40 min) una especialista puede guiarte paso a paso y ayudarte a tomar la mejor decisión para ti 🤍.

${decidirAgenda(contexto)}`;
}

