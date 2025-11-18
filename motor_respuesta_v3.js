/* ============================================================
   MOTOR DE RESPUESTA ZARA v3 – UNIFICADO IG + WSP
   CLÍNICO + COMERCIAL + AGENDA + LLAMADO AUTOMÁTICO
   ============================================================ */

import fs from "fs";
import path from "path";
import { sendMessage } from "./sendMessage.js";

// ---------------------- RUTAS ----------------------
const memoriaPath = path.join(process.cwd(), "memoria_usuarios.json");
let memoria = {};
try {
  memoria = JSON.parse(fs.readFileSync(memoriaPath, "utf8"));
} catch (e) {
  memoria = {};
}

// ---------------------- LINK AGENDA ----------------------
const LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// ---------------------- GUARDAR MEMORIA ----------------------
function guardarMemoria() {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}

// ---------------------- NORMALIZAR ----------------------
function n(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ---------------------- CONTADOR DE AGENDA ----------------------
function registrarIntento(numero) {
  if (!memoria[numero]) memoria[numero] = { agendas: 0 };
  memoria[numero].agendas += 1;
  guardarMemoria();
}

function necesitaLlamado(numero) {
  return memoria[numero] && memoria[numero].agendas >= 3;
}

// ---------------------- NOTIFICAR LLAMADO A LOS TELÉFONOS INTERNOS ----------------------
async function notificar(numeroCliente, ultimoMensaje) {
  const msg = `📣 Nueva solicitud de llamada.\n• Número: ${numeroCliente}\n• Último mensaje: ${ultimoMensaje}`;
  await sendMessage("+56983300262", msg, "whatsapp");
  await sendMessage("+56937648536", msg, "whatsapp");
}

// ---------------------- RESPUESTAS CLÍNICAS ----------------------
function infoClinica(intent) {
  switch (intent) {
    case "pushup":
      return `🍑 *Push Up* levanta, afirma y da volumen usando:
• Pro Sculpt (20.000 contracciones por sesión)
• HIFU 12D para firmeza profunda
• Radiofrecuencia para compactar tejido  

✨ Resultado: glúteo más firme, redondo y proyectado sin cirugía.`;

    case "lipoexpress":
      return `🔥 *Lipo Express* trabaja abdomen/cintura/espalda combinando:
• HIFU 12D (grasa profunda)
• Cavitación (rompe adipocitos)
• Radiofrecuencia (compacta y define)  
  
✨ Reduce grasa localizada sin dolor significativo.`;

    case "liporeductiva":
      return `🔥 *Lipo Reductiva* combina HIFU 12D + Cavitación + RF profunda para reducción de volumen y moldeamiento real.`;

    case "bodytensor":
      return `✨ *Body Tensor* usa RF profunda + tensores para mejorar flacidez en abdomen, piernas, brazos o papada.`;

    case "depilacion":
      return `⚡ *Depilación DL900* (láser diodo oficial Body Elite).  
Rápido, seguro y elimina el vello desde la raíz. Sesiones cada 15 días.`;

    case "facial":
      return `✨ Tratamientos faciales disponibles:
• HIFU 12D (lifting sin cirugía)  
• Pink Glow (luminosidad + regeneración)  
• Exosomas (rejuvenecimiento avanzado)  
• Lipolítico facial (papada / contorno)  
• RF facial  
• Toxina botulínica (arrugas expresivas)`;
  }
  return null;
}

// ---------------------- DETECTAR INTENT ----------------------
function detectarIntent(texto) {
  const t = n(texto);

  if (t.includes("poto") || t.includes("glute") || t.includes("push"))
    return "pushup";

  if (t.includes("lipo express") || t.includes("abdomen") || t.includes("cintura"))
    return "lipoexpress";

  if (t.includes("reductiva") || t.includes("reduccion"))
    return "liporeductiva";

  if (t.includes("flacidez") || t.includes("tensor"))
    return "bodytensor";

  if (t.includes("depi") || t.includes("laser"))
    return "depilacion";

  if (
    t.includes("arruga") ||
    t.includes("botox") ||
    t.includes("hifu") ||
    t.includes("pink") ||
    t.includes("exosoma") ||
    t.includes("papada") ||
    t.includes("facial")
  )
    return "facial";

  return null;
}

// ---------------------- IG VS WSP ----------------------
function esInstagram(plataforma) {
  return plataforma === "instagram";
}

// ---------------------- TEXTO BASE IG ----------------------
function saludoIG() {
  return `💙 ¡Hola! Soy Zara de Body Elite. Cuéntame, ¿qué zona te gustaría mejorar? abdomen, glúteos, rostro, piernas o depilación ✨`;
}

// ---------------------- TEXTO BASE WSP ----------------------
function saludoWSP() {
  return `💙 ¡Hola! Soy Zara de Body Elite. Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, brazos, piernas o depilación.`;
}

// ======================================================================
//                         PROCESAR MENSAJE PRINCIPAL
// ======================================================================

export async function procesarMensaje(texto, numero, plataforma = "whatsapp") {
  const t = n(texto);
  const esIG = esInstagram(plataforma);

  // -------------------- SALUDOS --------------------
  if (
    t === "hola" ||
    t.startsWith("hol") ||
    t.includes("buenas") ||
    t.includes("oye")
  ) {
    return esIG ? saludoIG() : saludoWSP();
  }

  // -------------------- DETECTAR INTENT --------------------
  const intent = detectarIntent(texto);

  if (intent) {
    const descripcion = infoClinica(intent);
    registrarIntento(numero);

    let msg = `${descripcion}\n\n💙 Puedes agendar tu diagnóstico gratuito aquí:\n${LINK}`;

    if (necesitaLlamado(numero)) {
      msg += `\n\n📞 Si quieres, una profesional puede llamarte directo 💛 ¿Deseas que lo coordinemos?`;
    }

    return msg;
  }

  // -------------------- CÓMO FUNCIONA / EN QUÉ CONSISTE --------------------
  if (
    t.includes("como funciona") ||
    t.includes("en que consiste") ||
    t.includes("de que se trata") ||
    t.includes("como es")
  ) {
    registrarIntento(numero);

    let msg = `✨ Trabajamos con tecnologías reales de última generación:  
• HIFU 12D  
• Cavitación  
• Radiofrecuencia  
• EMS Sculptor  
• Pink Glow  
• Exosomas  
• Lipolítico facial  
• Láser DL900 para depilación  

Evaluamos tu punto de partida y armamos un plan exacto para ti.`;

    msg += `\n\n💙 Aquí tienes tu acceso al diagnóstico gratuito:\n${LINK}`;

    if (necesitaLlamado(numero)) {
      msg += `\n\n📞 Una profesional puede llamarte directo 💛 ¿Quieres que coordinemos?`;
    }

    return msg;
  }

  // -------------------- PREGUNTA POR LLAMADA --------------------
  if (
    t.includes("llamen") ||
    t.includes("llamada") ||
    t.includes("quiero que me llamen")
  ) {
    await notificar(numero, texto);
    return `Perfecto 💛 Una profesional te contactará lo antes posible 📞✨`;
  }

  // -------------------- ENTREGA DE NÚMERO --------------------
  if (t.includes("+56")) {
    await notificar(texto, texto);
    return `Perfecto 💛 Pasé tu número a una profesional para coordinar el llamado.`;
  }

  // -------------------- FALLBACK --------------------
  return `💙 Cuéntame, ¿qué objetivo te gustaría trabajar? reducción, firmeza, volumen, arrugas o depilación.`;
}
