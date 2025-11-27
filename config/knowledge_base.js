export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "🔥 Plan de transformación total. Dura aprox 8 a 10 semanas. Ataca grasa, flacidez y tonifica músculo. Es ideal para un cambio radical.",
    tech_list: ["HIFU 12D", "EMS Sculptor (Músculo)", "Lipoláser", "Radiofrecuencia (RF)"],
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Plan intensivo de 10 semanas. Full quemadores + reafirmantes.", tech_list: ["Prosculpt", "Lipoláser", "HIFU 12D"], dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Plan reductivo de 8 semanas. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    tech_list: ["HIFU 12D", "Cavitación", "Radiofrecuencia (RF)"],
    dolor: "Calor leve."
  },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento de glúteos en 8 semanas.", tech_list: ["EMS Sculptor", "HIFU 12D", "Radiofrecuencia (RF)"], dolor: "Contracción muscular fuerte." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", tech_list: ["EMS Sculptor / Pro Sculpt"], dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en 8 semanas.", tech_list: ["Radiofrecuencia (RF)", "HIFU 12D"], dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", tech_list: ["Lipolíticos", "RF"], dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox 4 semanas.", tech_list: ["Lipolítico", "HIFU Facial"], dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": { nombre: "Plan Face Elite (Con Botox)", precio: "$358.400", info: "Lifting sin cirugía. Incluye **Botox** y HIFU.", tech_list: ["Toxina Botulínica (Botox)", "HIFU", "Pink Glow"], dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", tech_list: ["Toxina", "RF", "HIFU", "Pink Glow"], dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", tech_list: ["Toxina (Botox)", "HIFU"], dolor: "Pinchazo leve." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000", info: "Pack de 3 Sesiones completas (3 Limpiezas + 3 Radiofrecuencias).", tech_list: ["Radiofrecuencia", "Limpieza Profunda"], dolor: "Relajante." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas de forma rápida.", tech_list: ["Toxina Botulínica"], dolor: "Pinchazo rápido." },
  
  // --- DEPILACIÓN (LA CLAVE ESTÁ AQUÍ) ---
  "depilacion_dl900": { nombre: "Planes Depilación Láser", precio: "Desde $153.600", info: "Tratamiento completo de 6 sesiones con Láser DL900.", tech_list: ["Láser DL900"], dolor: "Pinchacito leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, consultora experta de ${NEGOCIO.nombre}.
TU MISIÓN: Asesorar, dar certeza técnica y cerrar la cita.

🚨 REGLA DE ORO (VERDAD ABSOLUTA):
- **Si el cliente pregunta por un servicio que está en la lista TRATAMIENTOS (ej: Depilación, Botox), SIEMPRE debes confirmar que lo ofreces.** Nunca digas "no tenemos información" o "no ofrecemos". Tu fuente de verdad es la lista TRATAMIENTOS.

GUIÓN DE VENTA ESTRUCTURADO:
1️⃣ **INDAGACIÓN:** Si el cliente menciona un problema/tratamiento (ej: "tengo brazos sueltos" o "Lipo Express"), presenta la solución como concepto, no como precio. Pregunta: "¿Te gustaría saber el valor del plan?".
2️⃣ **PRECIO + CIERRE:** Al momento de agendar, da 2 opciones claras: Agendar tú misma (AGENDA_AQUI_LINK) o que te llamemos.
3️⃣ **FORMATO:** Usa listas con bullets/emojis (como te lo estoy mostrando). Escribe corto y con personalidad.

REGLAS TÉCNICAS:
- Fotos: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- Teléfono: "¡Nosotras te llamamos! 📲 Déjame tu número".
`;
