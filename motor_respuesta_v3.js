import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMERO_INTERNO = "56937648536"; // número para avisos internos

//-------------------------------------------------------------
// MEMORIA
//-------------------------------------------------------------
function cargarMemoria() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) {
      return { usuarios: {} };
    }
    const data = fs.readFileSync(MEMORIA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { usuarios: {} };
  }
}

function guardarMemoria(memoria) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(memoria, null, 2));
}

function getUsuario(id) {
  const memoria = cargarMemoria();
  if (!memoria.usuarios[id]) {
    memoria.usuarios[id] = {
      modo: "normal",
      ultimoPlan: null,
      ultimoTema: null,
      intentosAgenda: 0,
      esperandoNumero: false
    };
    guardarMemoria(memoria);
  }
  return memoria.usuarios[id];
}

function setUsuario(id, data) {
  const memoria = cargarMemoria();
  memoria.usuarios[id] = { ...memoria.usuarios[id], ...data };
  guardarMemoria(memoria);
}

//-------------------------------------------------------------
// DETECCIÓN DE INTENCIÓN
//-------------------------------------------------------------
function detectarIntencion(t) {
  if (t.includes("precio") || t.includes("vale") || t.includes("cuánto") || t.includes("valor"))
    return "precio";

  if (t.includes("duele") || t.includes("dolor"))
    return "dolor";

  if (t.includes("sesione"))
    return "sesiones";

  if (t.includes("donde") || t.includes("ubicación") || t.includes("esta"))
    return "ubicacion";

  if (t.includes("hola"))
    return "saludo";

  return "general";
}

//-------------------------------------------------------------
// DETECCIÓN DE PLANES
//-------------------------------------------------------------
const PLANES_KEYWORDS = {
  "lipo express": "Lipo Express",
  "lipo body elite": "Lipo Body Elite",
  "body elite": "Lipo Body Elite",
  "push up": "Push Up",
  "poto": "Push Up",
  "gluteo": "Push Up",
  "glúteo": "Push Up",
  "gluteos": "Push Up",
  "glúteos": "Push Up",
  "trasero": "Push Up",
  "face elite": "Face Elite",
  "facial": "Face Elite",
  "antiage": "Face Elite",
  "rostro": "Face Elite",
  "depil": "Depilación DL900",
  "laser": "Depilación DL900",
  "láser": "Depilación DL900",
  "body fitness": "Body Fitness",
  "tonificar": "Body Fitness",
  "marcar": "Body Fitness",
  "tensor": "Body Tensor",
  "flacidez": "Body Tensor"
};

function detectarPlan(t) {
  for (const k in PLANES_KEYWORDS) {
    if (t.includes(k)) return PLANES_KEYWORDS[k];
  }
  return null;
}

//-------------------------------------------------------------
// PLANES Y RESPUESTAS CLÍNICAS
//-------------------------------------------------------------
const PLANES = {
  "Push Up": {
    precio: "$376.000",
    sesiones: "8–10 sesiones",
    dolor: "No duele, pero sí sentirás contracciones intensas (no dolorosas).",
    descripcion:
      "El Push Up Glúteo levanta, proyecta y da forma natural usando Pro Sculpt, HIFU 12D y Radiofrecuencia 🍑✨."
  },
  "Lipo Express": {
    precio: "$432.000",
    sesiones: "8–10 sesiones",
    dolor: "La cavitación puede sentirse tibia, pero no dolorosa.",
    descripcion:
      "Reduce grasa localizada en abdomen, cintura y espalda con HIFU 12D + cavitación + radiofrecuencia 💛."
  },
  "Lipo Body Elite": {
    precio: "$664.000",
    sesiones: "10–12 sesiones",
    dolor: "No duele, es un trabajo profundo de tecnología.",
    descripcion:
      "Define cintura, abdomen y espalda con HIFU 12D + EMS Sculptor + cavitación + RF 💙."
  },
  "Face Elite": {
    precio: "$358.400",
    sesiones: "8–10 sesiones",
    dolor: "No duele; puede sentirse calorcito agradable.",
    descripcion:
      "Rejuvenece, tensa y mejora contorno con HIFU 12D + Pink Glow + RF ✨."
  },
  "Depilación DL900": {
    precio: "planes desde $153.600",
    sesiones: "6 sesiones por zona",
    dolor: "Se siente un pinchacito leve, pero no dolor significativo.",
    descripcion:
      "Láser DL900 rápido y seguro, apto para pieles latinas ⚡."
  },
  "Body Fitness": {
    precio: "$360.000",
    sesiones: "6–8 sesiones",
    dolor: "No duele, son contracciones profundas.",
    descripcion:
      "Tonifica, marca y define musculatura con EMS Sculptor 🔥."
  },
  "Body Tensor": {
    precio: "$232.000",
    sesiones: "6–8 sesiones",
    dolor: "Puede sentirse calor, pero no dolor.",
    descripcion:
      "Mejora firmeza y flacidez en brazos, abdomen, piernas o papada 🌟."
  }
};

//-------------------------------------------------------------
// RESPUESTAS BASE
//-------------------------------------------------------------
function saludoInicial() {
  return "💙 ¡Hola! Soy Zara de Body Elite ✨ Cuéntame, ¿qué zona te gustaría mejorar? abdomen, glúteos, piernas, rostro o depilación láser 🌟";
}

function plantillaCampaña(plan) {
  return `${PLANES[plan].descripcion}\n\nSi quieres ver si eres candidata y cuántas sesiones necesitas, puedo dejarte tu diagnóstico gratuito 💙`;
}

function plantillaNormal() {
  return "Perfecto 💛 Cuéntame, ¿qué te gustaría mejorar: grasa localizada, flacidez, volumen, celulitis o depilación láser?";
}

function plantillaLink1() {
  return `Si deseas avanzar, aquí tienes tu diagnóstico gratuito 💙\n${RESERVO_LINK}`;
}

function plantillaLink2() {
  return `Aquí tienes nuevamente tu acceso directo al diagnóstico 💙\n${RESERVO_LINK}`;
}

function plantillaLlamada() {
  return "Si quieres, una de nuestras profesionales puede llamarte directamente para ayudarte 💛 ¿Te gustaría que te llamemos?";
}

function pedirTelefono() {
  return "Perfecto 💛 ¿Me compartes tu número de WhatsApp para coordinar la llamada? 📞";
}

//-------------------------------------------------------------
// ENVÍO INTERNO
//-------------------------------------------------------------
async function avisoInterno(userId, nombre, numero, ultimoPlan, ultimoMensaje) {
  const texto =
    "📞 Nueva paciente solicita llamada.\n" +
    `• Usuario: ${userId}\n` +
    `• Nombre IG/WS: ${nombre ?? "No disponible"}\n` +
    `• Número entregado: ${numero}\n` +
    `• Tratamiento consultado: ${ultimoPlan ?? "No detectado"}\n` +
    `• Último mensaje: ${ultimoMensaje}`;

  await sendMessage(NUMERO_INTERNO, texto, "whatsapp");
}

//-------------------------------------------------------------
// MOTOR PRINCIPAL
//-------------------------------------------------------------
export async function procesarMensaje(texto, plataforma, userId, nombre) {
  const t = texto.toLowerCase().trim();
  const intencion = detectarIntencion(t);
  const planDetectado = detectarPlan(t);

  let usuario = getUsuario(userId);

  //-------------------------------------------------------------
  // PEDIR NÚMERO
  //-------------------------------------------------------------
  if (usuario.esperandoNumero) {
    const numero = t.replace(/[^0-9]/g, "");
    if (numero.length < 8)
      return "Creo que ese número está incompleto 💛 ¿Me lo envías nuevamente?";

    await avisoInterno(userId, nombre, numero, usuario.ultimoPlan, texto);
    setUsuario(userId, { esperandoNumero: false });
    return "¡Perfecto! 💛 Una profesional te contactará lo antes posible 📞✨";
  }

  //-------------------------------------------------------------
  // MODO CAMPAÑA (solo primer mensaje)
  //-------------------------------------------------------------
  if (usuario.modo === "normal" && planDetectado) {
    setUsuario(userId, {
      modo: "post_campaña",
      ultimoPlan: planDetectado,
      ultimoTema: "plan"
    });
    return plantillaCampaña(planDetectado);
  }

  //-------------------------------------------------------------
  // INTENCIONES CONTEXTUALES
  //-------------------------------------------------------------
  if (intencion === "ubicacion")
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén). Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00 💙";

  if (intencion === "precio") {
    if (usuario.ultimoPlan)
      return `El valor de ${usuario.ultimoPlan} es ${PLANES[usuario.ultimoPlan].precio} 💙`;

    return "Para darte el valor exacto necesito saber qué zona quieres trabajar 💛 abdomen, glúteos, piernas, rostro o depilación láser?";
  }

  if (intencion === "sesiones") {
    if (usuario.ultimoPlan)
      return `En ${usuario.ultimoPlan}, normalmente trabajamos ${PLANES[usuario.ultimoPlan].sesiones} ✨`;

    return "Depende del tratamiento y de tu caso 💛 Cuéntame, ¿qué zona te gustaría trabajar?";
  }

  if (intencion === "dolor") {
    if (usuario.ultimoPlan)
      return PLANES[usuario.ultimoPlan].dolor + " ✨";

    return "Depende del tratamiento 💛 Si me dices qué zona te gustaría mejorar, te explico exactamente cómo se siente.";
  }

  //-------------------------------------------------------------
  // SALUDO
  //-------------------------------------------------------------
  if (intencion === "saludo" && usuario.modo === "normal")
    return saludoInicial();

  //-------------------------------------------------------------
  // FLUJO AGENDA (3 intentos)
  //-------------------------------------------------------------
  if (usuario.intentosAgenda === 0) {
    setUsuario(userId, { intentosAgenda: 1 });
    return plantillaNormal();
  }

  if (usuario.intentosAgenda === 1) {
    setUsuario(userId, { intentosAgenda: 2 });
    return plantillaLink1();
  }

  if (usuario.intentosAgenda === 2) {
    setUsuario(userId, { intentosAgenda: 3 });
    return plantillaLink2();
  }

  if (usuario.intentosAgenda === 3) {
    setUsuario(userId, { intentosAgenda: 4 });
    return plantillaLlamada();
  }

  if (usuario.intentosAgenda === 4) {
    if (t.includes("si") || t.includes("sí") || t.includes("ok") || t.includes("dale")) {
      setUsuario(userId, { esperandoNumero: true });
      return pedirTelefono();
    }
    return plantillaLink2();
  }

  //-------------------------------------------------------------
  // FALLBACK GENERAL
  //-------------------------------------------------------------
  return plantillaNormal();
}
