import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria_usuarios.json";
const RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUM_INTERNO = "56937648536";

// ----------------------------------------------------
// MEMORIA PERSISTENTE
// ----------------------------------------------------
function loadMemory() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {} };
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function saveMemory(data) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const mem = loadMemory();
  if (!mem.usuarios[id]) {
    mem.usuarios[id] = {
      ultimoPlan: null,
      planBase: null,
      ultimaZona: null,
      intentosAgenda: 0,
      modoCampaña: false,
      esperandoNumero: false,
      turnoConversacion: 0
    };
    saveMemory(mem);
  }
  return mem.usuarios[id];
}

function setUser(id, data) {
  const mem = loadMemory();
  mem.usuarios[id] = { ...mem.usuarios[id], ...data };
  saveMemory(mem);
}

// ----------------------------------------------------
// DETECCIÓN DE PLANES Y ZONAS
// ----------------------------------------------------
const PLANES = {
  "abdomen": "Lipo Express",
  "cintura": "Lipo Express",
  "espalda": "Lipo Express",
  "vientre": "Lipo Express",
  "gluteo": "Push Up",
  "glúteo": "Push Up",
  "gluteos": "Push Up",
  "glúteos": "Push Up",
  "poto": "Push Up",
  "trasero": "Push Up",
  "rostro": "Face Elite",
  "cara": "Face Elite",
  "arrugas": "Face Elite",
  "manchas": "Face Elite",
  "papada": "Face Elite",
  "oval": "Face Elite",
  "flacidez": "Body Tensor",
  "piernas": "Body Tensor",
  "brazos": "Body Tensor",
  "musculo": "Body Fitness",
  "músculo": "Body Fitness",
  "marcar": "Body Fitness",
  "tonificar": "Body Fitness",
  "depilacion": "Depilación DL900",
  "depilación": "Depilación DL900",
  "laser": "Depilación DL900",
  "láser": "Depilación DL900"
};

function detectarZonaPlan(txt) {
  const t = txt.toLowerCase();
  for (const zona in PLANES) {
    if (t.includes(zona)) return { zona, plan: PLANES[zona] };
  }
  return null;
}

function detectarPlanPorNombre(txt) {
  const t = txt.toLowerCase();
  if (t.includes("push up")) return "Push Up";
  if (t.includes("lipo express")) return "Lipo Express";
  if (t.includes("lipo body elite")) return "Lipo Body Elite";
  if (t.includes("face elite")) return "Face Elite";
  if (t.includes("body fitness")) return "Body Fitness";
  if (t.includes("body tensor")) return "Body Tensor";
  if (t.includes("depil")) return "Depilación DL900";
  return null;
}

// ----------------------------------------------------
// INTENCIONES (MEJORADAS)
// ----------------------------------------------------
function detectarIntencion(txt) {
  const t = txt.toLowerCase();

  if (
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("en qué consiste") ||
    t.includes("en que consiste") ||
    t.includes("cómo lo hacen") ||
    t.includes("que hace") ||
    t.includes("qué hace") ||
    t.includes("funciona?")
  ) return "explicacion";

  if (t.includes("precio") || t.includes("valor") || t.includes("vale")) return "precio";
  if (t.includes("sesiones") || t.includes("cuántas") || t.includes("cuantas")) return "sesiones";
  if (t.includes("duele") || t.includes("dolor")) return "dolor";
  if (t.includes("donde") || t.includes("ubic") || t.includes("direc")) return "ubicacion";
  if (t.includes("caro")) return "caro";

  if (t.includes("soy") || t.includes("estoy") || t.includes("miedo") || t.includes("pena")) return "emocional";

  if (t.includes("hola") || t.includes("buenas")) return "saludo";

  return "general";
}

// ----------------------------------------------------
// INFO CLÍNICA POR PLAN
// ----------------------------------------------------
const INFO = {
  "Lipo Express": {
    como: "La Lipo Express combina HIFU 12D, cavitación y radiofrecuencia para reducir grasa localizada en abdomen, cintura y espalda. Es no invasiva y los cambios comienzan a notarse desde las primeras semanas ✨.",
    sesiones: "8–10 sesiones según tu punto de partida.",
    dolor: "Es muy tolerable 💙, se siente un calorcito suave.",
    precio: "$432.000",
    valor: "Incluye HIFU 12D real, cavitación certificada y RF profunda. Son tecnologías seguras, avanzadas y con resultados rápidos."
  },
  "Push Up": {
    como: "El Push Up combina Pro Sculpt (20.000 contracciones por sesión), HIFU 12D y Radiofrecuencia. Levanta, proyecta y mejora firmeza del glúteo sin cirugía 🍑✨.",
    sesiones: "8–10 sesiones dependiendo de firmeza y volumen.",
    dolor: "No duele 💛, son contracciones intensas pero tolerables.",
    precio: "$376.000",
    valor: "Incluye Pro Sculpt real + HIFU 12D + RF profunda, guiadas por profesionales."
  },
  "Face Elite": {
    como: "Face Elite trabaja con HIFU 12D, Pink Glow y radiofrecuencia para firmeza, contorno, arrugas y luminosidad facial ✨.",
    sesiones: "8–10 sesiones según tu objetivo.",
    dolor: "Leve calor con puntos sensibles 💆‍♀️.",
    precio: "$358.400",
    valor: "Usamos HIFU 12D real y Pink Glow original para lifting natural."
  },
  "Body Tensor": {
    como: "Body Tensor trabaja la flacidez de abdomen, brazos, piernas y papada con radiofrecuencia profunda y tensores.",
    sesiones: "6–8 sesiones.",
    dolor: "Calorcito profundo pero totalmente tolerable 💛.",
    precio: "$232.000",
    valor: "RF profesional que estimula colágeno I–III para tensado visible."
  },
  "Body Fitness": {
    como: "Body Fitness usa EMS Sculptor real para tonificar y marcar abdomen o glúteo con contracciones supramáximas.",
    sesiones: "6–8 sesiones.",
    dolor: "No duele 💪.",
    precio: "$360.000",
    valor: "EMS Sculptor real, no imitaciones."
  },
  "Depilación DL900": {
    como: "El DL900 es un láser diodo seguro y rápido que debilita el folículo desde la raíz.",
    sesiones: "6 sesiones por zona.",
    dolor: "Pinchacito leve ⚡.",
    precio: "Planes desde $153.600",
    valor: "Es un diodo profesional certificado, muy efectivo en piel latina."
  }
};

// ----------------------------------------------------
// RESPUESTAS FIJAS
// ----------------------------------------------------
const UBICACION =
"📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 Lun–Vie 9:30–20:00 • Sáb 9:30–13:00";

function CTA() {
  return `Si deseas avanzar, te dejo tu diagnóstico gratuito 💙\n${RESERVO}`;
}

// ----------------------------------------------------
// MOTOR PRINCIPAL
// ----------------------------------------------------
export async function procesarMensaje(texto, remitente, plataforma) {
  const msg = texto.toLowerCase().trim();
  const u = getUser(remitente);

  setUser(remitente, { turnoConversacion: u.turnoConversacion + 1 });

  const intent = detectarIntencion(msg);
  const cambio = detectarZonaPlan(msg);
  const planCampaña = detectarPlanPorNombre(msg);

  // ----------------------------
  // 1. Primer mensaje → campaña
  // ----------------------------
  if (!u.modoCampaña && planCampaña) {
    setUser(remitente, {
      modoCampaña: true,
      planBase: planCampaña,
      ultimoPlan: planCampaña
    });

    return `💙 ¡Perfecto! El plan ${planCampaña} trabaja así:\n${INFO[planCampaña].como}\n\n¿Te gustaría revisar tu caso?`;
  }

  // ----------------------------
  // 2. Cambio de zona → responde con ese plan SIN perder el plan base
  // ----------------------------
  if (cambio) {
    setUser(remitente, { ultimoPlan: cambio.plan, ultimaZona: cambio.zona });
    return `${INFO[cambio.plan].como}\n\nSi deseas, luego volvemos a ${u.planBase ?? cambio.plan} 💛`;
  }

  // ----------------------------
  // 3. Intenciones clínicas
  // ----------------------------
  if (intent === "explicacion" && u.ultimoPlan) {
    return `${INFO[u.ultimoPlan].como}\n\n${CTA()}`;
  }

  if (intent === "precio" && u.ultimoPlan) {
    return `El valor de ${u.ultimoPlan} es ${INFO[u.ultimoPlan].precio} 💙\n\n${CTA()}`;
  }

  if (intent === "sesiones" && u.ultimoPlan) {
    return `${INFO[u.ultimoPlan].sesiones} ✨\n\n${CTA()}`;
  }

  if (intent === "dolor" && u.ultimoPlan) {
    return `${INFO[u.ultimoPlan].dolor}\n\n${CTA()}`;
  }

  if (intent === "caro" && u.ultimoPlan) {
    return `${INFO[u.ultimoPlan].valor}\n\n${CTA()}`;
  }

  if (intent === "ubicacion") return UBICACION;

  if (intent === "emocional") {
    return `Y está perfecto 💛 Cada cuerpo es distinto, y los tratamientos se ajustan a tu punto de partida.\n\n${CTA()}`;
  }

  // ----------------------------
  // 4. Agenda (3 intentos)
  // ----------------------------
  if (u.intentosAgenda === 0) {
    setUser(remitente, { intentosAgenda: 1 });
    return `Perfecto 💛 ¿Qué objetivo te gustaría trabajar? reducción, firmeza, volumen o rejuvenecimiento?`;
  }

  if (u.intentosAgenda === 1) {
    setUser(remitente, { intentosAgenda: 2 });
    return CTA();
  }

  if (u.intentosAgenda === 2) {
    setUser(remitente, { intentosAgenda: 3 });
    return `Aquí tienes nuevamente tu diagnóstico gratuito 💙\n${RESERVO}`;
  }

  if (u.intentosAgenda === 3) {
    setUser(remitente, { intentosAgenda: 4 });
    return "Si quieres, una profesional puede llamarte 💛 ¿Te gustaría eso? 📞";
  }

  if (u.intentosAgenda === 4) {
    if (msg.includes("si") || msg.includes("sí") || msg.includes("dale") || msg.includes("ok")) {
      setUser(remitente, { esperandoNumero: true });
      return "Perfecto 💛 ¿Cuál es tu número de WhatsApp para coordinar la llamada?";
    }
    return CTA();
  }

  // ----------------------------
  // 5. Esperando número
  // ----------------------------
  if (u.esperandoNumero) {
    const num = msg.replace(/[^0-9]/g, "");
    if (num.length < 8) return "Ese número parece incompleto 💛 ¿Me lo envías de nuevo?";

    await sendMessage(NUM_INTERNO,
`📞 Nueva paciente solicita llamada:
• Usuario: ${remitente}
• Número: ${num}
• Último plan: ${u.planBase ?? u.ultimoPlan}
• Mensaje: ${texto}`,
"whatsapp");

    setUser(remitente, { esperandoNumero: false });

    return "Perfecto 💛 Una profesional te contactará a la brevedad 📞✨";
  }

  // ----------------------------
  // Fallback general
  // ----------------------------
  return CTA();
}
