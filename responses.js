let ultimoTema = null;

export function obtenerRespuesta(texto) {
  if (!texto) return mensajeBase();

  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // --- Grupos de palabras clave ---
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

  // --- Respuestas clínicas ---
  if (coincide("celulitis")) {
    ultimoTema = "celulitis";
    return "💧 Para celulitis recomendamos *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa y mejorar firmeza. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("flacidez")) {
    ultimoTema = "flacidez";
    return "💧 Para flacidez recomendamos *Body Tensor* o *Body Elite*. Reafirman la piel con radiofrecuencia fraccionada y HIFU superficial. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("grasa")) {
    ultimoTema = "grasa";
    return "🔥 Para grasa localizada sugerimos *Lipo Express* o *Lipo Focalizada Reductiva*. Aplican HIFU 12D y Cavitación para eliminar grasa sin cirugía. 💰 Desde $348.800. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("tonificacion")) {
    ultimoTema = "tonificacion";
    return "🍑 Para tonificar y levantar recomendamos *Body Fitness* o *Push Up*. Usan EMS Sculptor y radiofrecuencia para fortalecer glúteos y muslos. 💰 Desde $360.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("arrugas")) {
    ultimoTema = "arrugas";
    return "✨ Para arrugas o rejuvenecimiento facial recomendamos *Face Antiage* o *Face Elite*. Combinan HIFU 12D, RF y Pink Glow para piel firme y luminosa. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("limpieza")) {
    ultimoTema = "limpieza";
    return "🫧 Para limpieza y control de acné, el plan ideal es *Limpieza Facial Full*. Incluye peeling ultrasónico, alta frecuencia y LED azul. 💰 $120.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("precio")) {
    return "💰 Nuestros planes van desde $60.000 (RF Facial) hasta $664.000 (Lipo Body Elite). 📅 Agenda tu diagnóstico gratuito para definir el ideal 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Explicaciones ampliadas según último tema ---
  if (coincide("curiosidad")) {
    if (ultimoTema === "flacidez") {
      return "🩵 *Body Tensor* reafirma desde la primera sesión. Combina HIFU superficial y radiofrecuencia fraccionada que estimulan colágeno y tensan la piel. Recomendamos 6 sesiones. No duele, solo genera calor controlado y una sensación firme. Resultados visibles desde la 3ª sesión. 📅 Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "grasa" || ultimoTema === "celulitis") {
      return "🔥 *Lipo Reductiva* o *Lipo Express* usan Cavitación e HIFU 12D para disolver grasa sin cirugía. Se siente un calor moderado, sin dolor. Cada sesión dura 60 minutos. Normalmente se indican entre 6 y 10 sesiones según diagnóstico. Los cambios se notan en 2-3 semanas. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "tonificacion") {
      return "💪 *Body Fitness* y *Push Up* emplean EMS Sculptor, que genera más de 20.000 contracciones musculares en 30 min. No duele, solo sientes el músculo activarse. Ideal para levantar y compactar glúteos. Se recomienda 6 sesiones, 2 por semana. 📅 Agenda tu diagnóstico 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "arrugas") {
      return "🌸 *Face Antiage* trabaja con HIFU 12D, RF y Pink Glow para regenerar colágeno profundo. No duele, se siente calor leve. Se recomienda 1 sesión mensual. Mejora textura, firmeza y luminosidad visible desde la primera aplicación. 📅 Agenda tu facial aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    if (ultimoTema === "limpieza") {
      return "🫧 *Limpieza Facial Full* desobstruye poros, elimina impurezas y mejora la oxigenación de la piel. No genera dolor ni enrojecimiento. Dura 45 min. Se recomienda cada 3-4 semanas. 📅 Reserva tu sesión 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }
    return "💬 Cada tratamiento tiene su propio número de sesiones y mecanismo. Cuéntame si buscas resultados faciales o corporales para explicarte mejor. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return mensajeBase();
}

// --- Mensaje genérico base ---
function mensajeBase() {
  return "💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
