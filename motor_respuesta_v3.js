import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMERO_INTERNO = "56937648536";

// ----------------------------------------------
// MEMORIA
// ----------------------------------------------
function cargar() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {} };
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function guardar(data) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const mem = cargar();
  if (!mem.usuarios[id]) {
    mem.usuarios[id] = {
      ultimoPlan: null,
      ultimoTema: null,
      intentosAgenda: 0,
      esperandoNumero: false,
      campañaUsada: false
    };
    guardar(mem);
  }
  return mem.usuarios[id];
}

function setUser(id, data) {
  const mem = cargar();
  mem.usuarios[id] = { ...mem.usuarios[id], ...data };
  guardar(mem);
}

// ----------------------------------------------
// PLANES Y DETECCIÓN
// ----------------------------------------------
const PLANES = {
  "lipo express": "Lipo Express",
  "lipo body elite": "Lipo Body Elite",
  "push up": "Push Up",
  "gluteo": "Push Up",
  "glúteo": "Push Up",
  "gluteos": "Push Up",
  "glúteos": "Push Up",
  "poto": "Push Up",
  "trasero": "Push Up",
  "face elite": "Face Elite",
  "antiage": "Face Elite",
  "facial": "Face Elite",
  "rostro": "Face Elite",
  "depil": "Depilación DL900",
  "láser": "Depilación DL900",
  "laser": "Depilación DL900",
  "tonificar": "Body Fitness",
  "musculo": "Body Fitness",
  "músculo": "Body Fitness",
  "marcar": "Body Fitness",
  "flacidez": "Body Tensor",
  "tensar": "Body Tensor"
};

function detectarPlan(t) {
  const x = t.toLowerCase();
  for (const k in PLANES) if (x.includes(k)) return PLANES[k];
  return null;
}

function detectarIntencion(t) {
  const x = t.toLowerCase();
  if (x.includes("precio") || x.includes("vale") || x.includes("valor")) return "precio";
  if (x.includes("sesiones") || x.includes("cuantas") || x.includes("cuántas")) return "sesiones";
  if (x.includes("duele") || x.includes("dolor")) return "dolor";
  if (x.includes("donde") || x.includes("ubic")) return "ubicacion";
  if (x.includes("hola") || x.includes("buenas")) return "saludo";
  return "general";
}

// ----------------------------------------------
// INFO CLÍNICA POR PLAN
// ----------------------------------------------
const INFO = {
  "Lipo Express": {
    precio: "$432.000",
    sesiones: "8–10",
    dolor: "Es completamente tolerable 💙 Se siente un calorcito y vibración leve."
  },
  "Lipo Body Elite": {
    precio: "$664.000",
    sesiones: "10–12",
    dolor: "Nada doloroso ✨, es tecnología de ultrasonido y contracción muscular controlada."
  },
  "Push Up": {
    precio: "$376.000",
    sesiones: "8–10",
    dolor: "No duele 🍑 Son contracciones intensas pero totalmente tolerables."
  },
  "Face Elite": {
    precio: "$358.400",
    sesiones: "8–10",
    dolor: "Sensación tibia y puntos sensibles, pero nada fuerte 💆‍♀️✨"
  },
  "Depilación DL900": {
    precio: "planes desde $153.600",
    sesiones: "6 por zona",
    dolor: "Pinchacito leve en zonas sensibles, muy tolerable ⚡"
  },
  "Body Fitness": {
    precio: "$360.000",
    sesiones: "6–8",
    dolor: "Contracciones profundas tipo entrenamiento intenso 💪"
  },
  "Body Tensor": {
    precio: "$232.000",
    sesiones: "6–8",
    dolor: "Calorcito profundo, 100% tolerable 💛"
  }
};

// ----------------------------------------------
// PLANTILLAS
// ----------------------------------------------
function saludoInicial() {
  return "💙 ¡Hola! Soy Zara de Body Elite ✨ Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, piernas, rostro o depilación láser 🌟";
}

function campaña(plan) {
  const msg = {
    "Push Up": "🍑 El Push Up levanta y da volumen natural con Pro Sculpt + HIFU 12D + RF. Resultados desde las primeras semanas ✨",
    "Lipo Express": "⚡ La Lipo Express reduce grasa localizada (abdomen/cintura/espalda) con HIFU 12D + cavitación + RF. Muy rápida y efectiva 💛",
    "Lipo Body Elite": "💙 Lipo Body Elite combina HIFU 12D + EMS Sculptor + cavitación + RF. Es nuestro plan más completo.",
    "Face Elite": "✨ Face Elite trabaja firmeza, contorno, arrugas y luminosidad con HIFU 12D + Pink Glow + RF.",
    "Depilación DL900": "⚡ Láser DL900: rápido, seguro y sin dolor significativo. 6 sesiones por zona.",
    "Body Fitness": "💪 Body Fitness tonifica y define con EMS Sculptor.",
    "Body Tensor": "💛 Body Tensor trabaja flacidez en brazos, abdomen, piernas o papada."
  };
  return msg[plan] + "\n\n¿Te gustaría avanzar con este objetivo? 💙";
}

const UBICACION =
  "📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 Lun–Vie 9:30–20:00 • Sáb 9:30–13:00";

function intento1() {
  return "Perfecto 💛 Cuéntame, ¿qué te gustaría mejorar: grasa localizada, flacidez, volumen, celulitis o depilación láser?";
}

function link1() {
  return `Si deseas avanzar, aquí tienes tu diagnóstico gratuito 💙\n${RESERVO_LINK}`;
}

function link2() {
  return `Aquí tienes nuevamente el acceso al diagnóstico 💙\n${RESERVO_LINK}`;
}

function pedirLlamada() {
  return "Si quieres, una profesional puede llamarte 💛 ¿Te gustaría que te llamemos? 📞✨";
}

function pedirTelefono() {
  return "Perfecto 💛 ¿Me compartes tu número de WhatsApp para coordinar la llamada? 📞";
}

// ----------------------------------------------
// ENVÍO INTERNO
// ----------------------------------------------
async function avisoInterno(id, nombre, numero, mensaje, plan) {
  const txt =
    "📞 Nueva paciente solicita llamada.\n" +
    `• Usuario: ${id}\n` +
    `• Nombre: ${nombre ?? "No disponible"}\n` +
    `• Número: ${numero}\n` +
    `• Plan consultado: ${plan ?? "No detectado"}\n` +
    `• Último mensaje: ${mensaje}`;

  await sendMessage(NUMERO_INTERNO, txt, "whatsapp");
}

// ----------------------------------------------
// PROCESAR MENSAJE
// ----------------------------------------------
export async function procesarMensaje(texto, plataforma, userId, nombre) {
  const t = texto.toLowerCase().trim();
  const u = getUser(userId);

  const planDetectado = detectarPlan(t);
  const intencion = detectarIntencion(t);

  // ------------------------------------------
  // 1) Primer mensaje → campaña si detecta plan
  // ------------------------------------------
  if (!u.campañaUsada && planDetectado) {
    setUser(userId, {
      ultimoPlan: planDetectado,
      campañaUsada: true,
      ultimoTema: "campaña"
    });
    return campaña(planDetectado);
  }

  // ------------------------------------------
  // 2) Esperando número para llamada
  // ------------------------------------------
  if (u.esperandoNumero) {
    const num = t.replace(/[^0-9]/g, "");
    if (num.length < 8) return "Creo que el número está incompleto 💛 ¿Me lo envías de nuevo?";
    await avisoInterno(userId, nombre, num, texto, u.ultimoPlan);
    setUser(userId, { esperandoNumero: false });
    return "Perfecto 💛 Una profesional te contactará lo antes posible 📞✨";
  }

  // ------------------------------------------
  // 3) Intenciones específicas (continuidad)
  // ------------------------------------------
  if (intencion === "ubicacion") return UBICACION;

  if (intencion === "precio") {
    if (u.ultimoPlan && INFO[u.ultimoPlan])
      return `El valor de ${u.ultimoPlan} es ${INFO[u.ultimoPlan].precio} 💙\n¿Quieres que te deje tu acceso al diagnóstico gratuito? 💛`;
    return "Para darte el valor exacto necesito saber qué zona quieres trabajar 💛";
  }

  if (intencion === "sesiones") {
    if (u.ultimoPlan && INFO[u.ultimoPlan])
      return `En ${u.ultimoPlan} normalmente trabajamos ${INFO[u.ultimoPlan].sesiones} sesiones ✨`;
    return "La cantidad de sesiones depende del plan y tu objetivo 💛 ¿Qué zona quieres trabajar?";
  }

  if (intencion === "dolor") {
    if (u.ultimoPlan && INFO[u.ultimoPlan])
      return INFO[u.ultimoPlan].dolor;
    return "Nuestros tratamientos no duelen 💙 ¿Qué plan te interesa?";
  }

  // ------------------------------------------
  // 4) Primer mensaje sin plan → saludo
  // ------------------------------------------
  if (!u.ultimoPlan && intencion === "saludo") {
    return saludoInicial();
  }

  // ------------------------------------------
  // 5) Flujo de agenda (3 intentos)
  // ------------------------------------------
  if (u.intentosAgenda === 0) {
    setUser(userId, { intentosAgenda: 1 });
    return intento1();
  }

  if (u.intentosAgenda === 1) {
    setUser(userId, { intentosAgenda: 2 });
    return link1();
  }

  if (u.intentosAgenda === 2) {
    setUser(userId, { intentosAgenda: 3 });
    return link2();
  }

  if (u.intentosAgenda === 3) {
    setUser(userId, { intentosAgenda: 4 });
    return pedirLlamada();
  }

  if (u.intentosAgenda === 4) {
    if (t.includes("si") || t.includes("sí") || t.includes("ok") || t.includes("dale")) {
      setUser(userId, { esperandoNumero: true });
      return pedirTelefono();
    }
    return link2();
  }

  // ------------------------------------------
  // Fallback conversacional
  // ------------------------------------------
  return intento1();
}
