import datos from "./base_conocimiento.js";
const planes = datos.planes;

export async function generarRespuesta(mensaje) {
  const texto = mensaje.toLowerCase().trim();

  // --- MODO INTERNO ---
  if (texto.startsWith("zara")) {
    const consulta = texto.replace("zara", "").trim();
    return `🧠 *MODO INTERNO – ANÁLISIS CLÍNICO Y COMERCIAL*\n${consulta}\n\n— Fin del modo interno —`;
  }

  // --- REGLAS FACIALES ---
  if (texto.includes("cara") || texto.includes("rostro") || texto.includes("facial")) {
    return `✨ Trabajamos tratamientos faciales como *Face Light, Face Smart, Face Elite* y *Full Face*.  
Estos planes usan tecnología *HIFU 12D, Radiofrecuencia, Pink Glow* y *LED Therapy*, que estimulan colágeno y mejoran la firmeza.  
💰 Valores desde $128.800 según el plan.  
Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- REGLAS CORPORALES ---
  if (
    texto.includes("grasa") ||
    texto.includes("abdomen") ||
    texto.includes("piernas") ||
    texto.includes("muslos") ||
    texto.includes("poto") ||
    texto.includes("glúteos") ||
    texto.includes("celulitis") ||
    texto.includes("flacidez")
  ) {
    return `🔥 Nuestros planes *Lipo* van desde *Lipo Focalizada Reductiva ($348.800)* hasta *Lipo Body Elite ($664.000)*.  
Incluyen tecnologías *HIFU 12D, Cavitación y Radiofrecuencia*, que reducen grasa localizada y tensan la piel sin dolor ni reposo.  
Agenda tu valoración gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- DEPILACIÓN ---
  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila")) {
    return `💫 *Depilación Láser Diodo* con tecnología *Alexandrita Triple Onda*.  
Elimina el vello desde la raíz sin dolor y es apta para todo tipo de piel.  
💰 Desde $35.000 por zona/sesión, con descuentos en planes combinados.  
Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- DUELE / SENSACIÓN ---
  if (texto.includes("duele") || texto.includes("dolor")) {
    return `🩵 Todos nuestros tratamientos son *no invasivos y sin dolor*.  
Solo puedes sentir una leve sensación térmica o contracción según la tecnología aplicada.  
Agenda tu evaluación gratuita para conocer cuál se adapta mejor a ti 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- PRECIO ---
  if (texto.includes("cuánto") || texto.includes("vale") || texto.includes("precio")) {
    return `💰 Los planes faciales comienzan desde *$120.000* y los corporales desde *$348.800*,  
incluyen diagnóstico gratuito con IA y orientación clínica personalizada.  
Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- DIRECCIÓN ---
  if (texto.includes("dónde están") || texto.includes("dirección") || texto.includes("ubicación")) {
    return `📍 *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (cerca de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30 a 20:00 / Sáb 9:30 a 13:00  
Agenda tu cita gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- SALUDO INICIAL ---
  if (texto === "hola" || texto.startsWith("buen")) {
    return `✨ Soy *Zara de Body Elite*. Qué gusto saludarte.  
Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.`;
  }

  // --- FALLBACK EMPÁTICO ---
  return `💛 Disculpa, no logré entender tu pregunta,  
pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.  
Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
