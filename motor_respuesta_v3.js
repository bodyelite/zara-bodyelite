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
// DETECCIÓN PLANES/ZONAS
// ----------------------------------------------------
const ZONAS = {
  abdomen: "Lipo Express",
  cintura: "Lipo Express",
  espalda: "Lipo Express",
  vientre: "Lipo Express",
  gluteos: "Push Up",
  glúteos: "Push Up",
  gluteo: "Push Up",
  glúteo: "Push Up",
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
  depilación: "Depilación DL900",
  laser: "Depilación DL900",
  láser: "Depilación DL900"
};

function detectarZona(txt) {
  const t = txt.toLowerCase();
  for (const zona in ZONAS) {
    if (t.includes(zona)) return { zona, plan: ZONAS[zona] };
  }
  return null;
}

function detectarPlanCampaña(txt) {
  const t = txt.toLowerCase();
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
function intencion(txt) {
  const t = txt.toLowerCase();

  if (t.includes("hola")) return "saludo";
  if (
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("en qué consiste") ||
    t.includes("en que consiste")
  )
    return "explica";
  if (t.includes("precio") || t.includes("valor") || t.includes("vale"))
    return "precio";
  if (t.includes("sesiones") || t.includes("cuántas") || t.includes("cuantas"))
    return "sesiones";
  if (t.includes("duele") || t.includes("dolor")) return "dolor";
  if (t.includes("donde") || t.includes("ubic") || t.includes("direc"))
    return "ubicacion";
  if (t.includes("caro")) return "caro";
  if (t.includes("miedo") || t.includes("gordita") || t.includes("ansiosa"))
    return "emocional";

  return "general";
}
// ----------------------------------------------------
// INFO CLÍNICA
// ----------------------------------------------------
const INFO = {
  "Lipo Express": {
    como:
      "Trabajamos abdomen/cintura/espalda con HIFU 12D, cavitación y radiofrecuencia. Reduce grasa localizada sin dolor significativo ✨.",
    sesiones: "8–10 sesiones según tu punto de partida.",
    dolor: "Muy tolerable 💙, solo calor suave.",
    precio: "$432.000",
  },
  "Push Up": {
    como:
      "Levantamos y damos volumen natural con Pro Sculpt (20.000 contracciones), HIFU 12D y radiofrecuencia 🍑✨.",
    sesiones: "8–10 sesiones.",
    dolor: "Contracciones intensas pero tolerables 💛.",
    precio: "$376.000",
  },
  "Face Elite": {
    como:
      "HIFU 12D + Pink Glow + RF para firmeza, contorno y arrugas ✨.",
    sesiones: "8–10 sesiones.",
    dolor: "Sensación tibia con puntos sensibles 💆‍♀️.",
    precio: "$358.400",
  },
  "Body Tensor": {
    como:
      "Radiofrecuencia profunda para flacidez (abdomen, brazos, piernas, papada).",
    sesiones: "6–8 sesiones.",
    dolor: "Calorcito profundo 💛.",
    precio: "$232.000",
  },
  "Body Fitness": {
    como:
      "Tonificación muscular real con EMS Sculptor (supramáximas).",
    sesiones: "6–8 sesiones.",
    dolor: "No duele 💪.",
    precio: "$360.000",
  },
  "Depilación DL900": {
    como:
      "Láser diodo DL900 rápido y seguro para eliminar vello desde la raíz ⚡.",
    sesiones: "6 sesiones.",
    dolor: "Pinchacito leve.",
    precio: "Planes desde $153.600",
  },
};

// ----------------------------------------------------
// RESPUESTAS BASE
// ----------------------------------------------------
const SALUDO =
  "💙 ¡Hola! Soy Zara de Body Elite. Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, brazos, piernas o depilación.";

const UBICACION =
  "📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 Lun–Vie 9:30–20:00 • Sáb 9:30–13:00";

function CTA() {
  return `Si deseas avanzar, puedes agendar tu diagnóstico gratuito aquí 💙 ${RESERVO}`;
}

// ----------------------------------------------------
// MOTOR PRINCIPAL - INICIO
// ----------------------------------------------------
export async function procesarMensaje(texto, remitente, plataforma) {
  const ahora = Date.now();
  const u = getUser(remitente);
  const msg = texto.toLowerCase().trim();

  // actualización de tiempo
  setUser(remitente, {
    turnoConversacion: u.turnoConversacion + 1,
  });

  const minutos = (ahora - u.timestampUltimoMensaje) / 1000 / 60;

  // ---------------------------------------------------
  // SALUDO - RESET SI PASAN 5 MINUTOS
  // ---------------------------------------------------
  if (msg.includes("hola") && minutos > 5) {
    setUser(remitente, {
      planBase: null,
      ultimoPlan: null,
      ultimaZona: null,
      modoCampania: false,
      intentosAgenda: 0,
      esperandoNumero: false,
      ultimoSaludo: true,
      turnoConversacion: 0,
    });
    return SALUDO;
  }

  // primer saludo si no hay plan base
  if (!u.planBase && msg.includes("hola") && !u.ultimoSaludo) {
    setUser(remitente, { ultimoSaludo: true });
    return SALUDO;
  }

  // ---------------------------------------------------
  // 1. MODO CAMPAÑA
  // ---------------------------------------------------
  const planCampaña = detectarPlanCampaña(msg);
  if (!u.modoCampania && planCampaña) {
    setUser(remitente, {
      modoCampania: true,
      planBase: planCampaña,
      ultimoPlan: planCampaña,
    });

    return `💙 ¡Perfecto! El plan ${planCampaña} se trabaja así:\n${INFO[planCampaña].como}\n\n${CTA()}`;
  }

  // ---------------------------------------------------
  // 2. DETECCIÓN DE ZONA / CAMBIO DE TEMA
  // ---------------------------------------------------
  const zonaNueva = detectarZona(msg);
  if (zonaNueva) {
    setUser(remitente, {
      ultimoPlan: zonaNueva.plan,
      ultimaZona: zonaNueva.zona,
    });

    return `${INFO[zonaNueva.plan].como}\n\n${CTA()}`;
  }

// ---------------------------------------------------
// 3. INTENCIONES CLÍNICAS
// ---------------------------------------------------
const intent = intencion(msg);

// EXPLICACIÓN
if (intent === "explica" && u.ultimoPlan) {
  return `${INFO[u.ultimoPlan].como}\n\n${CTA()}`;
}

// PRECIO
if (intent === "precio" && u.ultimoPlan) {
  return `El valor de ${u.ultimoPlan} es ${INFO[u.ultimoPlan].precio} 💙\n\n${CTA()}`;
}

// SESIONES
if (intent === "sesiones" && u.ultimoPlan) {
  return `${INFO[u.ultimoPlan].sesiones} ✨\n\n${CTA()}`;
}

// DOLOR
if (intent === "dolor" && u.ultimoPlan) {
  return `${INFO[u.ultimoPlan].dolor}\n\n${CTA()}`;
}

// CARO
if (intent === "caro" && u.ultimoPlan) {
  return `Entiendo totalmente 💛. El valor refleja la combinación de tecnologías reales y profesionales certificadas.\n\n${CTA()}`;
}

// UBICACIÓN
if (intent === "ubicacion") {
  return UBICACION;
}

// EMOCIONAL
if (intent === "emocional") {
  return `Y está perfecto 💛. Cada cuerpo es distinto y el tratamiento se ajusta a tu punto de partida.\n\n${CTA()}`;
}

// ---------------------------------------------------
// 4. AGENDA INTELIGENTE (3 intentos + llamada)
// ---------------------------------------------------
if (u.intentosAgenda === 0) {
  setUser(remitente, { intentosAgenda: 1 });
  return "Perfecto 💛 ¿Qué objetivo te gustaría trabajar hoy? reducción, firmeza, volumen, arrugas o depilación?";
}

if (u.intentosAgenda === 1) {
  setUser(remitente, { intentosAgenda: 2 });
  return CTA();
}

if (u.intentosAgenda === 2) {
  setUser(remitente, { intentosAgenda: 3 });
  return `Aquí tienes nuevamente tu acceso directo 💙 ${RESERVO}`;
}

if (u.intentosAgenda === 3) {
  setUser(remitente, { intentosAgenda: 4 });
  return "Si deseas, una profesional puede llamarte y ayudarte directamente 💛 ¿Quieres que la contactemos?";
}

if (u.intentosAgenda === 4) {
  if (
    msg.includes("si") ||
    msg.includes("sí") ||
    msg.includes("dale") ||
    msg.includes("ok")
  ) {
    setUser(remitente, { esperandoNumero: true });
    return "Perfecto 💛 ¿Cuál es tu número de WhatsApp para coordinar la llamada?";
  }
  return CTA();
}

// ---------------------------------------------------
// 5. ESPERANDO NÚMERO DE TELÉFONO
// ---------------------------------------------------
if (u.esperandoNumero) {
  const num = msg.replace(/[^0-9]/g, "");

  if (num.length < 8) {
    return "Ese número parece incompleto 💛 ¿Me lo envías nuevamente?";
  }

  // Enviar aviso interno
  await sendMessage(
    NUM_INTERNO,
    `📞 Nueva paciente solicita llamada:
• Usuario: ${remitente}
• Número: ${num}
• Último tratamiento: ${u.planBase ?? u.ultimoPlan}
• Mensaje: ${texto}`,
    "whatsapp"
  );

  setUser(remitente, { esperandoNumero: false });

  return "Perfecto 💛 Una profesional te llamará lo antes posible 📞✨";
}

// ---------------------------------------------------
// 6. FALLBACK GENERAL (NO SE QUEDA PEGADO, NO REPITE)
// ---------------------------------------------------
return CTA();

// ---------------------------------------------------
// FIN DEL ARCHIVO motor_respuesta_v3.js
// ---------------------------------------------------
