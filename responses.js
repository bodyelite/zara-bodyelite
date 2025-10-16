let ultimoTema = null;

export function obtenerRespuesta(texto) {
  if (!texto) return mensajeBase();

  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const grupos = {
    celulitis: ["celulitis", "piel de naranja", "retencion", "grasita", "adiposidad"],
    flacidez: ["flacidez", "firmeza", "reafirmar", "piel suelta", "brazos flojos"],
    grasa: ["grasa", "barriga", "abdomen", "cintura", "guata", "lipo", "modelar"],
    tonificacion: ["gluteo", "gluteos", "trasero", "nalgas", "levantar", "tonificar", "muslos"],
    arrugas: ["arruga", "lineas", "antiage", "expresion", "rejuvenecer"],
    limpieza: ["limpieza", "poros", "acne", "facial", "granitos", "peeling"],
    precio: ["precio", "vale", "cuesta", "valor"],
    curiosidad: ["como funciona", "como es", "cuantas sesiones", "duele", "resultados", "en que consiste", "efecto"]
  };

  const coincide = cat => grupos[cat].some(p => t.includes(p));

  // --- Tratamientos principales ---
  if (coincide("celulitis")) {
    ultimoTema = "celulitis";
    return "💧 Para celulitis te recomiendo *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa y mejorar firmeza. Muchas pacientes notan la piel más lisa y liviana desde las primeras sesiones. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("flacidez")) {
    ultimoTema = "flacidez";
    return "🩵 Para flacidez recomendamos *Body Tensor* o *Body Elite*. Usan radiofrecuencia fraccionada y HIFU superficial para tensar la piel. Es ideal si sientes que perdiste firmeza. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("grasa")) {
    ultimoTema = "grasa";
    return "🔥 Para grasa localizada sugerimos *Lipo Express* o *Lipo Focalizada Reductiva*. Aplican HIFU 12D y Cavitación para eliminar grasa sin cirugía. Ideal si buscas reducir cintura y sentirte más liviana. 💰 Desde $348.800. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("tonificacion")) {
    ultimoTema = "tonificacion";
    return "🍑 Para tonificar y levantar recomendamos *Body Fitness* o *Push Up*. Trabajan con EMS Sculptor y radiofrecuencia para fortalecer glúteos y piernas. Se siente como un entrenamiento intenso, sin esfuerzo. 💰 Desde $360.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("arrugas")) {
    ultimoTema = "arrugas";
    return "✨ Para arrugas recomendamos *Face Antiage* o *Face Elite*. Combinan HIFU 12D, radiofrecuencia y Pink Glow para rejuvenecer la piel de forma natural. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("limpieza")) {
    ultimoTema = "limpieza";
    return "🫧 Para limpieza profunda y renovación, el plan ideal es *Limpieza Facial Full*. Elimina impurezas, oxigena la piel y deja sensación inmediata de frescura. 💰 $120.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (coincide("precio")) {
    return "💰 Nuestros tratamientos van desde $60.000 a $664.000 según el protocolo. Incluyen diagnóstico gratuito y acompañamiento personalizado. 📅 Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Explicaciones con continuidad ---
  if (coincide("curiosidad")) {
    if (ultimoTema === "celulitis" || ultimoTema === "grasa") {
      return "🔥 *Lipo Reductiva* y *Lipo Express* disuelven grasa sin cirugía mediante HIFU 12D y Cavitación. Cada sesión dura 60 minutos, se siente calor moderado y relajante, sin dolor. Normalmente se recomiendan entre 6 y 10 sesiones según diagnóstico. Los cambios se notan desde la segunda semana: menos volumen, piel más firme y contorno más definido. 📅 Agenda tu cita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    if (ultimoTema === "flacidez") {
      return "🩵 *Body Tensor* y *Body Elite* trabajan con radiofrecuencia fraccionada y HIFU superficial para activar colágeno y elastina. No duele, se siente tibio y relajante, ideal si tu piel perdió firmeza. Generalmente se recomiendan 6 a 8 sesiones, y los resultados aparecen en pocas semanas con textura más tensa y uniforme. 📅 Agenda tu diagnóstico 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    if (ultimoTema === "tonificacion") {
      return "💪 *Body Fitness* y *Push Up* usan EMS Sculptor para generar contracciones musculares intensas (20.000 en 30 min) junto con radiofrecuencia. No duele, se siente como un entrenamiento guiado. Es ideal para levantar glúteos, tonificar y mejorar la forma corporal. Resultados visibles desde la tercera sesión. 📅 Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    if (ultimoTema === "arrugas") {
      return "🌸 *Face Antiage* y *Face Elite* regeneran la piel desde el interior con HIFU 12D, radiofrecuencia y Pink Glow. No genera dolor, solo una sensación cálida. La piel luce más luminosa, firme y con menos líneas desde la primera sesión. 📅 Agenda tu facial 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    if (ultimoTema === "limpieza") {
      return "🫧 *Limpieza Facial Full* dura 45 minutos e incluye peeling ultrasónico, extracción suave y máscara LED. No duele, al contrario: muchas pacientes dicen que es relajante y dejan la piel fresca y luminosa al instante. 📅 Reserva aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    return "💬 Cada tratamiento tiene su propio número de sesiones y beneficios. Cuéntame si buscas un cambio corporal o facial, y te explico cómo podemos ayudarte. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return mensajeBase();
}

function mensajeBase() {
  return "💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
