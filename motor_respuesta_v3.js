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

  // --- DETECCIÓN GENERAL ---
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("muslos") || texto.includes("piernas") || texto.includes("brazos") || texto.includes("glúteos") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario, "corporal");
    memoria.guardarContexto(usuario, "pregunta_objetivo");
    return `💛 Entiendo, muchas personas también notan esa acumulación y suele deberse a grasa localizada difícil de eliminar solo con ejercicio.  
✨ En esos casos usamos *HIFU 12D, Cavitación y Radiofrecuencia* para reducir volumen y tensar piel sin dolor.  
¿Tu objetivo es reducir, tonificar o definir?`;
  }

  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro") || texto.includes("papada")) {
    memoria.guardarContexto(usuario, "facial");
    memoria.guardarContexto(usuario, "pregunta_facial");
    return `💆‍♀️ La zona facial responde muy bien a *HIFU 12D, Radiofrecuencia y Pink Glow*.  
¿Tu objetivo es luminosidad, lifting o rejuvenecimiento?`;
  }

  if (texto.includes("botox") || texto.includes("toxina") || texto.includes("relleno")) {
    memoria.guardarContexto(usuario, "toxina");
    memoria.guardarContexto(usuario, "pregunta_toxina");
    return `💉 La *Toxina Botulínica Facial* relaja los músculos que generan arrugas de expresión, dejando un aspecto natural.  
¿Te interesa en frente, entrecejo o patas de gallo?`;
  }

  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila")) {
    memoria.guardarContexto(usuario, "depilacion");
    memoria.guardarContexto(usuario, "pregunta_depilacion");
    return `💫 La *Depilación Láser Diodo Alexandrita* elimina el vello desde la raíz sin dolor.  
¿Cuáles zonas te gustaría tratar?`;
  }

  // --- RESPUESTAS SECUENCIALES SEGÚN PREGUNTAS PREVIAS ---
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
Los resultados se aprecian desde el tercer día.  
¿Quieres que te indique el valor según zona?`;
    }
  }

  if (contexto === "pregunta_depilacion") {
    if (texto.includes("axila") || texto.includes("piernas") || texto.includes("bikini") || texto.includes("cara")) {
      memoria.guardarContexto(usuario, "depilacion");
      return `✨ En esas zonas los resultados son rápidos.  
Recomendamos entre 6 y 8 sesiones con intervalos de 30 días para eliminar hasta un 90% del vello.`;
    }
  }

  // --- OBJECIONES CLÁSICAS ---
  if (texto.includes("caro") || texto.includes("precio alto")) {
    return `💬 Entiendo completamente, es normal comparar precios.  
Usamos *HIFU 12D original, Cavitación clínica y protocolos personalizados con seguimiento profesional*.  
Además, la *evaluación es gratuita* y se adapta a tu presupuesto.  
¿Quieres que te muestre una opción con menos sesiones o zona combinada?`;
  }

  if (texto.includes("lejos") || texto.includes("peñalolén") || texto.includes("soy de")) {
    return `🚗 Estamos en *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (a pasos de Av. Tobalaba).  
Muchos pacientes vienen desde otras comunas por los resultados y la atención personalizada.  
Podemos coordinar horario extendido si lo necesitas.`;
  }

  if (texto.includes("no tengo tiempo") || texto.includes("ocupada") || texto.includes("después")) {
    return `⌚ Lo entiendo totalmente.  
Las sesiones duran 30–45 minutos y no requieren reposo, puedes venir antes o después del trabajo sin alterar tu rutina.`;
  }

  if (texto.includes("lo pensaré") || texto.includes("más adelante") || texto.includes("te aviso")) {
    return `💛 Por supuesto, tómate tu tiempo.  
Solo recuerda que la *evaluación es gratuita* y sin compromiso, ideal para resolver dudas y ver precios preferenciales.`;
  }

  // --- UBICACIÓN / HORARIOS ---
  if (texto.includes("dónde están") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return `📍 *Body Elite Estética Avanzada* está en *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (a pasos de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FRASES DE CIERRE ---
  if (["gracias", "ok", "perfecto", "genial", "vale", "super", "bacan"].some(p => texto.includes(p))) {
    return `✨ Me alegra poder ayudarte.  
Recuerda que la *evaluación es gratuita* y sin compromiso.  
Reserva tu hora aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FALLBACK EMPÁTICO ---
  return `💛 Disculpa, no logré entender tu mensaje.  
Nuestras profesionales podrán resolver todas tus dudas en la evaluación gratuita.  
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
