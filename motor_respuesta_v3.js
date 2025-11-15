import memoria from "./memoria.js";

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
  if (!contexto.estado.numeroSolicitado) contexto.estado.numeroSolicitado = false;

  memoria.guardarMensaje(usuario, msg);

  /* SALUDO */
  const saludos = ["hola", "holi", "hello", "consulta", "info", "buenas", "zara"];
  if (saludos.some(s => msg.includes(s))) {
    return saludoInicial(usuario);
  }

  /* AFIRMACIONES */
  const afirmativos = ["si", "sí", "dale", "quiero", "ok", "listo", "perfecto"];
  if (afirmativos.some(a => msg === a || msg.includes(a))) {
    return manejarAfirmacion(usuario, contexto);
  }

  /* ZONAS */
  const zonas = {
    "guata": "abdomen",
    "guatita": "abdomen",
    "panza": "abdomen",
    "abdomen": "abdomen",
    "rollito": "abdomen",
    "rollitos": "abdomen",
    "poto": "glúteos",
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
      memoria.guardarContexto(usuario, contexto);
      return respuestaZona(usuario, contexto, zonaReal);
    }
  }

  /* PRECIO */
  if (msg.includes("precio") || msg.includes("valor") || msg.includes("vale")) {
    return respuestaPrecio(usuario, contexto);
  }

  /* RESULTADOS */
  if (msg.includes("resultado") || msg.includes("cambios") || msg.includes("cuando")) {
    return respuestaResultados(usuario, contexto);
  }

  /* DOLOR */
  if (msg.includes("duele") || msg.includes("dolor")) {
    return respuestaDolor(usuario, contexto);
  }

  /* DEPILACIÓN */
  if (msg.includes("depil") || msg.includes("pelos") || msg.includes("rebaje") || msg.includes("axila")) {
    memoria.guardarContexto(usuario, contexto);
    return respuestaDepilacion(usuario, contexto);
  }

  /* UBICACIÓN */
  if (msg.includes("donde") || msg.includes("ubicacion") || msg.includes("direcc")) {
    return "📍 Estamos en Av. Las Perdices Nº 2990, Local 23, Peñalolén.\nHorarios Lun–Vie 9:30–20:00, Sáb 9:30–13:00.\n¿Quieres que agendemos tu diagnóstico gratuito?";
  }

  /* AGENDA */
  if (msg.includes("agendar") || msg.includes("evaluacion") || msg.includes("reserva")) {
    return botonAgenda();
  }

  /* FALLBACK */
  return fallback(usuario, contexto);
}

/* ====================== RESPUESTAS BASE ===================== */

function saludoInicial() {
  return `Hola! Soy Zara ✨🤍 del equipo Body Elite.
Estoy aquí para ayudarte con total honestidad clínica.
Cuéntame, ¿qué zona te gustaría mejorar?`;
}

function respuestaZona(usuario, contexto, zona) {
  contexto.estado.agendaIntentos++;

  const textos = {
    "abdomen": `En abdomen trabajamos 3 frentes ✨:
• Reducción de grasa resistente con **HIFU 12D**
• Modelado con **cavitación**
• Firmeza con **radiofrecuencia**

Funciona excelente para rollitos o “guatita”.`,
    "glúteos": `En glúteos logramos **levantamiento, forma y firmeza** con Pro Sculpt 🍑.`,
    "muslos": `En muslos trabajamos celulitis, contorno y firmeza con HIFU 12D + cavitación + RF.`,
    "piernas": `En piernas mejoramos retención de líquido, celulitis y definición.`,
    "papada": `En papada usamos **lipolítico facial + radiofrecuencia + HIFU focalizado** para reducir y tensar.`,
    "contorno ocular": `Para contorno de ojos usamos Pink Glow + RF suave para suavizar líneas finas.`,
    "rostro": `En rostro trabajamos firmeza y luminosidad con HIFU 12D, radiofrecuencia y Pink Glow (sin LED).`
  };

  return textos[zona] + "\n\n" + decidirAgenda(contexto);
}

function respuestaPrecio(usuario, contexto) {
  contexto.estado.agendaIntentos++;
  return `El valor exacto depende de tu punto de partida 🤍.
En tu evaluación gratuita una especialista te indica cuántas sesiones necesitas realmente.\n\n${decidirAgenda(contexto)}`;
}

function respuestaResultados(usuario, contexto) {
  contexto.estado.agendaIntentos++;
  return `Los primeros cambios suelen verse entre la 2° y 4° sesión, según metabolismo y firmeza inicial 🤍.\n\n${decidirAgenda(contexto)}`;
}

function respuestaDolor(usuario, contexto) {
  contexto.estado.agendaIntentos++;
  return `Todas nuestras tecnologías son no invasivas 🤍.
Puedes sentir calor profundo o vibración intensa, pero nada doloroso.\n\n${decidirAgenda(contexto)}`;
}

function respuestaDepilacion(usuario, contexto) {
  contexto.estado.agendaIntentos++;
  return `Nuestra depilación láser es diodo clínico modelo **DL900**, apto para vello claro y oscuro.
Planes oficiales desde 6 sesiones según zona 🤍.\n\n${decidirAgenda(contexto)}`;
}

/* ====================== AGENDA INTELIGENTE ===================== */

function decidirAgenda(contexto) {
  contexto.estado.agendaIntentos++;

  if (contexto.estado.agendaIntentos === 1) {
    return "¿Quieres que te deje el link para tu evaluación gratuita?";
  }

  if (contexto.estado.agendaIntentos === 2 || contexto.estado.agendaIntentos === 3) {
    return botonAgenda();
  }

  if (contexto.estado.agendaIntentos >= 4 && !contexto.estado.llamadaOfrecida) {
    contexto.estado.llamadaOfrecida = true;
    return botonAgenda() + `\n\nSi quieres, también puedo pedir que una profesional te llame 🙌.\n¿Quieres que coordine la llamada?`;
  }

  return botonAgenda();
}

function botonAgenda() {
  return `Agenda aquí tu diagnóstico gratuito 🤍:
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
}

/* ====================== LLAMADAS ===================== */

function manejarAfirmacion(usuario, contexto) {
  if (contexto.estado.llamadaOfrecida) {
    return procesarLlamada();
  }
  return botonAgenda();
}

function procesarLlamada() {
  if (dentroHorario()) {
    return `Perfecto 🤍. Una profesional te llamará en unos minutos desde **+56 9 8330 0262**.`;
  }

  return `Nuestro horario de llamadas es:
• Lun–Vie 09:30–19:00  
• Sáb 09:30–14:00  

Puedo dejar la llamada programada para el próximo horario 🙌.`;
}

function dentroHorario() {
  const ahora = new Date();
  const d = ahora.getDay();
  const h = ahora.getHours();
  const m = ahora.getMinutes();

  if (d === 0) return false;
  if (d === 6 && (h > 14 || (h === 14 && m > 0))) return false;

  const mins = h * 60 + m;
  const inicio = 9 * 60 + 30;
  const fin = 19 * 60;

  return mins >= inicio && mins <= fin;
}

/* ====================== FALLBACK ===================== */

function fallback(usuario, contexto = { estado: {} }) {
  contexto.estado.agendaIntentos++;
  return `Disculpa, no logré interpretar bien tu mensaje 🙈.
En tu evaluación gratuita te guiamos paso a paso con honestidad clínica 🤍.\n\n${decidirAgenda(contexto)}`;
}
