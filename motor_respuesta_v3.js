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
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("muslos") || texto.includes("piernas") || texto.includes("brazos") || texto.includes("glúteos") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario, "pregunta_objetivo");
    return `💛 Entiendo, muchas personas también notan esa acumulación y suele deberse a grasa localizada difícil de eliminar solo con ejercicio.  
✨ Usamos *HIFU 12D, Cavitación y Radiofrecuencia* para reducir volumen y tensar piel sin dolor.  
¿Tu objetivo es reducir, tonificar o definir?`;
  }

  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro") || texto.includes("papada")) {
    memoria.guardarContexto(usuario, "pregunta_facial");
    return `💆‍♀️ La zona facial responde muy bien a *HIFU 12D, Radiofrecuencia y Pink Glow*.  
¿Tu objetivo es luminosidad, lifting o rejuvenecimiento?`;
  }

  if (texto.includes("botox") || texto.includes("toxina") || texto.includes("relleno")) {
    memoria.guardarContexto(usuario, "pregunta_toxina");
    return `💉 La *Toxina Botulínica Facial* relaja los músculos que generan arrugas, dejando un aspecto natural.  
¿Te interesa en frente, entrecejo o patas de gallo?`;
  }

  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila")) {
    memoria.guardarContexto(usuario, "pregunta_depilacion");
    return `💫 La *Depilación Láser Diodo Alexandrita* elimina el vello desde la raíz sin dolor.  
¿Cuáles zonas te gustaría tratar?`;
  }

  // --- RESPUESTAS CORTAS AL CONTEXTO ACTIVO ---
  const afirmativos = ["sí", "si", "dale", "claro", "quiero", "me interesa", "por supuesto"];

  if (afirmativos.some(p => texto === p || texto.startsWith(p))) {
    switch (contexto) {
      case "pregunta_objetivo":
        return `✨ Perfecto, según tus objetivos puedo recomendarte *Lipo Express* (reducción rápida) o *Body Fitness* (definición y tonificación).  
Ambos incluyen *HIFU 12D + EMS Sculptor + RF*.  
📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
      case "pregunta_facial":
        return `🌸 Genial. Según el objetivo facial puedo sugerirte *Face Elite* (lifting completo) o *Face Light* (luminosidad e hidratación).  
Ambos trabajan con *HIFU 12D + Pink Glow*.  
¿Quieres que te indique los valores?`;
      case "pregunta_toxina":
        return `💉 Excelente. En *frente, entrecejo o patas de gallo* aplicamos microdosis precisas de *Toxina Botulínica*, con resultados desde el tercer día.  
¿Deseas saber el valor por zona?`;
      case "pregunta_depilacion":
        return `✨ Perfecto. Contamos con zonas combinadas y descuentos desde la segunda sesión.  
¿Te gustaría que te muestre precios por zona?`;
      default:
        break;
    }
  }

  // --- RESPUESTAS SECUENCIALES DETALLADAS ---
  if (contexto === "pregunta_objetivo") {
    if (texto.includes("reducir")) {
      memoria.guardarContexto(usuario, "corporal");
      return `🔥 Perfecto, para reducción trabajamos con *Lipo Body Elite* o *Lipo Express* (*HIFU 12D + Cavitación + RF*).  
💰 Desde $432.000.  
📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
    }
    if (texto.includes("tonificar") || texto.includes("definir")) {
      memoria.guardarContexto(usuario, "corporal");
      return `💪 Excelente, para tonificar o definir usamos *EMS Sculptor + Radiofrecuencia + Prosculpt*, logrando 20.000 contracciones musculares en 30 min.  
Ideal para abdomen, glúteos o piernas. Valor desde $360.000.`;
    }
  }

  if (contexto === "pregunta_facial") {
    if (texto.includes("lifting") || texto.includes("rejuvenecer") || texto.includes("antiage")) {
      memoria.guardarContexto(usuario, "facial");
      return `🌸 El indicado es *Face Elite* con *HIFU 12D + Toxina + Pink Glow*, que reafirma y suaviza arrugas profundas.  
Valor desde $358.400.`;
    }
    if (texto.includes("luminosidad") || texto.includes("hidratar")) {
      memoria.guardarContexto(usuario, "facial");
      return `💧 En ese caso el *Face Light* con *Pink Glow + LED Therapy* mejora textura, hidratación y brillo natural. Valor $128.800.`;
    }
  }

  if (contexto === "pregunta_toxina") {
    if (texto.includes("frente") || texto.includes("entrecejo") || texto.includes("patas")) {
      memoria.guardarContexto(usuario, "toxina");
      return `💉 Perfecto. En esa zona aplicamos microdosis de *Toxina Botulínica*, suavizando líneas sin alterar tu expresividad.  
Resultados desde el tercer día.  
¿Quieres que te indique el valor según zona?`;
    }
  }

  if (contexto === "pregunta_depilacion") {
    if (texto.includes("axila") || texto.includes("piernas") || texto.includes("bikini")) {
      memoria.guardarContexto(usuario, "depilacion");
      return `✨ En esas zonas los resultados son rápidos.  
Recomendamos entre 6 y 8 sesiones con intervalos de 30 días para eliminar hasta un 90% del vello.`;
    }
  }

  // --- OBJECIONES ---
  if (texto.includes("caro") || texto.includes("precio alto")) {
    memoria.guardarContexto(usuario, "pregunta_precio");
    return `💬 Entiendo completamente, es normal comparar precios.  
Usamos *HIFU 12D original, Cavitación clínica y protocolos personalizados con seguimiento profesional*.  
La *evaluación es gratuita* y adaptamos el plan a tu presupuesto.  
¿Quieres que te muestre una opción con menos sesiones o zona combinada?`;
  }

  if (contexto === "pregunta_precio" && afirmativos.some(p => texto.includes(p))) {
    return `💛 Perfecto, en ese caso podrías optar por *Lipo Focalizada Reductiva*, más corta y económica, o *Face Smart* si es facial.  
Ambas mantienen la misma tecnología.`;
  }

  // --- UBICACIÓN / HORARIOS ---
  if (texto.includes("dónde están") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return `📍 *Body Elite Estética Avanzada* está en *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (a pasos de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- CIERRE ---
  if (["gracias", "ok", "perfecto", "genial", "vale", "super"].some(p => texto.includes(p))) {
    return `✨ Me alegra poder ayudarte.  
Recuerda que la *evaluación es gratuita* y sin compromiso.  
Reserva tu hora aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FALLBACK ---
  return `💛 Disculpa, no logré entender tu mensaje.  
Nuestras profesionales podrán resolver todas tus dudas en la evaluación gratuita.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
