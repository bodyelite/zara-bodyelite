import fs from "fs";
import { sendMessage } from "./sendMessage.js";
import { NEGOCIO, TRATAMIENTOS } from "./config/knowledge_base.js";
import { isMobilePhone } from "./utils.js";

const MEMORIA_PATH = "./memoria.json";
const RESERVO_LINK = NEGOCIO.agenda_link;
const ADMIN_ALERTAS = NEGOCIO.staff_alertas; // Lista de números para alerta

// ============================================================
// MEMORIA Y ESTADO GLOBAL DEL BOT (ON/OFF)
// ============================================================
function cargarMemoria() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {}, bot_activo: true };
    const data = JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
    if (data.bot_activo === undefined) data.bot_activo = true; // Valor por defecto
    return data;
  } catch {
    return { usuarios: {}, bot_activo: true };
  }
}

function guardarMemoria(m) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(m, null, 2));
}

function getBotState() {
    const m = cargarMemoria();
    return m.bot_activo;
}

function setBotState(newState) {
    const m = cargarMemoria();
    m.bot_activo = newState;
    guardarMemoria(m);
}

function getUser(id) {
  const m = cargarMemoria();
  if (!m.usuarios[id]) {
    m.usuarios[id] = {
      etapa: "inicio",
      zona: null,
      ultimoPlan: null,
      esperandoNumero: false,
      flujoCerrado: false,
    };
    guardarMemoria(m);
  }
  return m.usuarios[id];
}

function setUser(id, data) {
  const m = cargarMemoria();
  m.usuarios[id] = { ...m.usuarios[id], ...data };
  guardarMemoria(m);
}

// ============================================================
// ALERTAS DE LEAD MULTIPLES
// ============================================================
async function sendStaffAlerts(from, leadNumber, platform, textoOriginal) {
  const staff = ADMIN_ALERTAS;
  const leadSource = platform === "whatsapp" ? "WhatsApp" : "Instagram DM";
  
  const mensaje = `🚨 *NUEVO LEAD DE ${leadSource}* 🚨\n\n*Contacto:* ${from}\n*Número:* ${leadNumber}\n*Consulta:* "${textoOriginal.substring(0, 100)}..."\n\n✅ *¡CONTACTAR AHORA!* (Responde aquí para tomar el lead)`;

  console.log(`📡 Enviando alerta a ${staff.length} números de staff...`);
  
  // Enviamos la alerta a TODOS los números de la lista
  const promises = staff.map(num => sendMessage(num, mensaje, "whatsapp"));
  await Promise.all(promises);
}

// ============================================================
// LÓGICA DE RESPUESTA CENTRAL
// ============================================================
export async function procesarMensaje(texto, plataforma) {
  const t = texto.toLowerCase().trim();
  const userId = t.includes("ig") ? t.split(" ")[1] : "default_user"; // Simplificación para demo

  // -------------------------------------------------
  // COMANDOS INTERNOS DE CONTROL (ON/OFF)
  // -------------------------------------------------
  if (t === "zara off") {
      setBotState(false);
      return "🤖 *Modo PAUSA:* Me apago. Valentina, tienes el control de las respuestas. Para reactivar, escribe *ZARA ON*.";
  }

  if (t === "zara on") {
      setBotState(true);
      return "🟢 *Modo ACTIVO:* Me enciendo. Retomo las conversaciones automáticas. ¡A vender! (Si deseas pausar, escribe *ZARA OFF*).";
  }
  
  // -------------------------------------------------
  // CHECK DE ESTADO ACTIVO
  // -------------------------------------------------
  if (!getBotState() && plataforma !== "whatsapp") { // El switch solo afecta a IG/FB, WhatsApp puede ser solo para staff
      console.log("⚠️ Bot en pausa. Se ignora mensaje de cliente.");
      return ""; // No responder si está en pausa
  }
  
  const u = getUser(userId);
  
  // -------------------------------------------------
  // LÓGICA DE DETECCIÓN DE INTENCIÓN (Simplificada)
  // -------------------------------------------------

  // -------------------------------------------------
  // BÚSQUEDA DE PLANES
  // -------------------------------------------------
  let planEncontrado = Object.keys(TRATAMIENTOS).find(key => 
      t.includes(key.replace(/_/g, ' ')) || t.includes(TRATAMIENTOS[key].nombre.toLowerCase())
  );
  
  if (planEncontrado) {
      const plan = TRATAMIENTOS[planEncontrado];
      setUser(userId, { ultimoPlan: planEncontrado, etapa: "preagenda" });
      
      const respuesta = `✨ ¡Excelente elección! Nuestro plan *${plan.nombre}* es perfecto. \n\n${plan.info} \n\n*Valor:* ${plan.precio} \n*Sensación:* ${plan.dolor}\n\nPara ver si eres candidata y asegurar tus resultados, te recomiendo agendar tu evaluación GRATUITA: AGENDA_AQUI_LINK`;
      return respuesta;
  }
  
  // -------------------------------------------------
  // UBICACIÓN
  // -------------------------------------------------
  if (t.includes("ubicacion") || t.includes("donde estan") || t.includes("direccion")) {
    return `Estamos en 📍 ${NEGOCIO.ubicacion}. Atendemos de ${NEGOCIO.horarios}. ¡Te esperamos! ✨`;
  }

  // -------------------------------------------------
  // ETAPA PRE-AGENDA
  // -------------------------------------------------
  if (u.etapa === "preagenda" || t.includes("agenda") || t.includes("evaluacion")) {
    setUser(userId, { etapa: "agenda_1" });
    return "Si quieres ver si eres candidata y asegurar el cupo, aquí tienes tu diagnóstico gratuito: AGENDA_AQUI_LINK";
  }

  if (u.etapa === "agenda_1") {
    setUser(userId, { etapa: "agenda_2" });
    return "También puedo coordinar una llamada para ayudarte directo 💛 ¿Quieres que te llamemos? (Responde *SÍ* o *NO*)";
  }

  if (u.etapa === "agenda_2") {
    if (t.includes("si")) {
      setUser(userId, { esperandoNumero: true, etapa: "esperando_numero" });
      return "¡Perfecto! 💛 ¿Me compartes tu número de WhatsApp con código de país para coordinar la llamada? 📞";
    }
    return "Entendido. Recuerda que la evaluación es sin costo: AGENDA_AQUI_LINK";
  }

  // -------------------------------------------------
  // ESPERANDO NÚMERO (CAPTURANDO LEAD)
  // -------------------------------------------------
  if (u.etapa === "esperando_numero" || u.esperandoNumero) {
    if (isMobilePhone(t)) {
        const leadNumber = t.replace(/\s/g, ''); // Limpiar espacios
        
        // 💡 ALERTA ENVIADA A MÚLTIPLES NÚMEROS
        await sendStaffAlerts(userId, leadNumber, plataforma, texto);

        setUser(userId, { esperandoNumero: false, flujoCerrado: true, etapa: "cierre_lead" });
        return "¡Listo! Ya agendamos la llamada 📞 Una experta te llamará en breve. Por si acaso, aquí va el link de agenda directa: AGENDA_AQUI_LINK";
    }
    return "Disculpa, ¿podrías enviarme tu número completo con código de país, por favor? (Ej: 56912345678) 📲";
  }


  // -------------------------------------------------
  // FALLBACK FINAL (No sabe qué responder)
  // -------------------------------------------------
  if (u.etapa === "inicio") {
    setUser(userId, { etapa: "default_1" });
    return `¡Hola! Soy Zara, tu asesora de ${NEGOCIO.nombre}. ¿Qué plan o zona te gustaría mejorar? Así te ayudo con tu diagnóstico gratuito. ✨`;
  }

  return "Perdón, no entendí bien eso 🥺 ¿Me preguntas por un tratamiento, un precio o agendar? Te dejo el link si quieres ver disponibilidad: AGENDA_AQUI_LINK";
}

// Faltan utilidades y dependencias, pero esto encapsula la lógica central para el commit.
// Asumo que isMobilePhone está en ./utils.js
// y la lógica de getUser/setUser está arriba.

// FIN DE ARCHIVO motor_respuesta_v3.js
