// ============================
// MOTOR DE RESPUESTAS ZARA V3
// ============================

// CTA global
function CTA() {
  return "Reserva aquí tu diagnóstico gratuito:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";
}

// Mensaje inicial (hola / saludo)
function rSaludo() {
  return (
    "💙 Soy Zara de Body Elite.\n" +
    "¿En qué zona te gustaría trabajar? abdomen, glúteos, rostro, papada, piernas, brazos o depilación.\n\n" +
    CTA()
  );
}

// Planes
const PLANES = {
  "lipo express": {
    descripcion:
      "🔥 Lipo Express reduce abdomen, cintura y espalda con HIFU 12D + cavitación + radiofrecuencia compactante.",
    sesiones: "Generalmente entre 4 y 8 sesiones dependiendo del punto de partida.",
    precio: "Desde $432.000 el plan.",
  },
  "push up": {
    descripcion:
      "🍑 Push Up levanta, proyecta y reafirma glúteos con Pro Sculpt + HIFU 12D + radiofrecuencia.",
    sesiones: "De 6 a 12 sesiones según firmeza y volumen.",
    precio: "Planes desde $360.000.",
  },
  "body fitness": {
    descripcion:
      "💪 Body Fitness define cintura, abdomen y piernas con Pro Sculpt + cavitación + radiofrecuencia.",
    sesiones: "Entre 6 y 10 sesiones.",
    precio: "Planes desde $390.000.",
  },
};

// Respuesta a “¿qué es…?” o “¿en qué consiste?”
function rConsiste(plan) {
  plan = plan.toLowerCase();
  if (PLANES[plan]) {
    return (
      PLANES[plan].descripcion +
      "\n\n" +
      "¿Quieres que revisemos cuántas sesiones necesitas según tu caso?\n" +
      CTA()
    );
  }
  return null;
}

// Respuesta a precios
function rPrecio(plan) {
  plan = plan.toLowerCase();
  if (PLANES[plan]) {
    return (
      PLANES[plan].precio +
      "\n\n" +
      "Para darte el valor exacto según tu cuerpo:\n" +
      CTA()
    );
  }
  return null;
}

// Respuesta sesiones
function rSesiones(plan) {
  plan = plan.toLowerCase();
  if (PLANES[plan]) {
    return (
      PLANES[plan].sesiones +
      "\n\n" +
      "Lo más preciso es evaluarte con diagnóstico:\n" +
      CTA()
    );
  }
  return null;
}

// Depilación
function rDepilacion(zona) {
  return (
    "⚡ La depilación láser funciona excelente en " +
    zona +
    ".\nUsamos tecnología SHR segura para todos los tipos de piel.\n\n" +
    CTA()
  );
}

// Motor principal
export default function motor(texto) {
  const t = texto.toLowerCase();

  // SALUDO
  if (t.includes("hola") || t.includes("buenas") || t.includes("holi")) {
    return rSaludo();
  }

  // PREGUNTAS GENERALES POR PLANES
  if (t.includes("lipo express")) {
    if (t.includes("cuánto") || t.includes("vale") || t.includes("precio")) {
      return rPrecio("lipo express");
    }
    if (t.includes("sesion") || t.includes("sesiones") || t.includes("cuantas")) {
      return rSesiones("lipo express");
    }
    if (t.includes("consiste") || t.includes("qué es") || t.includes("funciona")) {
      return rConsiste("lipo express");
    }
    return rConsiste("lipo express");
  }

  if (t.includes("push up")) {
    if (t.includes("cuánto") || t.includes("vale") || t.includes("precio")) {
      return rPrecio("push up");
    }
    if (t.includes("sesion") || t.includes("sesiones") || t.includes("cuantas")) {
      return rSesiones("push up");
    }
    if (t.includes("consiste") || t.includes("qué es") || t.includes("funciona")) {
      return rConsiste("push up");
    }
    return rConsiste("push up");
  }

  if (t.includes("body fitness")) {
    if (t.includes("cuánto") || t.includes("vale") || t.includes("precio")) {
      return rPrecio("body fitness");
    }
    if (t.includes("sesion") || t.includes("sesiones") || t.includes("cuantas")) {
      return rSesiones("body fitness");
    }
    if (t.includes("consiste") || t.includes("qué es") || t.includes("funciona")) {
      return rConsiste("body fitness");
    }
    return rConsiste("body fitness");
  }

  // DEPILACIÓN
  if (t.includes("depilación") || t.includes("depilacion") || t.includes("láser") || t.includes("laser")) {
    let zona = "la zona que necesitas";
    if (t.includes("pierna")) zona = "piernas";
    if (t.includes("axila")) zona = "axilas";
    if (t.includes("bikini")) zona = "bikini";
    if (t.includes("brazo")) zona = "brazos";
    if (t.includes("rostro") || t.includes("cara")) zona = "rostro";
    return rDepilacion(zona);
  }

  // FALLBACK
  return (
    "💬 No logré entender exactamente tu consulta, pero puedo ayudarte.\n" +
    "¿Qué zona te gustaría mejorar?\n\n" +
    CTA()
  );
}
