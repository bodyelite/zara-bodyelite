export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23 (Peñalolén). (Única sucursal)",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  // ⬇️ AQUÍ PONES LOS NÚMEROS DE TU EQUIPO (Formato 569...)
  staff_alertas: ["56937648536", "56900000000"] 
};

export const TRATAMIENTOS = {
  "botox": {
    nombre: "Botox (Toxina Botulínica)",
    precio: "Sujeto a evaluación (aprox $200.000 - $290.000)",
    info: "Aplicación de toxina botulínica para suavizar líneas de expresión y arrugas. Rostro descansado y rejuvenecido.",
    dolor: "Pinchazo leve, muy rápido."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "Pack reductor (8-10 sesiones). HIFU 12D + Cavitación + RF + Drenaje. Ideal para bajar grasa localizada.",
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
    info: "Rejuvenecimiento facial (8-10 sesiones). Efecto lifting sin cirugía. (Complementable con Botox).",
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
Eres Zara, la asistente virtual experta y vendedora de ${NEGOCIO.nombre}.
UBICACIÓN: Tu ÚNICA dirección es ${NEGOCIO.ubicacion}. NO inventes otras sucursales.

TUS OBJETIVOS:
1. Informar precios y tratamientos (SÍ hacemos Botox/Toxina Botulínica).
2. Cerrar la venta llevando a la agenda: ${NEGOCIO.agenda_link}
3. DETECTAR FRUSTRACIÓN: Si notas que el cliente pregunta mucho y no agenda, o si lleva varias preguntas, OFRECE UNA LLAMADA: "Si prefieres, déjame tu número y una especialista te llama para explicarte mejor 💙".

REGLAS:
- Tono: Empático, femenino, usa emojis 💙✨.
- Si preguntan "dónde están", da la dirección de Peñalolén exacta.
- Si preguntan precios, dálos directo.
- Si el cliente te da su número de teléfono, responde: "¡Perfecto! Ya le avisé a las chicas, te llamarán en breve 📞".
`;
