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

  // --- EMPÁTICO: CORPORAL ---
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("muslos") || texto.includes("piernas") || texto.includes("brazos") || texto.includes("glúteos") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario, "corporal");
    return `💛 Entiendo, muchas personas también notan esa acumulación en esas zonas y suele deberse a grasa localizada que cuesta eliminar solo con ejercicio.  
✨ En esos casos trabajamos con tecnologías como *HIFU 12D, Cavitación y Radiofrecuencia*, que reducen volumen y tensan la piel sin dolor.  
Si me comentas tu objetivo (reducir, tonificar o definir), puedo orientarte con el plan corporal más indicado.`;
  }

  // --- EMPÁTICO: FACIAL ---
  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro") || texto.includes("papada")) {
    memoria.guardarContexto(usuario, "facial");
    return `💆‍♀️ La zona facial responde muy bien a tratamientos como *HIFU 12D, Radiofrecuencia y Pink Glow*, que estimulan colágeno y mejoran la firmeza sin cirugía.  
¿Tu objetivo es luminosidad, lifting o rejuvenecimiento?`;
  }

  // --- EMPÁTICO: DEPILACIÓN ---
  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila") || texto.includes("pierna completa")) {
    memoria.guardarContexto(usuario, "depilacion");
    return `💫 Nuestra *Depilación Láser Diodo Alexandrita triple onda* elimina el vello desde la raíz sin dolor, incluso en pieles sensibles.  
¿Cuáles zonas te interesaría tratar?`;
  }

  // --- EMPÁTICO: TOXINA ---
  if (texto.includes("botox") || texto.includes("toxina") || texto.includes("relleno")) {
    memoria.guardarContexto(usuario, "toxina");
    return `💉 La *Toxina Botulínica Facial* relaja los músculos responsables de las arrugas de expresión, dejando un aspecto natural y fresco.  
¿Te interesa en frente, entrecejo o patas de gallo?`;
  }

  // --- CONTEXTO CORPORAL ---
  if (contexto === "corporal") {
    if (texto.includes("reducir")) {
      return `🔥 Perfecto, para reducción trabajamos con *Lipo Body Elite* o *Lipo Express*, que combinan *HIFU 12D + Cavitación + RF*.  
💰 Valores desde $432.000.  
📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
    }
    if (texto.includes("tonificar") || texto.includes("definir")) {
      return `💪 Excelente, para tonificar o definir usamos *EMS Sculptor + Radiofrecuencia + Prosculpt*, logrando 20.000 contracciones musculares en 30 min.  
Ideal para abdomen, glúteos o piernas. Valor desde $360.000.  
¿Quieres que te indique cuánto dura cada sesión y la cantidad recomendada?`;
    }
    if (texto.includes("reafirmar")) {
      return `✨ Para reafirmar piel en zonas difíciles te recomiendo *Body Tensor* (HIFU + RF tensora).  
Ideal postparto o tras pérdida de peso. Valor desde $232.000.`;
    }
    if (texto.includes("cuánto demora") || texto.includes("duración") || texto.includes("sesión")) {
      return `🕓 Cada sesión corporal dura entre 40 y 60 minutos dependiendo de la zona.  
Normalmente se indican entre 6 y 8 sesiones para resultados visibles y sostenidos.`;
    }
  }

  // --- CONTEXTO FACIAL ---
  if (contexto === "facial") {
    if (texto.includes("lifting") || texto.includes("rejuvenecer") || texto.includes("antiage")) {
      return `🌸 Para lifting y rejuvenecimiento facial el indicado es *Face Elite* con *HIFU 12D + Toxina + Pink Glow*.  
Reafirma y suaviza arrugas profundas. Valor desde $358.400.`;
    }
    if (texto.includes("luminosidad") || texto.includes("hidratar")) {
      return `💧 Perfecto. En ese caso el *Face Light* con *Pink Glow* y *LED Therapy* mejora textura, hidratación y brillo natural. Valor $128.800.`;
    }
    if (texto.includes("cuántas sesiones") || texto.includes("sesiones")) {
      return `📅 Los tratamientos faciales suelen recomendar 4 a 6 sesiones según tipo de piel y objetivo clínico.  
Cada sesión dura entre 30 y 45 minutos.`;
    }
  }

  // --- CONTEXTO DEPILACIÓN ---
  if (contexto === "depilacion") {
    if (texto.includes("sesiones") || texto.includes("cuántas")) {
      return `🕓 En promedio se requieren 6 a 8 sesiones por zona para eliminar el vello con efectividad clínica.  
Contamos con descuentos por combinación de áreas.`;
    }
  }

  // --- CONTEXTO TOXINA ---
  if (contexto === "toxina") {
    if (texto.includes("frente") || texto.includes("entrecejo") || texto.includes("patas")) {
      return `💉 Perfecto. En esas zonas aplicamos microdosis precisas de *Toxina Botulínica*, logrando suavizar líneas sin alterar expresividad.  
Los resultados se aprecian en 3 a 5 días.`;
    }
  }

  // --- UBICACIÓN / HORARIOS ---
  if (texto.includes("dónde están") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return `📍 *Body Elite Estética Avanzada* está en *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (a pasos de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30 a 20:00 / Sáb 9:30 a 13:00.  
Puedes agendar directo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- FRASES DE CIERRE / AGRADECIMIENTO ---
  if (["gracias", "ok", "perfecto", "genial", "vale", "super", "bacan"].some(p => texto.includes(p))) {
    return `✨ Me alegra poder ayudarte.  
Recuerda que la *evaluación es gratuita* y sin compromiso, para que una profesional te oriente personalmente.  
Aquí puedes reservar tu hora 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  // --- PREGUNTAS GENERALES DE SESIONES / INCLUYE ---
  if (texto.includes("incluye") || texto.includes("qué trae") || texto.includes("qué hacen")) {
    return `🩵 Cada plan incluye una combinación personalizada de tecnologías (HIFU 12D, Cavitación, RF o EMS Sculptor) según diagnóstico inicial.  
El equipo clínico ajusta la intensidad y sesiones según tu biotipo y objetivo estético.`;
  }

  if (texto.includes("duele") || texto.includes("dolor")) return conocimientos.dolor;
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) return conocimientos.precios;

  // --- FALLBACK EMPÁTICO ---
  return `💛 Disculpa, no logré entender tu mensaje,  
pero nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.  
Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
