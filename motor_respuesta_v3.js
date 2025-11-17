import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMERO_INTERNO = "56937648536"; // número para avisos internos

//--------------------------------------------------
// UTILIDADES DE MEMORIA
//--------------------------------------------------
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
  if (!memoria.usuarios[id]) memoria.usuarios[id] = { intentosAgenda: 0, modo: "normal" };
  return memoria.usuarios[id];
}

function setUsuario(id, data) {
  const memoria = cargarMemoria();
  memoria.usuarios[id] = { ...memoria.usuarios[id], ...data };
  guardarMemoria(memoria);
}

//--------------------------------------------------
// DETECCIÓN DE TRATAMIENTOS
//--------------------------------------------------
const PLANES_KEYWORDS = {
  "lipo express": "Lipo Express",
  "lipo body elite": "Lipo Body Elite",
  "lipo body": "Lipo Body Elite",
  "body elite": "Lipo Body Elite",
  "push up": "Push Up",
  "pushup": "Push Up",
  "gluteo": "Push Up",
  "glúteo": "Push Up",
  "gluteos": "Push Up",
  "glúteos": "Push Up",
  "trasero": "Push Up",
  "poto": "Push Up",
  "nalgas": "Push Up",
  "face elite": "Face Elite",
  "antiage": "Face Elite",
  "facial": "Face Elite",
  "cara": "Face Elite",
  "rostro": "Face Elite",
  "depil": "Depilación DL900",
  "pelito": "Depilación DL900",
  "pelitos": "Depilación DL900",
  "cera": "Depilación DL900",
  "laser": "Depilación DL900",
  "láser": "Depilación DL900",
  "tonificar": "Body Fitness",
  "marcar": "Body Fitness",
  "músculo": "Body Fitness",
  "musculo": "Body Fitness",
  "abdomen marcado": "Body Fitness",
  "flacidez": "Body Tensor",
  "tensar": "Body Tensor",
  "piel suelta": "Body Tensor"
};

function detectarPlan(texto) {
  const t = texto.toLowerCase();
  for (const k in PLANES_KEYWORDS) {
    if (t.includes(k)) return PLANES_KEYWORDS[k];
  }
  return null;
}

//--------------------------------------------------
// PLANTILLAS
//--------------------------------------------------
function saludoInicial() {
  return "💙 ¡Hola! Soy Zara de Body Elite ✨ Cuéntame, ¿qué zona te gustaría mejorar? abdomen, glúteos, piernas, rostro o depilación láser 🌟";
}

function plantillaCampaña(plan) {
  const msg = {
    "Push Up":
      "🔥 El Push Up es ideal para levantar y dar volumen al glúteo. Usamos Pro Sculpt, HIFU 12D y Radiofrecuencia. Se trabaja firmeza, volumen y curva natural 🍑✨",
    "Lipo Express":
      "⚡ La Lipo Express reduce grasa localizada (abdomen, cintura, espalda). Combina HIFU 12D + cavitación + radiofrecuencia. Resultados rápidos y visibles 💛",
    "Lipo Body Elite":
      "✨ Lipo Body Elite es nuestro plan más completo para cintura-abdomen-espalda: HIFU 12D + EMS Sculptor + cavitación + RF. Define, reduce y tensa 💙",
    "Face Elite":
      "✨ Face Elite trabaja firmeza, contorno, líneas de expresión y luminosidad. Incluye HIFU 12D + Pink Glow + RF + toxina según caso 💆‍♀️💙",
    "Depilación DL900":
      "✨ Nuestro láser DL900 es rápido, seguro y efectivo. 6 sesiones por zona, apto para pieles latinas y sin dolor significativo ⚡",
    "Body Fitness":
      "💪 Body Fitness tonifica, define y marca musculatura con EMS Sculptor + tecnologías tensoras. Ideal abdomen/glúteos/brazos 🔥",
    "Body Tensor":
      "💛 Body Tensor trabaja flacidez y firmeza con RF + HIFU 12D. Ideal brazos, abdomen, piernas o papada ✨"
  };

  return (
    msg[plan] +
    `\n\nSi quieres ver si eres candidata y cuántas sesiones necesitas, puedo dejarte tu diagnóstico gratuito 💙`
  );
}

function plantillaNormalConversacion() {
  return "Perfecto 💛 Cuéntame, ¿qué te gustaría mejorar: grasa localizada, flacidez, volumen, celulitis o depilación láser?";
}

function plantillaLink1() {
  return `Si deseas avanzar, aquí tienes tu diagnóstico gratuito 💙\n${RESERVO_LINK}`;
}

function plantillaLink2() {
  return `Aquí tienes nuevamente el acceso directo a tu diagnóstico 💙\n${RESERVO_LINK}`;
}

function plantillaLlamada() {
  return "Si quieres, una de nuestras profesionales puede llamarte directamente para ayudarte 💛 ¿Te gustaría que te llamemos?";
}

function pedirTelefono() {
  return "Perfecto 💛 ¿Me compartes tu número de WhatsApp para coordinar la llamada? 📞";
}

async function avisoInterno(usuarioId, nombre, numero, ultimoMensaje, plan) {
  const text = 
    "📞 Nueva paciente solicita llamada.\n" +
    `• Usuario: ${usuarioId}\n` +
    `• Nombre IG/WS: ${nombre ?? "No disponible"}\n` +
    `• Número entregado: ${numero}\n` +
    `• Tratamiento consultado: ${plan ?? "No detectado"}\n` +
    `• Último mensaje: ${ultimoMensaje}`;

  await sendMessage(NUMERO_INTERNO, text, "whatsapp");
}

//--------------------------------------------------
// LÓGICA PRINCIPAL
//--------------------------------------------------
export async function procesarMensaje(texto, platform, userId = null, nombre = null) {
  const t = texto.toLowerCase().trim();
  const planDetectado = detectarPlan(t);

  // Cargar/crear usuario
  const usuario = getUsuario(userId);
  let { intentosAgenda, modo, esperandoNumero } = usuario;

  //--------------------------------------------------
  // 1) MODO CAMPAÑA – solo PRIMER mensaje con plan
  //--------------------------------------------------
  if (modo === "normal" && planDetectado) {
    setUsuario(userId, { modo: "post_campaña", ultimoPlan: planDetectado });
    return plantillaCampaña(planDetectado);
  }

  //--------------------------------------------------
  // 2) PEDIR TELÉFONO → usuario dijo sí a llamada
  //--------------------------------------------------
  if (esperandoNumero) {
    const numero = texto.replace(/[^0-9]/g, "");

    // validar
    if (numero.length < 8) {
      return "Creo que ese número no está completo 💛 ¿Me lo puedes enviar nuevamente?";
    }

    // guardar aviso interno
    await avisoInterno(userId, nombre, numero, texto, usuario.ultimoPlan);

    // limpiar estado
    setUsuario(userId, { esperandoNumero: false });

    return "Perfecto 💛 Le diremos a una profesional que te contacte lo antes posible 📞✨";
  }

  //--------------------------------------------------
  // 3) MODO NORMAL – segundo mensaje en adelante
  //--------------------------------------------------
  // Saludo normal si no hay plan
  if (modo === "normal" && !planDetectado) {
    setUsuario(userId, { modo: "normal" });
    return saludoInicial();
  }

  // Conversación normal
  if (modo !== "normal") {
    // Intentos de agenda
    if (intentosAgenda === 0) {
      setUsuario(userId, { intentosAgenda: 1 });
      return plantillaNormalConversacion();
    }

    if (intentosAgenda === 1) {
      setUsuario(userId, { intentosAgenda: 2 });
      return plantillaLink1();
    }

    if (intentosAgenda === 2) {
      setUsuario(userId, { intentosAgenda: 3 });
      return plantillaLink2();
    }

    if (intentosAgenda === 3) {
      setUsuario(userId, { intentosAgenda: 4 });
      return plantillaLlamada();
    }

    if (intentosAgenda === 4) {
      if (t.includes("si") || t.includes("sí") || t.includes("ok") || t.includes("dale")) {
        setUsuario(userId, { esperandoNumero: true });
        return pedirTelefono();
      }
      return plantillaLink2();
    }
  }

  //--------------------------------------------------
  // Fallback
  //--------------------------------------------------
  return plantillaNormalConversacion();
}
