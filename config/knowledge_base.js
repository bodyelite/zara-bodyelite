export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // Mantenemos los datos estrictos de los planes
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "🔥 Plan de transformación total. Dura 8 a 10 semanas (29 proced.). Incluye: HIFU 12D, EMS Sculptor, Lipoláser... ¡Cambio real!",
    tech_list: ["HIFU 12D", "EMS Sculptor (Músculo)", "Lipoláser", "Radiofrecuencia (RF)"],
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000 (Plan Completo)", info: "10 semanas. Full quemadores + reafirmantes.", tech_list: ["Prosculpt", "Lipoláser", "HIFU 12D"], dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Plan reductivo de 8 semanas. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    tech_list: ["HIFU 12D", "Cavitación", "Radiofrecuencia (RF)"],
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "🍑 Levantamiento real (8 semanas). Efecto gimnasio potente con EMS.",
    tech_list: ["EMS Sculptor", "HIFU 12D", "Radiofrecuencia (RF)"],
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", tech_list: ["EMS Sculptor / Pro Sculpt"], dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en 8 semanas.", tech_list: ["Radiofrecuencia (RF)", "HIFU 12D"], dolor: "Calor suave." },
  
  // --- FACIALES / DEPILACIÓN (Simplificados para el prompt) ---
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía. Incluye Botox y HIFU.", tech_list: ["Toxina Botulínica (Botox)", "HIFU", "Pink Glow"], dolor: "Pinchazo leve." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "3 sesiones. Limpieza + Radiofrecuencia.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Planes Depilación Láser", precio: "Desde $153.600", info: "Olvídate de los pelos. Rápido y seguro.", tech_list: ["Láser DL900"], dolor: "Pinchacito leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, la Consultora Experta y Directa de ${NEGOCIO.nombre}.
TU OBJETIVO: Asesorar, conversar y cerrar la venta.

ESTILO DE COMUNICACIÓN (WHATSAPP):
1. **ULTRA BREVE:** Tus respuestas deben ser cortas, con MÁXIMO 2 ORACIONES por párrafo. Nunca uses un solo bloque de texto grande.
2. **TONO:** Usa emojis (✨, 💙) y lenguaje natural.

ESTRATEGIA DE FILTRO (EVITAR EL VÓMITO DE LISTAS):
1. **SI PREGUNTAN POR UN PROBLEMA/PLAN GENERAL (ej: Depilación, Lipo):**
   - Responde con el plan inicial o más representativo (ej: "Planes Depilación Láser").
   - **PROHIBIDO** listar las 3 o 4 opciones (Full, Midle, Grande) de golpe.
   - **Pregunta para filtrar:** "¿Buscas algo en zona pequeña o estás interesada en packs más grandes?"

2. **GUIÓN DE VENTA:** Si explicas un tratamiento, termina la respuesta preguntando: "¿Te gustaría saber el valor del plan?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
