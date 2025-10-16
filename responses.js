export function obtenerRespuesta(texto) {
  if (!texto) return '💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';

  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Listas de palabras clave agrupadas
  const grupos = {
    celulitis: ["celulitis", "piel de naranja", "hoyuelos", "grasita pierna", "adiposidad", "retencion"],
    flacidez: ["flacidez", "piel suelta", "colgando", "firmeza", "reafirmar", "muslo flacido", "brazos flojos"],
    grasa: ["grasa", "barriga", "abdomen", "cintura", "pancita", "guata", "reductor", "lipo", "modelar"],
    tonificacion: ["gluteo", "gluteos", "trasero", "nalgas", "levantar", "tonificar", "muslo", "pierna", "cadera", "fitness"],
    arrugas: ["arruga", "lineas", "expresion", "antiage", "envejecimiento", "rejuvenecer"],
    limpieza: ["limpieza", "puntos negros", "poros", "acne", "granitos", "peeling", "facial"],
    precio: ["precio", "vale", "cuesta", "costo", "valor", "tarifa"],
  };

  // Función para verificar coincidencias
  const coincide = categoria => grupos[categoria].some(p => t.includes(p));

  // Respuestas
  if (coincide("celulitis")) {
    return '💧 Para celulitis recomendamos *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa y mejorar firmeza. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("flacidez")) {
    return '💧 Para flacidez recomendamos *Body Tensor* o *Body Elite*. Reafirman la piel con radiofrecuencia fraccionada y HIFU superficial. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("grasa")) {
    return '🔥 Para grasa localizada sugerimos *Lipo Express* o *Lipo Focalizada Reductiva*. Aplican HIFU 12D y Cavitación para eliminar grasa sin cirugía. 💰 Desde $348.800. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("tonificacion")) {
    return '🍑 Para tonificar y levantar recomendamos *Body Fitness* o *Push Up*. Usan EMS Sculptor y radiofrecuencia para fortalecer glúteos y muslos. 💰 Desde $360.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("arrugas")) {
    return '✨ Para arrugas o rejuvenecimiento facial recomendamos *Face Antiage* o *Face Elite*. Combinan HIFU 12D, RF y Pink Glow para piel firme y luminosa. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("limpieza")) {
    return '🫧 Para limpieza y control de acné, el plan ideal es *Limpieza Facial Full*. Incluye peeling ultrasónico, alta frecuencia y LED azul. 💰 $120.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (coincide("precio")) {
    return '💰 Nuestros planes van desde $60.000 (RF Facial) hasta $664.000 (Lipo Body Elite). 📅 Agenda tu diagnóstico gratuito para definir el ideal 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  // Respuesta genérica
  return '💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
}
