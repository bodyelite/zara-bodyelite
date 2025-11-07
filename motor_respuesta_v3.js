import datos from "./base_conocimiento.js";
import memoria from "./memoria.js";
const { conocimientos } = datos;

export async function procesarMensaje(usuario, mensaje) {
  const texto = mensaje.toLowerCase().trim();
  const contexto = memoria.obtenerContexto(usuario);

  // --- MODO INTERNO ---
  if (texto.startsWith("zara")) {
    const consulta = texto.replace("zara", "").trim();
    return `🧠 *MODO INTERNO – ANÁLISIS CLÍNICO Y COMERCIAL*\n${consulta}\n\n— Fin del modo interno —`;
  }

  // --- SALUDO ---
  if (texto === "hola" || texto.startsWith("buen")) {
    memoria.guardarContexto(usuario, "inicio");
    return `✨ Soy *Zara de Body Elite*. Qué gusto saludarte.  
Cuéntame qué zona o tratamiento te gustaría mejorar y te orientaré con total honestidad clínica.`;
  }

  // --- DETECCIÓN PRINCIPAL ---
  if (
    texto.includes("grasa") || texto.includes("abdomen") ||
    texto.includes("muslos") || texto.includes("piernas") ||
    texto.includes("brazos") || texto.includes("glúteo") ||
    texto.includes("gluteos") || texto.includes("trasero") ||
    texto.includes("poto") || texto.includes("colita") ||
    texto.includes("levantar")
  ) {
    memoria.guardarContexto(usuario, "corporal");
    return `💛 Entiendo, muchas personas también buscan mejorar esa zona y suele deberse a grasa localizada o falta de tono muscular.  
✨ En esos casos usamos *HIFU 12D, Cavitación, Radiofrecuencia* y *EMS Sculptor* para reducir, levantar y tonificar.  
¿Tu objetivo es reducir, reafirmar o levantar?`;
  }

  // --- SEGUIMIENTO CORPORAL ---
  if (contexto === "corporal") {
    if (texto.includes("reducir")) {
      memoria.guardarContexto(usuario, "lipo");
      return `🔥 Para reducción trabajamos con *Lipo Body Elite* o *Lipo Express* (*HIFU 12D + Cavitación + RF*).  
💰 Desde $432.000.  
📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
    }
    if (texto.includes("reafirmar") || texto.includes("tonificar")) {
      memoria.guardarContexto(usuario, "tensor");
      return `💪 Para reafirmar o tonificar trabajamos con *Body Tensor* y *Body Fitness*, que combinan *HIFU 12D, RF tensora y EMS Sculptor*.  
Ideales tras pérdida de peso o postparto. Valor desde $232.000.`;
    }
    if (texto.includes("levantar") || texto.includes("glúteo") || texto.includes("poto") || texto.includes("trasero")) {
      memoria.guardarContexto(usuario, "gluteos");
      return `🍑 Perfecto. Para levantar y dar forma al glúteo utilizamos el plan *Push Up Glúteos*, que combina *EMS Sculptor + RF + HIFU tensor*.  
Genera más de 20.000 contracciones en 30 min y mejora firmeza visible desde la primera sesión.  
Valor desde $376.000.`;
    }
  }

  // --- PRECIOS SEGÚN CONTEXTO ACTIVO ---
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) {
    switch (contexto) {
      case "lipo":
        return `💰 El plan *Lipo Body Elite* tiene un valor desde $664.000 y *Lipo Express* desde $432.000.  
Ambos incluyen tecnologías *HIFU 12D, Cavitación y Radiofrecuencia* para reducción sin dolor.`;
      case "tensor":
        return `💰 *Body Tensor* (HIFU + RF tensora) desde $232.000 y *Body Fitness* desde $360.000, ideales para reafirmar o tonificar.`;
      case "gluteos":
        return `🍑 El *Push Up Glúteos* cuesta desde $376.000.  
Incluye *EMS Sculptor + RF + HIFU tensor*, logrando efecto lifting desde la primera sesión.`;
      case "facial":
        return `💆‍♀️ Los tratamientos faciales van desde *$128.800 (Face Light)* hasta *$358.400 (Face Elite)*, según objetivo y zona.`;
      case "toxina":
        return `💉 La aplicación de *Toxina Botulínica Facial* parte desde $95.000 por zona (frente, entrecejo o patas de gallo).`;
      default:
        return `💰 Los valores varían según zona y objetivo.  
Los corporales comienzan desde $232.000 y los faciales desde $128.800.  
La *evaluación es gratuita* para ajustar el plan exacto a tu presupuesto.`;
    }
  }

  // --- OBJECIONES ---
  if (texto.includes("caro") || texto.includes("precio alto")) {
    memoria.guardarContexto(usuario, "pregunta_precio");
    return `💬 Entiendo completamente, es normal comparar precios.  
Nuestros valores reflejan el uso de *HIFU 12D original, Cavitación clínica y protocolos personalizados con seguimiento profesional*.  
La *evaluación es gratuita* y adaptamos el plan a tu presupuesto.  
¿Quieres que te muestre una opción más acotada o por zona específica?`;
  }

  if (contexto === "pregunta_precio" && ["sí", "si", "dale", "quiero"].some(p => texto.includes(p))) {
    return `💛 Perfecto, en ese caso podrías considerar *Lipo Focalizada Reductiva* o *Body Tensor*, planes más cortos y accesibles con tecnología avanzada.`;
  }

  // --- UBICACIÓN / HORARIOS ---
  if (texto.includes("dónde") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return `📍 *Body Elite Estética Avanzada* está en *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (a pasos de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FRASES DE CIERRE ---
  if (["gracias","ok","perfecto","genial","vale","super"].some(p => texto.includes(p))) {
    return `✨ Me alegra poder ayudarte.  
Recuerda que la *evaluación es gratuita* y sin compromiso.  
Reserva tu hora aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FALLBACK ---
  return `💛 Disculpa, no logré entender tu mensaje.  
Nuestras profesionales podrán resolver todas tus dudas en la evaluación gratuita.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
