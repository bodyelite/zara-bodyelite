// ======================================================
// BASE DE CONOCIMIENTO - BODY ELITE
// Compatible con Node.js v22 en Render
// ======================================================

import fs from "fs";

// Cargar archivo JSON con los planes
const rawData = fs.readFileSync(new URL("./planesData.json", import.meta.url));
const planesData = JSON.parse(rawData);

// Exportar objeto principal
export const planes = planesData;

// ======================================================
// ESTRUCTURA GENERAL DE RESPUESTAS CLÍNICAS Y COMERCIALES
// ======================================================

export const conocimientos = {
  saludo: `✨ Soy *Zara de Body Elite*. Qué gusto saludarte. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.`,

  fallback: `💛 Disculpa, no logré entender tu pregunta, pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.  
Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  faciales: `✨ Trabajamos tratamientos faciales como *Face Light, Face Smart, Face Elite* y *Full Face*.  
Estos planes usan tecnología *HIFU 12D, Radiofrecuencia, Pink Glow* y *LED Therapy*, que estimulan colágeno y mejoran la firmeza.  
💰 Valores desde $128.800 según el plan.  
Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  corporales: `🔥 Nuestros planes *Lipo* van desde *Lipo Focalizada Reductiva ($348.800)* hasta *Lipo Body Elite ($664.000)*.  
Incluyen tecnologías *HIFU 12D, Cavitación y Radiofrecuencia*, que reducen grasa localizada y tensan la piel sin dolor ni reposo.  
Agenda tu valoración gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  depilacion: `💫 *Depilación Láser Diodo* con tecnología *Alexandrita Triple Onda*.  
Elimina el vello desde la raíz sin dolor y es apta para todo tipo de piel.  
💰 Desde $35.000 por zona/sesión, con descuentos en planes combinados.  
Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  dolor: `🩵 Todos nuestros tratamientos son *no invasivos y sin dolor*.  
Solo puedes sentir una leve sensación térmica o contracción según la tecnología aplicada.  
Agenda tu evaluación gratuita para conocer cuál se adapta mejor a ti 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  precios: `💰 Los planes faciales comienzan desde *$120.000* y los corporales desde *$348.800*,  
incluyen diagnóstico gratuito con IA y orientación clínica personalizada.  
Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  direccion: `📍 *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (cerca de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30 a 20:00 / Sáb 9:30 a 13:00  
Agenda tu cita gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`
};

// Exportación final para motor_respuesta_v3.js
export default { planes, conocimientos };
