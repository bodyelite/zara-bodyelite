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

  // --- Respuestas clínicas + emocionales ---
  if (coincide("celulitis")) {
    ultimoTema = "celulitis";
    return "💧 Para celulitis te recomiendo *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa y mejorar firmeza. Muchas pacientes dicen que su piel se siente más lisa y liviana desde las primeras sesiones. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("flacidez")) {
    ultimoTema = "flacidez";
    return "🩵 Para flacidez sugerimos *Body Tensor* o *Body Elite*. Reafirman con radiofrecuencia fraccionada y HIFU superficial. La sensación es cálida y relajante, ideal si sientes que tu piel perdió firmeza. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("grasa")) {
    ultimoTema = "grasa";
    return "🔥 Para grasa localizada recomendamos *Lipo Express* o *Lipo Focalizada Reductiva*. Usan HIFU 12D y Cavitación para reducir grasa sin cirugía. Ayudan a marcar cintura, reducir volumen y sentirte más liviana y segura frente al espejo. 💰 Desde $348.800. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("tonificacion")) {
    ultimoTema = "tonificacion";
    return "🍑 Para tonificar y levantar recomendamos *Body Fitness* o *Push Up*. Trabajan con EMS Sculptor y radiofrecuencia para fortalecer glúteos y piernas. Se siente como un entrenamiento intenso sin esfuerzo, dejando la zona más firme y compacta. 💰 Desde $360.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("arrugas")) {
    ultimoTema = "arrugas";
    return "✨ Para arrugas y líneas de expresión recomendamos *Face Antiage* o *Face Elite*. Combinan HIFU 12D, RF y Pink Glow para regenerar la piel desde dentro. Ideal si buscas una piel más firme, natural y luminosa. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("limpieza")) {
    ultimoTema = "limpieza";
    return "🫧 Para una piel limpia y equilibrada, el plan ideal es *Limpieza Facial Full*. Elimina impurezas, oxigena la piel y deja una sensación de frescura inmediata. 💰 $120.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("precio")) {
    return "💰 Nuestros planes van desde $60.000 hasta $664.000 según el tratamiento. Todos incluyen diagnóstico gratuito y acompañamiento personalizado. 📅 Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Explicaciones profundas y empáticas ---
  if (coincide("curiosidad")) {
    if (ultimoTema === "flacidez") {
      return "💆‍♀️ *Body Tensor* y *Body Elite* estimulan el colágeno con radiofrecuencia fraccionada y HIFU superficial. No duele, se siente tibio y relajante, como un masaje firme. Desde las primeras sesiones notas más tensión y elasticidad. Es ideal si quieres volver a sentirte cómoda con tu piel. 📅 Agenda tu diagnóstico 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "grasa" || ultimoTema === "celulitis") {
      return "🔥 *Lipo Reductiva* y *Lipo Express* disuelven grasa sin cirugía con Cavitación e HIFU 12D. Cada sesión dura 60 min y se siente calor suave, sin molestias. En 2 a 3 semanas ya se nota menor volumen. Muchas pacientes cuentan que se sienten más livianas, con la ropa más suelta y más confianza en su cuerpo. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "tonificacion") {
      return "💪 *Body Fitness* y *Push Up* activan la musculatura profunda con EMS Sculptor (20.000 contracciones en 30 min). No duele, pero sientes cómo trabaja cada zona. Es ideal si buscas levantar glúteos, tonificar muslos o mejorar la forma general del cuerpo. Los resultados se notan visualmente y también en la postura y energía. 📅 Agenda tu cita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "arrugas") {
      return "🌸 *Face Antiage* regenera desde el interior con HIFU y Pink Glow. No hay dolor, solo una sensación tibia y confortable. Mejora textura, luminosidad y firmeza. Es perfecto si buscas verte más descansada y natural, sin perder tu expresión. 📅 Agenda tu facial 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "limpieza") {
      return "🫧 *Limpieza Facial Full* elimina impurezas y deja la piel fresca, suave y luminosa. No duele, al contrario: muchas pacientes dicen que es una experiencia relajante y revitalizante. Dura 45 minutos. 📅 Reserva tu limpieza 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    return "💬 Cada tratamiento tiene su propio número de sesiones y beneficios. Cuéntame si buscas un cambio corporal o facial y te explico cómo podríamos ayudarte. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return mensajeBase();
}

function mensajeBase() {
  return "💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
