import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUM_INTERNO = "56937648536";

// ----------------------------------------------------
// MEMORIA
// ----------------------------------------------------
function load() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {} };
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function save(data) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const mem = load();
  if (!mem.usuarios[id]) {
    mem.usuarios[id] = {
      ultimoPlan: null,
      zona: null,
      intentosAgenda: 0,
      esperandoNumero: false,
      campañaUsada: false,
      turnos: 0
    };
    save(mem);
  }
  return mem.usuarios[id];
}

function setUser(id, data) {
  const mem = load();
  mem.usuarios[id] = { ...mem.usuarios[id], ...data };
  save(mem);
}

// ----------------------------------------------------
// PLANES Y DETECCIÓN
// ----------------------------------------------------
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
  "laser": "Depilación DL900",
  "láser": "Depilación DL900",
  "tonificar": "Body Fitness",
  "musculo": "Body Fitness",
  "músculo": "Body Fitness",
  "flacidez": "Body Tensor",
  "tensar": "Body Tensor"
};

function detectarPlan(t) {
  const x = t.toLowerCase();
  for (const k in PLANES) if (x.includes(k)) return PLANES[k];
  return null;
}

// ----------------------------------------------------
// INTENCIONES
// ----------------------------------------------------
function intencion(txt) {
  const t = txt.toLowerCase();

  if (
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("en qué consiste") ||
    t.includes("en que consiste") ||
    t.includes("cómo lo hacen") ||
    t.includes("como lo hacen") ||
    t.includes("qué hace") ||
    t.includes("que hace") ||
    t.includes("funcionamiento")
  ) return "explica";

  if (t.includes("precio") || t.includes("valor") || t.includes("vale")) return "precio";
  if (t.includes("sesiones") || t.includes("cuántas") || t.includes("cuantas")) return "sesiones";
  if (t.includes("duele") || t.includes("dolor")) return "dolor";
  if (t.includes("donde") || t.includes("ubic") || t.includes("direc")) return "ubicacion";
  if (t.includes("caro") || t.includes("costoso")) return "caro";
  if (t.includes("hola") || t.includes("buenas")) return "saludo";

  if (t.includes("soy gordita") || t.includes("gordita") || t.includes("gordito")) return "autoimagen";
  if (t.includes("sirve") || t.includes("funciona") || t.includes("miedo")) return "ansiedad";

  return "general";
}

// ----------------------------------------------------
// INFO CLÍNICA
// ----------------------------------------------------
const INFO = {
  "Lipo Express": {
    precio: "$432.000",
    sesiones: "8–10",
    dolor: "Es muy tolerable 💙, se siente calor suave y vibración.",
    como: "La Lipo Express combina HIFU 12D para romper grasa profunda, cavitación para licuar adipocitos y radiofrecuencia para tensar piel. Reduce abdomen, cintura y espalda sin dolor significativo ✨.",
    valor: "El valor se debe a que incluye HIFU 12D real, cavitación certificada y radiofrecuencia profunda guiada por profesionales."
  },
  "Lipo Body Elite": {
    precio: "$664.000",
    sesiones: "10–12",
    dolor: "Muy tolerable ✨.",
    como: "HIFU 12D + EMS Sculptor + cavitación + RF. Reduce grasa, marca abdomen y compacta tejidos rápidamente.",
    valor: "Incluye HIFU 12D auténtico y EMS Sculptor real, tecnologías avanzadas y seguras."
  },
  "Push Up": {
    precio: "$376.000",
    sesiones: "8–10",
    dolor: "Contracciones intensas pero no dolorosas 🍑.",
    como: "Pro Sculpt (20.000 contracciones por sesión) + HIFU 12D para firmeza + RF para compactar tejido. Levanta y proyecta el glúteo sin cirugía 🍑✨.",
    valor: "Se debe a la combinación de Pro Sculpt real + HIFU 12D + RF profesional."
  },
  "Face Elite": {
    precio: "$358.400",
    sesiones: "8–10",
    dolor: "Sensación tibia con puntos sensibles 💆‍♀️.",
    como: "HIFU 12D para firmeza, Pink Glow para regeneración celular y RF para compactar y dar luminosidad.",
    valor: "Incluye HIFU 12D real, Pink Glow original y RF profesional para lifting natural."
  },
  "Depilación DL900": {
    precio: "Planes desde $153.600",
    sesiones: "6",
    dolor: "Pinchacito leve ⚡.",
    como: "El DL900 es un láser diodo rápido y seguro que debilita el folículo desde la raíz.",
    valor: "Es un diodo certificado, efectivo en piel latina y con resultados rápidos."
  },
  "Body Fitness": {
    precio: "$360.000",
    sesiones: "6–8",
    dolor: "No duele 💪.",
    como: "EMS Sculptor activa musculatura profunda para tonificar y marcar abdomen y glúteo.",
    valor: "El EMS Sculptor real produce contracciones supramáximas imposibles de lograr en gimnasio."
  },
  "Body Tensor": {
    precio: "$232.000",
    sesiones: "6–8",
    dolor: "Calor profundo pero tolerable 💛.",
    como: "Radiofrecuencia profunda + tensores para mejorar flacidez en abdomen, brazos, piernas o papada.",
    valor: "La RF profesional estimula colágeno I–III y logra tensado visible de forma segura."
  }
};

// ----------------------------------------------------
// PLANTILLAS
// ----------------------------------------------------
const UBICACION =
"📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 Lun–Vie 9:30–20:00 • Sáb 9:30–13:00";

function saludo() {
  return "💙 ¡Hola! Soy Zara de Body Elite ✨ Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, piernas, rostro o depilación.";
}

function campaña(plan) {
  const msg = {
    "Push Up": "🍑 El Push Up levanta y da volumen natural con Pro Sculpt + HIFU 12D + RF. Resultados desde pocas semanas ✨",
    "Lipo Express": "⚡ Lipo Express reduce grasa localizada de abdomen/cintura/espalda con HIFU 12D + cavitación + RF.",
    "Lipo Body Elite": "💙 Lipo Body Elite es nuestro plan más completo para moldear cintura y abdomen.",
    "Face Elite": "✨ Face Elite mejora firmeza, contorno y luminosidad.",
    "Depilación DL900": "⚡ Láser diodo DL900 rápido y seguro.",
    "Body Fitness": "💪 Body Fitness tonifica abdomen y glúteo con EMS Sculptor.",
    "Body Tensor": "💛 Body Tensor mejora flacidez con RF profunda."
  };
  return msg[plan] + "\n\nSi quieres, puedo ayudarte a revisar si eres candidata 💛";
}

function intento1() {
  return "Perfecto 💛 ¿Qué te gustaría mejorar hoy: grasa localizada, flacidez, volumen, celulitis o depilación láser?";
}

function CTA() {
  return `Para avanzar te dejo tu diagnóstico gratuito 💙\n${RESERVO}`;
}

function CTA2() {
  return `Aquí tienes acceso directo al diagnóstico 💙\n${RESERVO}`;
}

function pedirLlamada() {
  return "Si quieres, una profesional puede llamarte y ayudarte directamente 💛. ¿Deseas que te llamemos? 📞";
}

function pedirNumero() {
  return "Perfecto 💛 ¿Cuál es tu número de WhatsApp para coordinar la llamada?";
}

async function aviso(id, nombre, numero, ultimo, plan) {
  const txt =
`📞 Nueva paciente solicita llamada:
• Usuario: ${id}
• Nombre: ${nombre ?? "No disponible"}
• Número: ${numero}
• Plan consultado: ${plan ?? "No detectado"}
• Último mensaje: ${ultimo}`;

  await sendMessage(NUM_INTERNO, txt, "whatsapp");
}

// ----------------------------------------------------
// MOTOR PRINCIPAL
// ----------------------------------------------------
export async function procesarMensaje(texto, remitente, plataforma) {
  const t = texto.toLowerCase().trim();
  const u = getUser(remitente);
  setUser(remitente, { turnos: u.turnos + 1 });

  const planDetectado = detectarPlan(t);
  const intent = intencion(t);

  // -------------------------------
  // 1) Primer mensaje → campaña
  // -------------------------------
  if (!u.campañaUsada && planDetectado) {
    setUser(remitente, {
      campañaUsada: true,
      ultimoPlan: planDetectado,
      zona: planDetectado
    });
    return campaña(planDetectado);
  }

  // -------------------------------
  // 2) Esperando número
  // -------------------------------
  if (u.esperandoNumero) {
    const num = t.replace(/[^0-9]/g, "");
    if (num.length < 8) return "Parece que ese número está incompleto 💛 ¿Me lo envías nuevamente?";
    await aviso(remitente, null, num, texto, u.ultimoPlan);
    setUser(remitente, { esperandoNumero: false });
    return "Perfecto 💛 Una profesional te contactará lo antes posible 📞✨";
  }

  // -------------------------------
  // 3) Intenciones clínicas
  // -------------------------------
  if (intent === "explica" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return INFO[u.ultimoPlan].como + "\n\nSi quieres, reviso tu caso sin costo 💙";
  }

  if (intent === "precio" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return `El valor de ${u.ultimoPlan} es ${INFO[u.ultimoPlan].precio} 💙\nSi deseas, reviso cuántas sesiones necesitas 💛`;
  }

  if (intent === "sesiones" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return `En ${u.ultimoPlan} trabajamos entre ${INFO[u.ultimoPlan].sesiones} sesiones ✨\n¿Quieres que revise cuántas serían para tu caso? 💛`;
  }

  if (intent === "dolor" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return INFO[u.ultimoPlan].dolor + "\n\nSi quieres, te ayudo a ver si eres candidata 💛";
  }

  if (intent === "caro" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return INFO[u.ultimoPlan].valor + "\n\nSi deseas, te dejo el acceso al diagnóstico gratuito 💙";
  }

  if (intent === "ubicacion") return UBICACION;

  if (intent === "autoimagen") {
    return "Y está perfecto 💛 Los tratamientos funcionan igual si hay grasa o volumen. Lo importante es ver tu punto de partida para definir cuántas sesiones necesitas.\n¿Quieres que revisemos tu diagnóstico gratuito?";
  }

  if (intent === "ansiedad") {
    return "Es normal tener dudas 💛 Justamente por eso hacemos el diagnóstico gratuito: revisamos tu caso, tus objetivos y te explicamos qué plan funcionaría mejor para ti.\n¿Quieres avanzar?";
  }

  // -------------------------------
  // 4) Saludo inicial sin plan
  // -------------------------------
  if (!u.ultimoPlan && intent === "saludo") {
    return saludo();
  }

  // -------------------------------
  // 5) Flujo agenda
  // -------------------------------
  if (u.intentosAgenda === 0) {
    setUser(remitente, { intentosAgenda: 1 });
    return intento1();
  }

  if (u.intentosAgenda === 1) {
    setUser(remitente, { intentosAgenda: 2 });
    return CTA();
  }

  if (u.intentosAgenda === 2) {
    setUser(remitente, { intentosAgenda: 3 });
    return CTA2();
  }

  if (u.intentosAgenda === 3) {
    setUser(remitente, { intentosAgenda: 4 });
    return pedirLlamada();
  }

  if (u.intentosAgenda === 4) {
    if (t.includes("si") || t.includes("sí") || t.includes("ok") || t.includes("dale")) {
      setUser(remitente, { esperandoNumero: true });
      return pedirNumero();
    }
    return CTA2();
  }

  return intento1();
}
