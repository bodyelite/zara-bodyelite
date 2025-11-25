export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23 (Peñalolén). (Única sucursal)",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56931720760", "56983300262"] 
};

export const TRATAMIENTOS = {
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "Plan de 5 a 7 semanas. Incluye RF, EMS Sculptor, Lipoláser y HIFU 12D.",
    dolor: "Trabajo muscular intenso (tolerable)."
  },
  "full_face": {
    nombre: "Full Face (Rejuvenecimiento)",
    precio: "$584.000",
    info: "4 semanas aprox. Incluye TODO: Botox, Pink Glow, HIFU Facial y más.",
    dolor: "Pinchazo leve."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "4 a 6 semanas. Quemadores de grasa + reafirmantes.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "4 a 5 semanas. Reduce contorno y mejora piel rápido. ✨",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "Levantamiento de glúteos (Efecto Gimnasio). 4 a 5 semanas.",
    dolor: "Como hacer 1000 sentadillas."
  },
  "body_fitness": {
    nombre: "Body Fitness",
    precio: "$360.000",
    info: "4 semanas. Enfocado 100% en marcar músculo.",
    dolor: "Contracciones musculares."
  },
  "lipo_focalizada": {
    nombre: "Lipo Focalizada",
    precio: "$348.800",
    info: "3 a 4 semanas. Ataca directo la grasa localizada.",
    dolor: "Pinchazo leve."
  },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Perfilado de rostro. Aprox 3 semanas.",
    dolor: "Pinchazo leve."
  },
  "body_tensor": {
    nombre: "Body Tensor",
    precio: "$232.000",
    info: "3 a 4 semanas. Firmeza para piernas o brazos.",
    dolor: "Agradable."
  },
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "3 a 4 semanas. Pack alto impacto con Botox. Lifting sin cirugía.",
    dolor: "Pinchazo leve."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Antiarrugas express con Botox. 2 a 3 semanas.",
    dolor: "Pinchazo leve."
  },
  "depilacion_grande": {
    nombre: "Depilación Zona Grande",
    precio: "$288.000",
    info: "Pack 6 sesiones. Olvídate de los pelos. 🙅‍♀️",
    dolor: "Pinchacito leve."
  },
  "depilacion_full": {
    nombre: "Depilación Full",
    precio: "$259.200",
    info: "Pack 6 sesiones (Láser 1).",
    dolor: "Leve."
  },
  "botox": {
    nombre: "Botox (Toxina)",
    precio: "Desde $120.000/zona o Pack 3 zonas $260.000 (Evaluación)",
    info: "1 sesión. Rostro descansado en pocos días.",
    dolor: "Pinchazo rápido."
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

FORMATO DE RESPUESTA (ESTRICTO):
1. **BREVEDAD:** Tus respuestas deben ser CORTAS y visuales (máximo 30-40 palabras). En celular la gente no lee textos largos.
2. **FORMATO:** Usa listas cortas o párrafos de 2 líneas.
3. **LINK:** El link de agenda va SIEMPRE al final, solo.

REGLAS DE NEGOCIO:
- Teléfono: "¡Nosotras te llamamos! 📲 Déjame tu número aquí".
- Precios: Da el precio del PACK, no por sesión.
- Anuncios: Si preguntan por un plan, véndeselo directo.
- Link Agenda: ${NEGOCIO.agenda_link}
`;
