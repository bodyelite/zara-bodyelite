import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// --- MEMORIA RAM (Se reinicia al desplegar) ---
const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 

// LINK DE FOTO DE RESULTADOS (Ya configurado con el de ImgBB)
const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg"; 

// --- UTILIDADES INTERNAS ---

function extraerTelefono(texto) {
  if (!texto) return null;
  // Detecta 8 o 9 dígitos, con o sin +569
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

// Horario: Lunes a Sábado de 09:30 a 19:00
function esHorarioLaboral() {
    const ahora = new Date();
    const horaChile = (ahora.getUTCHours() - 3 + 24) % 24; // Ajuste UTC-3
    const minutos = ahora.getUTCMinutes();
    const tiempoDecimal = horaChile + (minutos / 60);
    
    const dia = ahora.getDay(); // 0 = Domingo
    // Si es Domingo, NO es horario laboral
    if (dia === 0) return false;
    // Lunes a Sábado entre 9.5 (09:30) y 19.0 (19:00)
    return tiempoDecimal >= 9.5 && tiempoDecimal < 19; 
}

function obtenerCrossSell() {
    const tips = [
        "Oye, y por si te interesa, ¡también tenemos Depilación Láser DL900! ⚡️",
        "Dato extra: También hacemos Botox para complementar con el rostro ✨",
        "Recuerda que la evaluación incluye análisis facial con IA de regalo 🎁"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// --- ORQUESTADOR PRINCIPAL ---

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;
  let downloadHeaders = { "User-Agent": "ZaraBot/1.0" };

  // 1. EXTRACCIÓN DE DATOS
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    
    senderId = msg.from;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;

    if (msg.type === "text") {
        text = msg.text.body;
    } else if (msg.type === "audio" || msg.type === "voice") {
        const mediaId = msg.audio?.id || msg.voice?.id;
        const rawUrl = await getWhatsAppMediaUrl(mediaId);
        if (rawUrl) { 
            audioUrl = rawUrl; 
            // WhatsApp requiere Token para descargar
            downloadHeaders["Authorization"] = `Bearer ${process.env.PAGE_ACCESS_TOKEN}`; 
        }
    }
  } else { // Instagram
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return; // Ignoramos nuestros propios mensajes

    senderId = msg.sender.id;
    messageId = msg.message?.mid;
    senderName = "Usuario IG";

    if (msg.message?.text) {
        text = msg.message.text;
    } else if (msg.message?.attachments && msg.message.attachments[0].type === 'audio') {
        audioUrl = msg.message.attachments[0].payload.url;
    }
  }

  // 2. FILTROS DE SEGURIDAD (Anti-Spam)
  const ahora = Date.now();
  
  // Candado de Tiempo: Si respondimos hace menos de 5 seg, ignoramos (evita dobles)
  if ((ahora - (ultimasRespuestas[senderId] || 0)) < 5000) return;

  // Filtro de ID: Si ya procesamos este mensaje específico
  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) { 
      mensajesProcesados.add(messageId); 
      if (mensajesProcesados.size > 1000) mensajesProcesados.clear(); 
  }
  
  ultimasRespuestas[senderId] = ahora; // Marcamos que respondimos ahora

  // 3. PROCESAMIENTO DE AUDIO (Whisper)
  if (audioUrl) {
    try {
        const ext = platform === 'whatsapp' ? 'ogg' : 'm4a';
        const fileName = `audio_${senderId}_${Date.now()}.${ext}`;
        
        const filePath = await downloadFile(audioUrl, fileName, downloadHeaders);
        
        if (filePath) {
            const transcripcion = await transcribirAudio(filePath);
            fs.unlink(filePath, () => {}); // Borramos archivo temporal

            if (transcripcion) {
                text = transcripcion;
                console.log(`🎙️ Audio transcrito: "${text}"`);
            } else { 
                await sendMessage(senderId, "🎧 No escuché bien tu audio por el ruido. ¿Me lo escribes? 💙", platform); 
                return; 
            }
        } else { return; }
    } catch (e) { 
        console.error("Error audio:", e); 
        return; 
    }
  }

  if (!text) return; 

  const mensajeLower = text.toLowerCase().trim();

  // 4. CAPA DE CONTROL (Comandos Humanos)
  if (mensajeLower === "retomar" || mensajeLower === "zara on") { 
      usuariosPausados[senderId] = false; 
      await sendMessage(senderId, "🤖 Zara reactivada.", platform); 
      return; 
  }
  
  if (mensajeLower === "zara off" || mensajeLower === "silencio") { 
      usuariosPausados[senderId] = true; 
      console.log(`⏸️ Bot pausado para ${senderName}`);
      return; 
  }

  if (usuariosPausados[senderId]) return; // Si está pausado, no hace nada

  // Inicializar historial
  if (!sesiones[senderId]) sesiones[senderId] = [];

  // 5. CAPTURA DE LEADS (Prioridad Alta)
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    const enHorario = esHorarioLaboral();
    const estadoLlamada = enHorario ? "✅ LLAMAR AHORA" : "🌙 FUERA DE HORARIO - LLAMAR MAÑANA";
    
    // Alerta Simultánea a los 4 números
    const alerta = `🚨 *LEAD CAPTURADO* 🚨\n⏰ ${estadoLlamada}\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
    for (const numero of NEGOCIO.staff_alertas) {
        await sendMessage(numero, alerta, "whatsapp");
    }
    
    // Respuesta al Cliente
    let confirmacion = enHorario 
        ? "¡Perfecto! 💙 Ya le pasé tu número a las especialistas. Te llamaremos en unos minutos."
        : "¡Listo! 🌙 Ya guardé tu contacto. Como ya terminamos la jornada, te llamaremos mañana a primera hora.";

    const crossSell = obtenerCrossSell(); 
    const mensajeFinal = `${confirmacion}\n\n${crossSell}`;

    sesiones[senderId].push({ role: "assistant", content: mensajeFinal });
    await sendMessage(senderId, mensajeFinal, platform);
    return; // Cortamos flujo aquí
  }

  // 6. CEREBRO IA
  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  // 7. LOGICA DE FOTO (Keyword o IA)
  const pideFoto = mensajeLower.includes("foto") || mensajeLower.includes("resultado") || mensajeLower.includes("antes y") || mensajeLower.includes("ver cambio");
  const iaMandaFoto = respuestaIA.includes("FOTO_RESULTADOS");

  if (iaMandaFoto || pideFoto) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      
      // Enviamos texto primero (si hay)
      if (textoFinal) await sendMessage(senderId, textoFinal, platform);
      
      // Enviamos foto después (si el link es válido)
      await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      // Respuesta estándar
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}