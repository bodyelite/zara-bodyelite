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
    info: "Nuestro plan más completo. Dura aprox 5 a 7 semanas. Incluye tecnología Full: RF, EMS Sculptor, Lipoláser y HIFU 12D.",
    dolor: "Calor profundo y trabajo muscular intenso (pero tolerable)."
  },
  "full_face": {
    nombre: "Full Face (Rejuvenecimiento Total)",
    precio: "$584.000",
    info: "Tratamiento integral de aprox 4 semanas. Incluye TODO: Botox, Pink Glow, HIFU Facial y más.",
    dolor: "Pinchazo leve y calorcito."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "Tratamiento intensivo de 4 a 6 semanas. Combina quemadores de grasa y reafirmantes.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "Plan rápido de 4 a 5 semanas. Ideal para reducir contorno y mejorar piel en poco tiempo. ✨",
    dolor: "Calor leve y contracción."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "Levantamiento de glúteos (Efecto Gimnasio). Dura aprox 4 a 5 semanas. Usa ondas electromagnéticas potentes.",
    dolor: "Se siente como haber hecho 1000 sentadillas (contracción fuerte)."
  },
  "body_fitness": {
    nombre: "Body Fitness (Tonificación)",
    precio: "$360.000",
    info: "Plan de 4 semanas enfocado 100% en marcar músculo y tonificar.",
    dolor: "Contracciones musculares."
  },
  "lipo_focalizada": {
    nombre: "Lipo Focalizada Reductiva",
    precio: "$348.800",
    info: "Tratamiento localizado de 3 a 4 semanas. Ataca directo la grasita difícil.",
    dolor: "Pinchazo leve (lipolítico) y calor."
  },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Plan específico para perfilado de rostro. Dura aprox 3 semanas.",
    dolor: "Pinchazo leve y calor."
  },
  "body_tensor": {
    nombre: "Body Tensor (Flacidez)",
    precio: "$232.000",
    info: "Plan de 3 a 4 semanas ideal para piernas o brazos que necesitan firmeza.",
    dolor: "Muy agradable, calor suave."
  },
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "Pack de alto impacto (incluye Botox). Se realiza en aprox 3 a 4 semanas. Lifting sin cirugía.",
    dolor: "Pinchazo leve."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Tratamiento antiarrugas express (incluye Botox). Aprox 2 a 3 semanas.",
    dolor: "Pinchazo leve."
  },
  "depilacion_grande": {
    nombre: "Depilación Zona Grande",
    precio: "$288.000",
    info: "Pack de 6 sesiones (1 vez al mes). Olvídate de los pelos para siempre. 🙅‍♀️",
    dolor: "Pinchacito leve."
  },
  "depilacion_full": {
    nombre: "Depilación Full",
    precio: "$259.200",
    info: "Pack de 6 sesiones mensuales (Láser 1).",
    dolor: "Pinchacito leve."
  },
  "botox": {
    nombre: "Botox (Toxina Botulínica)",
    precio: "Desde $120.000 por zona / Pack 3 zonas $260.000 (Sujeto a evaluación)",
    info: "Se realiza en 1 sesión (más control). Efecto en pocos días. Rostro descansado.",
    dolor: "Pinchazo rápido y leve."
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, la asistente virtual experta de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

PERSONALIDAD:
- Tono: Cercano, amable y profesional. Usa emojis (✨, 💙, 🌿).
- GÉNERO: Trata al usuario de forma NEUTRA (evita decir "hermosa", "linda", "amiga" a menos que el usuario te diga explícitamente que es mujer). Usa "Hola!", "¿Cómo estás?", "Te cuento que...".
- Sé visual y entretenida, pero sin exceso de confianza.

REGLAS CLAVE:
1. **Teléfono:** Si preguntan "¿dónde llamo?", di: "¡Nosotras te llamamos! 📲 Déjame tu número aquí y te contactamos enseguida".
2. **Tiempos:** Habla siempre de semanas aproximadas (ej: "4 a 6 semanas"), no de número de procedimientos.
3. **Anuncios:** Si el usuario llega preguntando por un tratamiento, véndeselo de inmediato.
4. **Venta:** Cierra invitando a la evaluación gratis: ${NEGOCIO.agenda_link}
`;
