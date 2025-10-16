let ultimoTema = null;

export function obtenerRespuesta(texto) {
  if (!texto) return mensajeBase();

  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const grupos = {
    celulitis: ["celulitis", "piel de naranja", "hoyuelos", "retencion", "grasita pierna", "adiposidad"],
    flacidez: ["flacidez", "firmeza", "reafirmar", "piel suelta", "brazos flojos", "muslo flacido", "colgando"],
    grasa: ["grasa", "barriga", "abdomen", "cintura", "pancita", "guata", "lipo", "modelar"],
    tonificacion: ["gluteo", "gluteos", "trasero", "nalgas", "levantar", "tonificar", "muslo", "pierna", "cadera", "fitness"],
    arrugas: ["arruga", "lineas", "expresion", "antiage", "envejecimiento", "rejuvenecer"],
    limpieza: ["limpieza", "puntos negros", "poros", "acne", "granitos", "peeling", "facial"],
    precio: ["precio", "vale", "cuesta", "costo", "valor", "tarifa"],
    curiosidad: ["como funciona", "como es", "cuantas sesiones", "duele", "resultados", "me explicas", "efecto", "sentir", "sensacion"],
  };

  const coincide = cat => grupos[cat].some(p => t.includes(p));

  // --- Respuestas principales ---
  if (coincide("celulitis")) {
    ultimoTema = "celulitis";
    return "💧 Para celulitis te recomiendo *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa y mejorar firmeza. Es ideal si notas piel con textura o retención. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("flacidez")) {
    ultimoTema = "flacidez";
    return "💧 Para flacidez sugerimos *Body Tensor* o *Body Elite*. Reafirman la piel con radiofrecuencia fraccionada y HIFU superficial. Ayudan a que la piel se sienta más firme, tensa y tonificada. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("grasa")) {
    ultimoTema = "grasa";
    return "🔥 Para grasa localizada recomendamos *Lipo Express* o *Lipo Focalizada Reductiva*. Usan HIFU 12D y Cavitación para reducir grasa sin cirugía. Ideal si buscas contorno más definido y sentirte más liviana. 💰 Desde $348.800. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("tonificacion")) {
    ultimoTema = "tonificacion";
    return "🍑 Para tonificar y levantar recomendamos *Body Fitness* o *Push Up*. Usan EMS Sculptor y radiofrecuencia para fortalecer glúteos y piernas, logrando una forma más compacta y firme. 💰 Desde $360.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("arrugas")) {
    ultimoTema = "arrugas";
    return "✨ Para arrugas y líneas recomendamos *Face Antiage* o *Face Elite*. Combinan HIFU 12D, RF y Pink Glow para tensar y regenerar la piel. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("limpieza")) {
    ultimoTema = "limpieza";
    return "🫧 Para limpieza facial profunda y control de acné, el plan ideal es *Limpieza Facial Full*. Desobstruye poros y deja la piel suave, luminosa y equilibrada. 💰 $120.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("precio")) {
    return "💰 Nuestros planes van desde $60.000 hasta $664.000 según el tipo de tratamiento. Todos incluyen diagnóstico gratuito y seguimiento personalizado. 📅 Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Explicaciones empático-clínicas ---
  if (coincide("curiosidad")) {
    if (ultimoTema === "flacidez") {
      return "🩵 *Body Tensor* trabaja con radiofrecuencia fraccionada y HIFU superficial. Desde las primeras sesiones la piel se nota más firme y suave. No duele, se siente cálido y relajante. Son 6 sesiones en promedio. Ayuda a recuperar confianza y gusto por verte al espejo. 📅 Agenda tu diagnóstico 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "grasa" || ultimoTema === "celulitis") {
      return "🔥 *Lipo Reductiva* y *Lipo Express* disuelven grasa sin cirugía con Cavitación e HIFU 12D. Cada sesión dura 60 min. Se siente calor controlado, sin dolor. En 2 a 3 semanas ya se nota menor volumen y firmeza. Más allá de lo estético, ayuda a sentirse más liviana y segura con el cuerpo. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "tonificacion") {
      return "💪 *Body Fitness* y *Push Up* activan los músculos con EMS Sculptor (20.000 contracciones en 30 min). No duele, solo sientes energía y contracción profunda. Es ideal para quienes quieren levantar y compactar glúteos, mejorando fuerza y autoestima. 6 sesiones recomendadas. 📅 Agenda tu cita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "arrugas") {
      return "🌸 *Face Antiage* regenera desde las capas profundas con HIFU y Pink Glow. No genera dolor, solo una sensación de calor suave. Mejora textura, luminosidad y expresión facial. Es el paso perfecto si buscas verte natural pero más firme. Resultados desde la primera sesión. 📅 Agenda tu facial 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "limpieza") {
      return "🫧 *Limpieza Facial Full* deja la piel libre de impurezas y más oxigenada. Dura 45 min y no duele. Sentirás la piel fresca y ligera desde el primer momento. Ideal para mantenerla sana y luminosa. 📅 Reserva tu limpieza 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    return "💬 Cada tratamiento tiene su propio número de sesiones y beneficios. Cuéntame si buscas un cambio corporal o facial y te explico cómo podríamos ayudarte. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return mensajeBase();
}

function mensajeBase() {
  return "💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
