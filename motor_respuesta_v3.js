import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria_usuarios.json";
const RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUM_INTERNO = "56937648536";

// ----------------------------------------------------
// MEMORIA PERSISTENTE
// ----------------------------------------------------
function loadMem() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {} };
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function saveMem(data) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const mem = loadMem();
  if (!mem.usuarios[id]) {
    mem.usuarios[id] = {
      planBase: null,
      ultimoPlan: null,
      ultimaZona: null,
      modoCampania: false,
      intentosAgenda: 0,
      esperandoNumero: false,
      ultimoSaludo: false,
      turnoConversacion: 0,
      timestampUltimoMensaje: Date.now()
    };
    saveMem(mem);
  }
  return mem.usuarios[id];
}

function setUser(id, data) {
  const mem = loadMem();
  mem.usuarios[id] = {
    ...mem.usuarios[id],
    ...data,
    timestampUltimoMensaje: Date.now()
  };
  saveMem(mem);
}

// ----------------------------------------------------
// ZONAS → PLANES
// ----------------------------------------------------
const ZONAS = {
  abdomen: "Lipo Express",
  cintura: "Lipo Express",
  espalda: "Lipo Express",
  vientre: "Lipo Express",
  gluteos: "Push Up",
  "glúteos": "Push Up",
  gluteo: "Push Up",
  "glúteo": "Push Up",
  poto: "Push Up",
  trasero: "Push Up",
  rostro: "Face Elite",
  cara: "Face Elite",
  arrugas: "Face Elite",
  manchas: "Face Elite",
  papada: "Face Elite",
  ovalo: "Face Elite",
  flacidez: "Body Tensor",
  brazos: "Body Tensor",
  piernas: "Body Tensor",
  tonificar: "Body Fitness",
  marcar: "Body Fitness",
  músculo: "Body Fitness",
  musculo: "Body Fitness",
  depilacion: "Depilación DL900",
  "depilación": "Depilación DL900",
  laser: "Depilación DL900",
  "láser": "Depilación DL900"
};

function detectarZona(msg) {
  const t = msg.toLowerCase();
  for (const z in ZONAS) {
    if (t.includes(z)) return { zona: z, plan: ZONAS[z] };
  }
  return null;
}

// ----------------------------------------------------
// DETECCIÓN DE CAMPAÑA (ESTRICTO)
// ----------------------------------------------------
function detectarPlanCampania(msg) {
  const t = msg.toLowerCase();
  if (t.includes("push up")) return "Push Up";
  if (t.includes("lipo express")) return "Lipo Express";
  if (t.includes("lipo body elite")) return "Lipo Body Elite";
  if (t.includes("face elite")) return "Face Elite";
  if (t.includes("body tensor")) return "Body Tensor";
  if (t.includes("body fitness")) return "Body Fitness";
  if (t.includes("depilación") || t.includes("depila")) return "Depilación DL900";
  return null;
}

// ----------------------------------------------------
// INTENCIONES
// ----------------------------------------------------
function detectarIntencion(msg) {
  const t = msg.toLowerCase();

  if (t.includes("hola")) return "saludo";

  if (
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("en qué consiste") ||
    t.includes("en que consiste")
  ) return "explica";

  if (t.includes("precio") || t.includes("valor") || t.includes("vale"))
    return "precio";

  if (t.includes("sesiones") || t.includes("cuántas") || t.includes("cuantas"))
    return "sesiones";

  if (t.includes("duele") || t.includes("dolor"))
    return "dolor";

  if (t.includes("donde") || t.includes("ubic") || t.includes("direc"))
    return "ubicacion";

  if (t.includes("caro"))
    return "caro";

  if (
    t.includes("miedo") ||
    t.includes("gordita") ||
    t.includes("ansiosa") ||
    t.includes("tengo pena") ||
    t.includes("insegura")
  )
    return "emocional";

  return "general";
}
// ----------------------------------------------------
// INFO CLÍNICA COMPLETA (estilo IG + explicación técnica)
// ----------------------------------------------------
const INFO = {
  "Lipo Express": {
    como:
      "💙 Trabajamos abdomen/cintura/espalda con **HIFU 12D real**, cavitación y radiofrecuencia. Son tecnologías que reducen grasa localizada, compactan tejido y mejoran el contorno sin dolor intenso.",
    sesiones: "✨ Generalmente entre **8 y 10 sesiones**, según tu punto de partida.",
    dolor: "Es muy tolerable 💛, sensación de calor suave.",
    precio: "$432.000"
  },
  "Push Up": {
    como:
      "🍑 Le da **volumen y levantamiento real** al glúteo usando **Pro Sculpt (20.000 contracciones)** + HIFU 12D + radiofrecuencia. Mejora proyección, firmeza y redondez.",
    sesiones: "✨ Normalmente **8–10 sesiones**.",
    dolor: "Contracciones intensas pero tolerables 💛.",
    precio: "$376.000"
  },
  "Face Elite": {
    como:
      "💙 Combinamos **HIFU 12D**, Pink Glow y radiofrecuencia para firmeza, contorno facial, arrugas y definición del óvalo.",
    sesiones: "✨ Habitualmente **8–10 sesiones**.",
    dolor: "Sensación tibia con puntos sensibles 💆‍♀️.",
    precio: "$358.400"
  },
  "Body Tensor": {
    como:
      "💛 Radiofrecuencia profunda para **flacidez en abdomen, brazos, piernas y papada**. Reafirma y tensa tejido.",
    sesiones: "✨ Generalmente **6–8 sesiones**.",
    dolor: "Calorcito profundo, muy tolerable.",
    precio: "$232.000"
  },
  "Body Fitness": {
    como:
      "💪 Tonificación muscular con **EMS Sculptor** (contracciones supramáximas). Trabaja abdomen, glúteos, piernas.",
    sesiones: "✨ Entre **6–8 sesiones**.",
    dolor: "No duele, solo contracciones fuertes.",
    precio: "$360.000"
  },
  "Depilación DL900": {
    como:
      "⚡ Láser diodo **DL900**: rápido, seguro y eficaz para eliminar vello desde la raíz.",
    sesiones: "✨ 6 sesiones por zona.",
    dolor: "Pinchacito muy leve.",
    precio: "Planes desde $153.600"
  }
};

// ----------------------------------------------------
// RESPUESTAS BASE
// ----------------------------------------------------
const SALUDO =
  "💙 ¡Hola! Soy Zara de Body Elite. Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, brazos, piernas o depilación.";

const UBICACION =
  "📍 *Body Elite*: Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 *Horarios*: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00";

function CTA() {
  return `💙 Puedes agendar tu diagnóstico gratuito aquí: ${RESERVO}`;
}

// ----------------------------------------------------
// MOTOR PRINCIPAL — PROCESAMIENTO
// ----------------------------------------------------
export async function procesarMensaje(texto, remitente, plataforma) {
  const ahora = Date.now();
  const msg = texto.toLowerCase().trim();
  const u = getUser(remitente);

  // Actualizar turno
  setUser(remitente, { turnoConversacion: u.turnoConversacion + 1 });

  const minutos = (ahora - u.timestampUltimoMensaje) / 60000;

  // ----------------------------------------------------
  // RESET POR INACTIVIDAD + "hola"
  // ----------------------------------------------------
  if (msg.includes("hola") && minutos > 5) {
    setUser(remitente, {
      planBase: null,
      ultimoPlan: null,
      ultimaZona: null,
      modoCampania: false,
      intentosAgenda: 0,
      esperandoNumero: false,
      ultimoSaludo: false,
      turnoConversacion: 0
    });
    return SALUDO;
  }

  // ----------------------------------------------------
  // PRIMER SALUDO (solo una vez)
  // ----------------------------------------------------
  if (!u.planBase && msg.includes("hola") && !u.ultimoSaludo) {
    setUser(remitente, { ultimoSaludo: true });
    return SALUDO;
  }

  // ----------------------------------------------------
  // 1. MODO CAMPAÑA (DETECCIÓN ESTRICTA)
  // ----------------------------------------------------
  const planCampaña = detectarPlanCampania(msg);
  if (!u.modoCampania && planCampaña) {
    setUser(remitente, {
      modoCampania: true,
      planBase: planCampaña,
      ultimoPlan: planCampaña
    });

    return `💙 ¡Perfecto! El plan *${planCampaña}* funciona así:\n${INFO[planCampaña].como}\n\n${CTA()}`;
  }

  // ----------------------------------------------------
  // 2. DETECCIÓN DE ZONA / CAMBIO DE TEMA
  // ----------------------------------------------------
  const zona = detectarZona(msg);
  if (zona) {
    setUser(remitente, {
      ultimoPlan: zona.plan,
      ultimaZona: zona.zona
    });

    return `${INFO[zona.plan].como}\n\n${CTA()}`;
  }

// ----------------------------------------------------
// 3. INTENCIONES (preguntas directas)
// ----------------------------------------------------
const intent = detectarIntencion(msg);

// EXPLICAR TRATAMIENTO
if (intent === "explica" && u.ultimoPlan) {
  return `${INFO[u.ultimoPlan].como}\n\n${CTA()}`;
}

// PRECIO
if (intent === "precio" && u.ultimoPlan) {
  return `💙 El valor de *${u.ultimoPlan}* es **${INFO[u.ultimoPlan].precio}**.\n\n${CTA()}`;
}

// SESIONES
if (intent === "sesiones" && u.ultimoPlan) {
  return `✨ Generalmente son **${INFO[u.ultimoPlan].sesiones}**.\n\n${CTA()}`;
}

// DOLOR
if (intent === "dolor" && u.ultimoPlan) {
  return `${INFO[u.ultimoPlan].dolor}\n\n${CTA()}`;
}

// CARO
if (intent === "caro" && u.ultimoPlan) {
  return `💛 Entiendo totalmente. El precio incluye tecnologías reales (HIFU 12D, Cavitación, RF, Pro Sculpt, DL900) y profesionales certificadas.\n\n${CTA()}`;
}

// UBICACIÓN
if (intent === "ubicacion") {
  return UBICACION;
}

// EMOCIONAL
if (intent === "emocional") {
  return `💛 Es súper normal sentir eso. Lo importante es tu punto de partida y trabajar contigo de forma segura.\n\n${CTA()}`;
}

// ----------------------------------------------------
// 4. AGENDA INTELIGENTE (3 intentos)
// ----------------------------------------------------
//
//  Intento 0 → pregunta objetivo
//  Intento 1 → envío link embebido
//  Intento 2 → link nuevamente
//  Intento 3 → ofrece llamada
//  Intento 4 → espera número
//
if (u.intentosAgenda === 0) {
  setUser(remitente, { intentosAgenda: 1 });
  return "💛 Cuéntame: ¿buscas reducción, firmeza, volumen, arrugas o depilación?";
}

if (u.intentosAgenda === 1) {
  setUser(remitente, { intentosAgenda: 2 });
  return CTA();
}

if (u.intentosAgenda === 2) {
  setUser(remitente, { intentosAgenda: 3 });
  return `💙 Te dejo nuevamente tu acceso directo al diagnóstico gratuito: ${RESERVO}`;
}

if (u.intentosAgenda === 3) {
  setUser(remitente, { intentosAgenda: 4 });
  return "📞 Si quieres, una profesional puede llamarte y ayudarte directo 💛 ¿Quieres que coordinemos una llamada?";
}

// ----------------------------------------------------
// 5. ESPERANDO NÚMERO DEL PACIENTE
// ----------------------------------------------------
if (u.intentosAgenda === 4) {

  if (msg.includes("si") || msg.includes("sí") || msg.includes("dale") || msg.includes("ok")) {
    setUser(remitente, { esperandoNumero: true });
    return "Perfecto 💛 ¿Cuál es tu número de WhatsApp para coordinar la llamada?";
  }

  return CTA();
}

if (u.esperandoNumero) {
  const numero = msg.replace(/[^0-9]/g, "");

  if (numero.length < 8) {
    return "💛 Ese número parece incompleto ¿Me lo envías nuevamente?";
  }

  // Enviar aviso interno a tu número
  await sendMessage(
    NUM_INTERNO,
    `📞 Nueva solicitud de llamada:\n• Usuario: ${remitente}\n• Número: ${numero}\n• Último plan: ${u.planBase ?? u.ultimoPlan}\n• Mensaje: ${texto}`,
    "whatsapp"
  );

  setUser(remitente, { esperandoNumero: false });

  return "Listo 💛 Una profesional te llamará muy pronto.";
}

// ----------------------------------------------------
// 6. FALLBACK SUAVE
// ----------------------------------------------------
return CTA();

// ----------------------------------------------------
// FIN DEL ARCHIVO motor_respuesta_v3.js
// ----------------------------------------------------
