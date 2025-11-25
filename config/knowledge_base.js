export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23 (Peñalolén)",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00"
};

export const TRATAMIENTOS = {
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "Pack reductor (8-10 sesiones). HIFU 12D + Cavitación + RF + Drenaje.",
    dolor: "Calor leve y vibración."
  },
  "lipo_body_elite": {
    nombre: "Lipo Body Elite",
    precio: "$664.000",
    info: "Pack premium (10-12 sesiones). Incluye todo lo de la Express + EMS Sculptor.",
    dolor: "Calor profundo, tolerable."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "Levantamiento de glúteos sin cirugía (8-10 sesiones). HIFU 12D + EMS.",
    dolor: "Contracciones musculares profundas."
  },
  "body_tensor": {
    nombre: "Body Tensor",
    precio: "$232.000",
    info: "Ideal para flacidez y celulitis en piernas o brazos (6-8 sesiones).",
    dolor: "Calor suave."
  },
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "Rejuvenecimiento facial (8-10 sesiones). Efecto lifting sin cirugía.",
    dolor: "Calor leve."
  },
  "depilacion": {
    nombre: "Depilación Láser DL900",
    precio: "desde $153.600",
    info: "Láser DL900 rápido y seguro (6 sesiones).",
    dolor: "Pinchacito leve."
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, asistente de Body Elite.
1. Tono: Empático, femenino y profesional (usa emojis 💙, ✨).
2. Da precios INMEDIATAMENTE si preguntan.
3. Termina invitando a agendar: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
4. Si preguntan lo mismo 3 veces, ofrece llamada humana.
`;
