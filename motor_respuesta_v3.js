import memoria from "./memoria.js";
import { sendInteractive } from "./sendInteractive.js";

/* ============================================================
   MOTOR ZARA JC PREMIUM – VERSIÓN FINAL
   ============================================================ */

export async function procesarMensaje(usuario, texto) {
  if (!texto || typeof texto !== "string") return fallback(usuario);

  const msg = texto.toLowerCase().trim();

  // Obtener contexto actual
  let contexto = memoria.obtenerContexto(usuario);
  if (!contexto) {
    contexto = { estado: {}, zonasConsultadas: [] };
    memoria.guardarContexto(usuario, contexto);
  }

  // Inicializar estados
  if (!contexto.estado) contexto.estado = {};
  if (!contexto.estado.agendaIntentos) contexto.estado.agendaIntentos = 0;
  if (!contexto.estado.llamadaOfrecida) contexto.estado.llamadaOfrecida = false;
  if (!contexto.zonasConsultadas) contexto.zonasConsultadas = [];

  memoria.guardarMensaje(usuario, msg);

  /* ============================================================
     SALUDO
     ============================================================ */
  const saludos = ["hola", "holi", "hello", "consulta", "info", "buenas", "zara"];
  if (saludos.some(s => msg.includes(s))) {
    return saludoInicial();
  }

  /* ============================================================
     AFIRMACIONES (“sí”, “quiero”, “ok”, "listo")
     ============================================================ */
  const afirmativos = ["si", "sí", "quiero", "dale", "ok", "listo", "perfecto"];
  if (afirmativos.some(a => msg === a || msg.includes(a))) {
    return manejarAfirmacion(usuario, contexto);
  }

  /* ============================================================
     DETECTOR DE "CARO"
     ============================================================ */
  const caroTriggers = ["caro", "carito", "carito?", "muy caro", "carísimo", "carisimo", "porque tan caro", "tan caro"];
  if (caroTriggers.some(w => msg.includes(w))) {
    return await respuestaCaro(usuario, contexto);
  }

  /* ============================================================
     ZONAS – DETECCIÓN SEMÁNTICA
     ============================================================ */
  const zonas = {
    "guata": "abdomen",
    "panza": "abdomen",
    "abdomen": "abdomen",
    "rollito": "abdomen",
    "poto": "gluteos",
    "cola": "gluteos",
    "gluteo": "gluteos",
    "glúteo": "gluteos",
    "gluteos": "gluteos",
    "glúteos": "gluteos",
    "muslos": "muslos",
    "piernas": "piernas",
    "papada": "papada",
    "menton": "papada",
    "mentón": "papada",
    "arrugas": "rostro",
    "cara": "rostro",
    "facial": "rostro"
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

  /* ============================================================
     FALLBACK
     ============================================================ */
  return await fallback(usuario, contexto);
}

/* ============================================================
   SALUDO OFICIAL ZARA
   ============================================================ */
function saludoInicial() {
  return (
    "Hola 🤍 Soy Zara de Body Elite. " +
    "Estoy aquí para ayudarte a sacar tu mejor versión. " +
    "¿Qué zona te gustaría mejorar?"
  );
}

/* ============================================================
   RESPUESTAS POR ZONA (con plan SIEMPRE)
   ============================================================ */

async function respuestaZona(usuario, contexto, zona) {
  contexto.estado.agendaIntentos++;
  if (!contexto.zonasConsultadas.includes(zona)) contexto.zonasConsultadas.push(zona);

  const textos = {
    abdomen: `
Para abdomen trabajamos grasa profunda, retención de líquido y firmeza de la piel.  
Combinamos **HIFU 12D**, cavitación y radiofrecuencia para compactar tejido y definir el contorno abdominal ✨.

El plan que mejores resultados entrega en esta zona es **Lipo Express**, desde **$432.000**.
`,

    gluteos: `
En glúteos trabajamos levantamiento, firmeza y forma con **EMS Pro Sculpt** y radiofrecuencia profunda 🍑.  
Actuamos sobre músculo y tejido para mejorar proyección y compactación.

El plan indicado es **Push Up Glúteos**, desde **$376.000**.
`,

    muslos: `
En muslos tratamos celulitis, compactación y contorno.  
Usamos **HIFU 12D**, cavitación y radiofrecuencia para mejorar textura y firmeza ✨.

El plan más usado es **Body Tensor**, desde **$232.000**.
`,

    piernas: `
En piernas trabajamos retención de líquido, celulitis y definición con cavitación y radiofrecuencia.  
Según el tejido, se puede integrar HIFU 12D para compactación.
`,

    papada: `
En papada trabajamos reducción de grasa submentoniana y tensado con **lipolítico facial**, radiofrecuencia y **HIFU focalizado** ✨.

El plan recomendado es **Face Papada**, desde **$X** (según catálogo).
`,

    rostro: `
En rostro trabajamos firmeza, líneas finas y luminosidad usando **HIFU 12D**, radiofrecuencia o **Pink Glow** (sin LED).  
Según tu objetivo definimos si necesitas suavizar arrugas, tensar o iluminar.

Los planes más usados son **Face Smart**, **Face Antiage** y **Face Elite**.
`
  };

  const texto = textos[zona] || "Puedo ayudarte a evaluar esa zona con tecnologías no invasivas.";

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   DEPILACIÓN DL900
   ============================================================ */

async function respuestaDepilacion(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto = `
Trabajamos depilación con láser clínico **DL900**, apto para vello claro y oscuro sin dolor significativo 🤍.  
Las zonas pequeñas comienzan **desde $25.600 por sesión**, y los planes se arman en 6 sesiones.

En tu evaluación revisamos si necesitas un plan más acotado o uno más completo.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   PRECIO – RESPUESTA GENERAL
   ============================================================ */

async function respuestaPrecio(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto = `
Los valores dependen del plan y de lo que realmente necesita tu tejido 🤍.  
En tu diagnóstico gratuito definimos cuántas sesiones necesitas y el valor final más conveniente.

Si buscas algo más acotado, en tu evaluación revisamos opciones que se adapten a tu objetivo 🤍.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   RESULTADOS
   ============================================================ */

async function respuestaResultados(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto = `
Los primeros cambios suelen verse entre la 2° y 4° sesión ✨.  
Depende del metabolismo, la retención de líquido y el nivel de firmeza inicial.

En tu diagnóstico gratuito te mostramos la proyección real según tu tejido.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   DOLOR
   ============================================================ */

async function respuestaDolor(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto = `
Todas nuestras tecnologías son no invasivas 🤍.  
Puedes sentir calor profundo o vibración intensa, pero no dolor.

No requiere reposo ni tiempos de recuperación.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   PATRÓN GLOBAL “CARO”
   ============================================================ */

async function respuestaCaro(usuario, contexto) {
  contexto.estado.agendaIntentos++;

  const texto = `
Entiendo completamente tu duda 🤍 y te lo explico con transparencia.

El valor parte desde el plan recomendado porque trabajamos con tecnologías clínicas como **HIFU 12D**, cavitación, radiofrecuencia o **Pro Sculpt**, que actúan en profundidad real del tejido para lograr cambios visibles y mantenibles ✨.

Cada persona llega con un nivel distinto de grasa, firmeza, retención o tono muscular.  
Por eso el plan exacto y el valor final se ajustan en tu diagnóstico gratuito.

Si necesitas algo más acotado en precio, en tu evaluación revisamos opciones más económicas que se adapten a tu objetivo 🤍.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}

/* ============================================================
   AGENDA INTELIGENTE (Regla JC)
   ============================================================ */

async function construirRespuestaConAgenda(usuario, contexto, texto) {
  const intentos = contexto.estado.agendaIntentos;

  // Intento 1 → Pregunta
  if (intentos === 1) {
    return texto + "\n\n¿Quieres que te deje el acceso para tu diagnóstico gratuito?";
  }

  // Intento 2 → Botón
  if (intentos === 2) {
    await enviarBoton(usuario);
    return texto;
  }

  // Intento 3 → Botón
  if (intentos === 3) {
    await enviarBoton(usuario);
    return texto;
  }

  // Intento 4 → Botón + Llamada
  if (intentos >= 4 && !contexto.estado.llamadaOfrecida) {
    contexto.estado.llamadaOfrecida = true;
    await enviarBoton(usuario);
    return (
      texto +
      "\n\nSi prefieres, puedo coordinar que una profesional te llame 🙌.\n¿Deseas la llamada?"
    );
  }

  // Repeticiones
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
   HORARIO CHILE UTC-3
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
  return total >= 570 && total <= 1140;
}

/* ============================================================
   FALLBACK PREMIUM
   ============================================================ */

async function fallback(usuario, contexto = { estado: {} }) {
  contexto.estado.agendaIntentos++;

  const texto = `
Puedo ayudarte a orientarte según tu objetivo 🤍.  
Cuéntame qué zona te gustaría mejorar o qué cambio te gustaría conseguir.
  `;

  return await construirRespuestaConAgenda(usuario, contexto, texto.trim());
}
