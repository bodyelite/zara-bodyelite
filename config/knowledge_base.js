export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Plan más completo (29 proced.) para reducir grasa, tonificar músculo y mejorar firmeza. Dura aprox 5-8 semanas. Incluye HIFU 12D, EMS Sculptor, Cavitación y Nutrición.",
    dolor: "Calor profundo y trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido de 4 a 8 semanas (8-10 sesiones). Reduce grasa localizada y mejora contorno. Incluye HIFU 12D, Cavitación y Radiofrecuencia.",
    dolor: "Calor leve y vibración."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levanta, afirma y da contorno natural (8-10 sesiones). Fundamento: EMS genera contracciones que mejoran tono muscular real.",
    dolor: "Contracciones musculares fuertes (efecto gimnasio)."
  },
  "body_fitness": {
    nombre: "Body Fitness (Tonificación)",
    precio: "$360.000",
    info: "Pack de 6-8 sesiones (aprox 4 semanas). Objetivo: Marcar y definir musculatura con EMS Sculptor.",
    dolor: "Contracciones musculares fuertes."
  },
  "body_tensor": {
    nombre: "Body Tensor (Flacidez y Celulitis)",
    precio: "$232.000",
    info: "Pack de 6-8 sesiones. Objetivo: Reafirmar tejido en brazos, piernas o papada. Fundamento: RF + HIFU estimulan colágeno.",
    dolor: "Calor suave y agradable."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Pack de 21 procedimientos (4-6 semanas). Quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "3-4 semanas. Grasa localizada difícil.", dolor: "Pinchazo leve." },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Plan específico para perfilado de rostro. Incluye Lipolítico y HIFU Facial.",
    dolor: "Pinchazo leve y calor."
  },
  
  // --- FACIALES ---
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "💎 Pack completo de rejuvenecimiento (incluye Botox). Objetivo: Tensar, tratar arrugas y luminosidad.",
    dolor: "Pinchazo leve y calor."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Anti-arrugas express (incluye Toxina/Botox). Objetivo: Tratar arrugas marcadas.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "Rejuvenecimiento total (4 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_inicia": { nombre: "Face Inicia", precio: "$270.400", info: "Pack de inicio (RF, Pink Glow, HIFU).", dolor: "Suave." },
  "botox_puntual": {
    nombre: "Toxina Botulínica (Botox) Puntual",
    precio: "Desde $120.000 por zona / Pack 3 zonas $260.000 (Sujeto a evaluación)",
    info: "Objetivo: Suavizar arrugas dinámicas (frente, entrecejo, patas de gallo).",
    dolor: "Pinchazo rápido y leve."
  },
  "hidrofacial": {
    nombre: "Hidrofacial",
    precio: "Protocolo personalizado.",
    info: "Limpieza profunda, hidratación y renovación. Ideal poros abiertos.",
    dolor: "Relajante."
  },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Pack 6 pasos. Piel radiante.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": {
    nombre: "Depilación DL900",
    precio: "Planes desde $153.600 (6 sesiones).",
    info: "Láser rápido y seguro para piel latina. Destruye el folículo.",
    dolor: "Pinchacito leve."
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

DATOS ÚTILES (Úsalos si preguntan):
- 🚗 **Estacionamiento:** ¡Sí! Tenemos estacionamiento GRATIS en el Strip Center Las Pircas.
- 🚌 **Cómo llegar:** Si vienes en metro, baja en estación **Quilín** (L4) y sube a la micro **D17V**.
- 💳 **Pagos:** Aceptamos todo (Tarjetas, Transferencia, Efectivo). ⚠️ NO trabajamos con Fonasa ni Isapre (no reembolsable).

PERSONALIDAD: Cercana, profesional, usa emojis (✨, 💙). Habla de SEMANAS de duración.
REGLA CLAVE: Cuando hables de un tratamiento, incluye su OBJETIVO y FUNDAMENTO CLÍNICO.

REGLAS DE NEGOCIO:
1. **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número aquí".
2. **Botón:** Cierra invitando a evaluar gratis usando la frase: "AGENDA_AQUI_LINK".
3. **Anuncios:** Si preguntan por un plan, véndeselo directo.
`;
