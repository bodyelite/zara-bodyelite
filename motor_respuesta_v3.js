import memoria from "./memoria.js";
import { sendInteractive } from "./sendInteractive.js";

/* ============================================================
   MOTOR PREMIUM – BODY ELITE (versión final JC)
   ============================================================ */

export async function procesarMensaje(usuario, texto) {
  if (!texto || typeof texto !== "string") return fallback(usuario);

  const msg = texto.toLowerCase().trim();
  let contexto = memoria.obtenerContexto(usuario);

  if (!contexto) {
    contexto = { estado: {} };
    memoria.guardarContexto(usuario, contexto);
  }

  if (!contexto.estado) contexto.estado = {};
  if (!contexto.estado.agendaIntentos) contexto.estado.agendaIntentos = 0;
  if (!contexto.estado.llamadaOfrecida) contexto.estado.llamadaOfrecida = false;

  memoria.guardarMensaje(usuario, msg);

  /* ============================================================
     SALUDO
     ============================================================ */
  const saludos = ["hola", "holi", "hello", "consulta", "info", "buenas", "zara"];
  if (saludos.some(s => msg.includes(s))) {
    return saludoInicial();
  }

  /* ============================================================
     AFIRMACIONES
     ============================================================ */
  const afirmativos = ["si", "sí", "dale", "quiero", "ok", "listo", "perfecto"];
  if (afirmativos.some(a => msg === a || msg.includes(a))) {
    return manejarAfirmacion(usuario, contexto);
  }

  /* ============================================================
     ZONAS
     ============================================================ */
  const zonas = {
    "guata": "abdomen",
    "panza": "abdomen",
    "abdomen": "abdomen",
    "rollito": "abdomen",
    "poto": "glúteos",
    "cola": "glúteos",
    "gluteo": "glúteos",
    "glúteos": "glúteos",
    "muslos": "muslos",
    "piernas": "piernas",
    "papada": "papada",
    "menton": "papada",
    "arrugas": "rostro",
    "cara": "rostro"
  };

  for (const [coloq, zonaReal] of Object.entries(zonas)) {
    if (msg.includes(coloq)) {
      return await respuestaZona(usuario, contexto, zonaReal);
    }
  }

  /* ============================================================
     DEPILACIÓN
     ============================================================ */
  if (msg.includes("depil") || msg.includes("rebaje") || msg.includes("axila") || msg.includes("pelos")) {
    return await respuestaDepilacion(usuario, contexto);
  }

  /* ============================================================
     PRECIO
     ============================================================ */
  if (msg.includes("precio") || msg.includes("valor") || msg.includes("vale")) {
    return await respuestaPrecio(usuario, contexto);
  }

  /* ============================================================
     RESULTADOS
     ============================================================ */
  if (msg.includes("cuando") || msg.includes("result") || msg.includes("cambios")) {
    return await respuestaResultados(usuario, contexto);
  }

  /* ============================================================
     DOLOR
     ============================================================ */
  if (msg.includes("duele") || msg.includes("dolor")) {
    return await respuestaDolor(usuario, contexto);
  }

  /* ============================================================
     UBICACIÓN
     ============================================================ */
  if (msg.includes("donde") || msg.includes("ubicacion") || msg.includes("direcc")) {
    return "📍 Estamos en Av. Las Perdices Nº 2990, Local 23, Peñalolén.\nLun–Vie 9:30–20:00, Sáb 9:30–13:00.\n\n¿Deseas agendar tu diagnóstico gratuito?";
  }

  return await fallback(usuario, contexto);
}

/* ============================================================
   SALUDO FINAL JC
   ============================================================ */
function saludoInicial() {
  return (
    "Hola 🤍 Soy Zara de Body Elite. " +
    "Estoy aquí para ayudarte a sacar tu mejor versión. " +
    "¿Qué zona te gustaría mejorar?"
  );
}

/* ============================================================
   RESPUESTAS POR ZONA
   ============================================================ */

async function respuestaZona(usuario, contexto, zona) {
  contexto.estado.agendaIntentos++;

  const textos = {
    abdomen: `En abdomen trabajamos reducción de grasa, retención de líquido y firmeza de la piel. Usamos **HIFU 12D**, **cavitación** y **radiofrecuencia**, que actúan sobre grasa profunda y textura de piel para lograr una zona más plana y compacta ✨.\n\nEl plan que mejor funciona en esta zona suele ser **Lipo Express**, desde **$432.000**.`,
    "glúteos": `En glúteos buscamos levantar, proyectar y compactar el tejido. Usamos **EMS Pro Sculpt** y radiofrecuencia profunda para mejorar tono muscular, firmeza y forma 🍑.\n\nEl plan que más resultados entrega es **Push Up Glúteos**, desde **$376.000**.`,
    muslos: `En muslos trabajamos celulitis, firmeza y contorno. Combinamos **HIFU 12D**, cavitación y radiofrecuencia para compactar piel y mejorar textura ✨.\n\nSegún el tipo de tejido, suele recomendarse **Body Tensor** desde **$232.000**.`,
    piernas: `En piernas trabajamos retención de líquido, celulitis y contorno. Cavitación + radiofrecuencia ayudan a afinar y definir.\n\nDependiendo del objetivo, se combina con HIFU 12D.`,
    papada: `En papada reducimos grasa submentoniana y tensamos piel con **lipolítico facial**, **radiofrecuencia** y **HIFU focalizado** ✨.\n\nLos resultados suelen iniciar desde la 2°–3° sesión.`,
    rostro: `En rostro trabajamos firmeza, luminosidad y contorno. Según tu objetivo, se usa **HIFU 12D**, radiofrecuencia o **Pink Glow** (sin LED).`
  };

  const texto = textos[zona] || "Puedo ayudarte a evaluar esa zona con tecnologías no invasivas.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}

/* ============================================================
   DEPILACIÓN
   ============================================================ */
async function respuestaDepilacion(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto =
    "Trabajamos depilación con láser diodo clínico **DL900**, que permite tratar vello claro y oscuro sin dolor significativo 🤍.\n\n" +
    "Las zonas pequeñas comienzan **desde $25.600 por sesión**, y los planes se arman en 6 sesiones.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}

/* ============================================================
   PRECIO GENÉRICO
   ============================================================ */
async function respuestaPrecio(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto =
    "Los valores exactos dependen de tu punto de partida y del plan que realmente necesitas 🤍.\n" +
    "Tu diagnóstico gratuito nos permite indicarte cuántas sesiones necesitas y el precio final más conveniente.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}

/* ============================================================
   RESULTADOS
   ============================================================ */
async function respuestaResultados(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto =
    "Los primeros cambios suelen verse entre la 2° y 4° sesión según metabolismo, tipo de tejido y nivel de firmeza inicial ✨.\n" +
    "En el diagnóstico gratuito podemos proyectar tus resultados con mayor precisión.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}

/* ============================================================
   DOLOR
   ============================================================ */
async function respuestaDolor(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto =
    "Todas nuestras tecnologías son no invasivas 🤍. Puedes sentir calor profundo o vibración intensa, pero nada doloroso.\n" +
    "Se trabaja sin reposo y sin tiempos de recuperación.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}

/* ============================================================
   AGENDA INTELIGENTE (Regla B)
   ============================================================ */

async function construirRespuestaConAgenda(usuario, contexto, texto) {
  const intentos = contexto.estado.agendaIntentos;

  // INTENTO 1 → Pregunta
  if (intentos === 1) {
    return (
      texto +
      "\n\n¿Quieres que te deje el acceso para tu diagnóstico gratuito?"
    );
  }

  // INTENTO 2 y 3 → Botón
  if (intentos === 2 || intentos === 3) {
    await enviarBoton(usuario);
    return texto;
  }

  // INTENTO 4 → Botón + llamada
  if (intentos >= 4 && !contexto.estado.llamadaOfrecida) {
    contexto.estado.llamadaOfrecida = true;
    await enviarBoton(usuario);
    return (
      texto +
      "\n\nSi prefieres, también puedo coordinar que una profesional te llame 🙌.\n¿Deseas la llamada?"
    );
  }

  // Repeticiones posteriores
  await enviarBoton(usuario);
  return texto;
}

/* ============================================================
   ENVÍO DE BOTÓN
   ============================================================ */

async function enviarBoton(usuario) {
  await sendInteractive(
    usuario,
    {
      body: "Reserva tu diagnóstico gratuito 🤍",
      button: "Agendar evaluación"
    },
    "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
    "whatsapp"
  );
}

/* ============================================================
   LLAMADA Y HORARIO (Chile UTC-3)
   ============================================================ */

function dentroHorario() {
  const ahora = new Date();
  const chile = new Date(ahora.getTime() - 3 * 3600 * 1000);

  const d = chile.getDay();
  const h = chile.getHours();
  const m = chile.getMinutes();

  if (d === 0) return false;
  if (d === 6 && (h > 14 || (h === 14 && m > 0))) return false;

  const total = h * 60 + m;
  return total >= 570 && total <= 1140; // 09:30–19:00
}

/* ============================================================
   FALLBACK PREMIUM
   ============================================================ */

async function fallback(usuario, contexto = { estado: {} }) {
  contexto.estado.agendaIntentos++;
  const texto =
    "No estoy segura de haber entendido bien 🤍, pero puedo ayudarte a orientarte según tu objetivo.\n" +
    "En tu diagnóstico gratuito te mostramos qué tecnología te conviene y cuántas sesiones necesitas.";

  return await construirRespuestaConAgenda(usuario, contexto, texto);
}
