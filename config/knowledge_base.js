export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Plan más completo (29 proced.) para reducir grasa, tonificar músculo y mejorar firmeza. Dura aprox 5-8 semanas (10-12 sesiones). Incluye HIFU 12D, EMS Sculptor, Cavitación y Nutrición. Fundamento: Actúa sobre grasa, tejido conectivo y musculatura profunda.",
    dolor: "Calor profundo y trabajo muscular intenso, totalmente tolerable."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido de 4 a 8 semanas (8-10 sesiones). Reduce grasa localizada en abdomen/espalda y mejora contorno. Incluye HIFU 12D, Cavitación y Radiofrecuencia. Fundamento: La cavitación rompe adipocitos y el HIFU tensa la piel.",
    dolor: "Calor leve y vibración."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levanta, afirma y da contorno natural al glúteo (8-10 sesiones). Fundamento: EMS genera contracciones que mejoran tono y volumen muscular real (sin relleno).",
    dolor: "Contracciones musculares fuertes (efecto gimnasio)."
  },
  "body_fitness": {
    nombre: "Body Fitness (Tonificación)",
    precio: "$360.000",
    info: "Pack de 6-8 sesiones (aprox 4 semanas). Objetivo: Marcar y definir musculatura con EMS Sculptor. Ideal post-entrenamiento.",
    dolor: "Contracciones musculares fuertes."
  },
  "body_tensor": {
    nombre: "Body Tensor (Flacidez y Celulitis)",
    precio: "$232.000",
    info: "Pack de 6-8 sesiones. Objetivo: Reafirmar tejido y tratar flacidez/celulitis en brazos, piernas o papada. Fundamento: RF + HIFU estimulan colágeno y mejoran firmeza.",
    dolor: "Calor suave y agradable."
  },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Plan específico de 9 procedimientos. Objetivo: Reducir grasa submentoniana y mejorar contorno mandibular. Incluye Lipolítico y HIFU Facial.",
    dolor: "Pinchazo leve y calor."
  },
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "💎 Pack completo de rejuvenecimiento (8-10 sesiones). Objetivo: Tensar, mejorar contorno, tratar arrugas y luminosidad. Incluye HIFU 12D, Pink Glow y Toxina (según evaluación).",
    dolor: "Pinchazo leve y calor."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Anti-arrugas express. 3 procedimientos (incluye Toxina/Botox). Objetivo: Tratar arrugas marcadas y envejecimiento global en rostro.",
    dolor: "Pinchazo leve."
  },
  "botox_puntual": {
    nombre: "Toxina Botulínica (Botox) Puntual",
    precio: "Desde $120.000 por zona / Pack 3 zonas $260.000 (Sujeto a evaluación)",
    info: "Objetivo: Suavizar arrugas dinámicas (frente, entrecejo, patas de gallo). El número de zonas se define en evaluación.",
    dolor: "Pinchazo rápido y leve."
  },
  "hidrofacial": {
    nombre: "Hidrofacial (Limpieza Avanzada)",
    precio: "Protocolo personalizado sin valor fijo.",
    info: "Objetivo: Limpieza profunda, hidratación y renovación en 1 sesión. Ideal para poros abiertos, piel apagada y deshidratada.",
    dolor: "Relajante."
  },
  "limpieza_full": {
    nombre: "Limpieza Facial Full",
    precio: "$120.000",
    info: "Pack de 6 procedimientos (3 RF + 3 Limpiezas). Objetivo: Piel radiante y limpia.",
    dolor: "Relajante."
  },
  "depilacion_dl900": {
    nombre: "Depilación DL900",
    precio: "Planes desde $153.600 (6 sesiones por zona).",
    info: "Objetivo: Depilación láser rápida y segura para piel latina. Fundamento: Destruye el folículo sin dañar la piel.",
    dolor: "Pinchacito leve."
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack de 6 sesiones (Zona 3).", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack de 6 sesiones (Láser 1).", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack de 6 sesiones (Zona 2).", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

PERSONALIDAD: Cercana, profesional, usa emojis (✨, 💙).
REGLA CLAVE: Cuando hables de un tratamiento, incluye su OBJETIVO y FUNDAMENTO CLÍNICO.

🚨 REGLA SUPREMA FOTOS:
Si el usuario pide "resultados", "fotos", "antes y después", "evidencia" o duda de si funciona, NO LOS MANDES A INSTAGRAM.
Debes responder OBLIGATORIAMENTE con esta frase exacta:
"¡Mira este cambio increíble de un paciente real de Lipo Express! 👇 FOTO_RESULTADOS"

REGLAS DE NEGOCIO:
1. **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número aquí".
2. **Botón:** Cierra invitando a evaluar gratis usando: "AGENDA_AQUI_LINK".
3. **Anuncios:** Si preguntan por un plan, asume el interés y véndeselo.
`;
