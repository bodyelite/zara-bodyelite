import fs from "fs";
import { sendMessage } from "./sendMessage.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMERO_INTERNO = "56937648536";

// ----------------------------------------------
// MEMORIA
// ----------------------------------------------
function cargarMemoria() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {} };
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch {
    return { usuarios: {} };
  }
}

function guardarMemoria(data) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const mem = cargarMemoria();
  if (!mem.usuarios[id]) {
    mem.usuarios[id] = {
      ultimoPlan: null,
      ultimoTema: null,
      zonaDetectada: null,
      intentosAgenda: 0,
      esperandoNumero: false,
      campañaUsada: false,
      turnos: 0
    };
    guardarMemoria(mem);
  }
  return mem.usuarios[id];
}

function setUser(id, data) {
  const mem = cargarMemoria();
  mem.usuarios[id] = { ...mem.usuarios[id], ...data };
  guardarMemoria(mem);
}

// ----------------------------------------------
// DETECCIÓN DE PLANES
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
  "musculo": "Body Fitness",
  "músculo": "Body Fitness",
  "marcar": "Body Fitness",
  "tonificar": "Body Fitness",
  "flacidez": "Body Tensor",
  "tensar": "Body Tensor"
};

function detectarPlan(t) {
  const x = t.toLowerCase();
  for (const k in PLANES) if (x.includes(k)) return PLANES[k];
  return null;
}

// ----------------------------------------------
// DETECCIÓN INTENCIÓN
// ----------------------------------------------
function detectarIntencion(txt) {
  const t = txt.toLowerCase();

  if (
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("funciona?") ||
    t.includes("en que consiste") ||
    t.includes("en qué consiste") ||
    t.includes("como trabajan") ||
    t.includes("cómo trabajan") ||
    t.includes("como lo hacen") ||
    t.includes("qué hace") ||
    t.includes("qué hacen") ||
    t.includes("funcionamiento")
  ) return "explicacion";

  if (t.includes("precio") || t.includes("vale") || t.includes("valor")) return "precio";

  if (t.includes("sesiones") || t.includes("cuantas") || t.includes("cuántas")) return "sesiones";

  if (t.includes("duele") || t.includes("dolor")) return "dolor";

  if (t.includes("caro") || t.includes("por qué tan caro")) return "caro";

  if (t.includes("donde") || t.includes("ubic") || t.includes("direc")) return "ubicacion";

  if (t.includes("hola") || t.includes("buenas")) return "saludo";

  return "general";
}

// ----------------------------------------------
// RESÚMENES CLÍNICOS
// ----------------------------------------------
const INFO = {
  "Lipo Express": {
    precio: "$432.000",
    sesiones: "8–10",
    dolor: "Es muy tolerable 💙, se siente calor y vibración suave.",
    comoFunciona: "La Lipo Express combina HIFU 12D para romper grasa profunda, cavitación para licuar adipocitos y radiofrecuencia para tensar piel. Reduce abdomen, cintura y espalda sin dolor significativo ✨.",
    valorExplicado: "El valor se debe a la combinación de HIFU 12D real, cavitación certificada y radiofrecuencia profunda. Son sesiones largas, dirigidas y con resultados visibles en pocas semanas 💙."
  },
  "Lipo Body Elite": {
    precio: "$664.000",
    sesiones: "10–12",
    dolor: "Es muy tolerable ✨.",
    comoFunciona: "Trabaja HIFU 12D + EMS Sculptor + cavitación + RF. Reduce grasa, marca abdomen y compacta tejidos.",
    valorExplicado: "Incluye HIFU 12D de alta precisión y EMS Sculptor real. Son tecnologías avanzadas que entregan resultados seguros y efectivos ✨."
  },
  "Push Up": {
    precio: "$376.000",
    sesiones: "8–10",
    dolor: "Contracciones intensas pero no dolorosas 🍑.",
    comoFunciona: "El Push Up combina Pro Sculpt (20.000 contracciones por sesión), HIFU 12D para firmeza profunda y Radiofrecuencia para compactar. Levanta, proyecta y define glúteo sin cirugía 🍑✨.",
    valorExplicado: "Se debe a que usamos Pro Sculpt real + HIFU 12D auténtico + RF profunda, guiado por profesionales. Son tecnologías de alto rendimiento con resultados rápidos 💛."
  },
  "Face Elite": {
    precio: "$358.400",
    sesiones: "8–10",
    dolor: "Leve calor y puntos sensibles 💆‍♀️.",
    comoFunciona: "HIFU 12D para firmeza, Pink Glow para regeneración y Radiofrecuencia para compactar y dar luminosidad.",
    valorExplicado: "Usa HIFU 12D real, Pink Glow original y RF profesional. Es un protocolo avanzado que da firmeza y lifting natural ✨."
  },
  "Depilación DL900": {
    precio: "Planes desde $153.600",
    sesiones: "6",
    dolor: "Pinchacito leve ⚡.",
    comoFunciona: "El DL900 es un láser diodo rápido, seguro y apto para piel latina. Debilita folículo desde raíz.",
    valorExplicado: "El DL900 es un equipo profesional certificado con mejores resultados en menos sesiones."
  },
  "Body Fitness": {
    precio: "$360.000",
    sesiones: "6–8",
    dolor: "No duele 💪.",
    comoFunciona: "EMS Sculptor activa musculatura profunda para tonificar y marcar abdomen y glúteo.",
    valorExplicado: "El EMS Sculptor real produce contracciones supramáximas que no se logran en gimnasio."
  },
  "Body Tensor": {
    precio: "$232.000",
    sesiones: "6–8",
    dolor: "Calorcito profundo 💛.",
    comoFunciona: "Radiofrecuencia profunda + tensores para mejorar flacidez en abdomen, brazos, piernas o papada.",
    valorExplicado: "La RF profesional logra estímulo real de colágeno I–III y tensado visible."
  }
};

// ----------------------------------------------
// PLANTILLAS
// ----------------------------------------------
const UBICACION =
"📍 Estamos en Av. Las Perdices Nº2990, Local 23 (Peñalolén)\n🕐 Lun–Vie 9:30–20:00 • Sáb 9:30–13:00";

function saludoInicial() {
  return "💙 ¡Hola! Soy Zara de Body Elite ✨ Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, piernas, rostro o depilación.";
}

function plantillaCampaña(plan) {
  const desc = {
    "Push Up": "🍑 El Push Up levanta, da volumen y mejora firmeza combinando Pro Sculpt + HIFU 12D + Radiofrecuencia.",
    "Lipo Express": "⚡ Lipo Express reduce grasa localizada en abdomen, cintura y espalda con HIFU 12D + cavitación + RF.",
    "Lipo Body Elite": "💙 Lipo Body Elite es nuestro plan más completo para cintura-abdomen-espalda.",
    "Face Elite": "✨ Face Elite mejora firmeza, contorno y luminosidad del rostro.",
    "Depilación DL900": "⚡ Láser diodo DL900 seguro, rápido y efectivo.",
    "Body Fitness": "💪 Tonificación profunda con EMS Sculptor.",
    "Body Tensor": "💛 Tratamiento tensor para flacidez con RF profunda."
  };
  return desc[plan] + "\n\n¿Quieres revisar si eres candidata? 💙";
}

function intento1() {
  return "Perfecto 💛 ¿Qué te gustaría mejorar hoy: grasa localizada, flacidez, volumen, celulitis o depilación láser?";
}

function link1() {
  return `Aquí tienes tu diagnóstico gratuito 💙\n${RESERVO_LINK}`;
}

function link2() {
  return `Acceso directo al diagnóstico 💙\n${RESERVO_LINK}`;
}

function pedirLlamada() {
  return "Si quieres, una profesional puede llamarte directamente 💛 ¿Te gustaría que te llamen? 📞";
}

function pedirTelefono() {
  return "Perfecto 💛 ¿Cuál es tu número de WhatsApp para coordinar la llamada?";
}

async function avisoInterno(id, nombre, numero, mensaje, plan) {
  const txt =
`📞 Nueva paciente solicita llamada:
• Usuario: ${id}
• Nombre: ${nombre ?? "No disponible"}
• Número: ${numero}
• Plan consultado: ${plan ?? "No detectado"}
• Último mensaje: ${mensaje}`;

  await sendMessage(NUMERO_INTERNO, txt, "whatsapp");
}

// ----------------------------------------------
// MOTOR PRINCIPAL
// ----------------------------------------------
export async function procesarMensaje(texto, plataforma, userId, nombre) {
  const t = texto.toLowerCase().trim();
  const u = getUser(userId);
  setUser(userId, { turnos: u.turnos + 1 });

  const planDetectado = detectarPlan(t);
  const int = detectarIntencion(t);

  // ------------------------------------------
  // 1) Primer mensaje → campaña
  // ------------------------------------------
  if (!u.campañaUsada && planDetectado) {
    setUser(userId, {
      ultimoPlan: planDetectado,
      zonaDetectada: planDetectado,
      campañaUsada: true
    });
    return plantillaCampaña(planDetectado);
  }

  // ------------------------------------------
  // 2) Esperando número
  // ------------------------------------------
  if (u.esperandoNumero) {
    const num = t.replace(/[^0-9]/g, "");
    if (num.length < 8) return "Parece que ese número está incompleto 💛 ¿Me lo envías nuevamente?";
    await avisoInterno(userId, nombre, num, texto, u.ultimoPlan);
    setUser(userId, { esperandoNumero: false });
    return "Perfecto 💛 Una profesional te contactará lo antes posible 📞✨";
  }

  // ------------------------------------------
  // 3) Intenciones técnicas
  // ------------------------------------------
  if (int === "explicacion" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return INFO[u.ultimoPlan].comoFunciona;
  }

  if (int === "caro" && u.ultimoPlan && INFO[u.ultimoPlan]) {
    return INFO[u.ultimoPlan].valorExplicado;
  }

  if (int === "precio") {
    if (u.ultimoPlan) return `El valor de ${u.ultimoPlan} es ${INFO[u.ultimoPlan].precio} 💙`;
    return "Para darte el valor exacto necesito saber qué zona quieres trabajar 💛";
  }

  if (int === "sesiones") {
    if (u.ultimoPlan) return `En ${u.ultimoPlan} trabajamos entre ${INFO[u.ultimoPlan].sesiones} sesiones ✨`;
    return "La cantidad de sesiones depende del plan 💛 ¿Qué zona deseas trabajar?";
  }

  if (int === "dolor") {
    if (u.ultimoPlan) return INFO[u.ultimoPlan].dolor;
    return "Nuestros tratamientos son muy tolerables 💙 ¿Qué te gustaría trabajar?";
  }

  if (int === "ubicacion") return UBICACION;

  // ------------------------------------------
  // 4) Saludo inicial
  // ------------------------------------------
  if (!u.ultimoPlan && int === "saludo") {
    return saludoInicial();
  }

  // ------------------------------------------
  // 5) Flujo agenda
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

  return intento1();
}
