import fs from "fs";
import { sendMessage } from "./sendMessage.js";
import { NEGOCIO, TRATAMIENTOS } from "./config/knowledge_base.js";
import { isMobilePhone } from "./utils/utils.js"; // Importando desde la nueva utilidad

const MEMORIA_PATH = "./memoria.json";
const ADMIN_ALERTAS = NEGOCIO.staff_alertas; 

// ============================================================
// MEMORIA Y ESTADO GLOBAL DEL BOT (ON/OFF)
// ============================================================
function cargarMemoria() {
  try {
    if (!fs.existsSync(MEMORIA_PATH)) return { usuarios: {}, bot_activo: true };
    const data = JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
    if (data.bot_activo === undefined) data.bot_activo = true; 
    return data;
  } catch {
    return { usuarios: {}, bot_activo: true };
  }
}

function setBotState(newState) {
    const m = cargarMemoria();
    m.bot_activo = newState;
    guardarMemoria(m);
}

// ... (funciones getUser/setUser omitidas por brevedad, asumo que existen) ...
// Nota: Las funciones getUser/setUser necesitan ser importadas/definidas.

// Lógica de Alertas Múltiples
async function sendStaffAlerts(from, leadNumber, platform, textoOriginal) {
  const staff = ADMIN_ALERTAS;
  const leadSource = platform === "whatsapp" ? "WhatsApp" : "Instagram DM";
  
  const mensaje = `🚨 *NUEVO LEAD DE ${leadSource}* 🚨\n\n*Contacto:* ${from}\n*Número:* ${leadNumber}\n*Consulta:* "${textoOriginal.substring(0, 100)}..."\n\n✅ *¡CONTACTAR AHORA!*`;

  const promises = staff.map(num => sendMessage(num, mensaje, "whatsapp"));
  await Promise.all(promises);
}

// ============================================================
// LÓGICA DE RESPUESTA CENTRAL
// ============================================================
export async function procesarMensaje(texto, plataforma) {
  const t = texto.toLowerCase().trim();
  const userId = t.includes("ig") ? t.split(" ")[1] : "default_user"; 
  // Nota: Debe implementarse lógica getUser(userId) y setUser(userId, data)

  // -------------------------------------------------
  // COMANDOS INTERNOS DE CONTROL (ON/OFF)
  // -------------------------------------------------
  if (t === "zara off") {
      setBotState(false);
      return "🤖 *Modo PAUSA:* Me apago. Valentina, tienes el control. Para reactivar, escribe *ZARA ON*.";
  }

  if (t === "zara on") {
      setBotState(true);
      return "🟢 *Modo ACTIVO:* Me enciendo. Retomo las conversaciones. ¡A vender! (Escribe *ZARA OFF* para pausar).";
  }
  
  // -------------------------------------------------
  // CHECK DE ESTADO ACTIVO
  // -------------------------------------------------
  if (!cargarMemoria().bot_activo) {
      console.log("⚠️ Bot en pausa. Se ignora mensaje de cliente.");
      return ""; // No responder si está en pausa
  }
  
  // -------------------------------------------------
  // LÓGICA DE DETECCIÓN DE INTENCIÓN (Omitida por brevedad)
  // Nota: La lógica completa de conversación IA debe ser restaurada aquí.
  // -------------------------------------------------
  
  // -------------------------------------------------
  // SIMULACIÓN DE CAPTURA DE LEAD PARA PRUEBA
  // -------------------------------------------------
  if (isMobilePhone(t)) {
      const leadNumber = t.replace(/\s/g, ''); 
      await sendStaffAlerts(userId, leadNumber, plataforma, texto);
      return "¡Listo! 💙 Ya le pasé tu contacto a la especialista. Te llamaremos en breve. Por si acaso, aquí va el link de agenda directa: AGENDA_AQUI_LINK";
  }

  // FALLBACK GENÉRICO
  return "Gracias por tu mensaje. El bot está actualizado. Si necesitas ayuda con tratamientos o precios, pregunta por *Lipo Express* o *Face Elite*.";
}

// Nota: Las funciones getUser/setUser y la lógica de conversación IA del app.js
// deben ser movidas a este archivo o importadas para que el bot funcione.

// FIN DE ARCHIVO motor_respuesta_v3.js
