export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23 (Peñalolén). (Única sucursal)",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Plan más completo (29 proced.) para reducir grasa, tonificar músculo y mejorar firmeza. Dura aprox 5-8 semanas. Incluye HIFU 12D, EMS Sculptor, Cavitación y Nutrición. Fundamento: Actúa sobre grasa, tejido conectivo y musculatura profunda.",
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
    nombre: "Body Fitness",
    precio: "$360.000",
    info: "Pack de 6-8 sesiones (aprox 4 semanas). Objetivo: Marcar y definir musculatura con EMS Sculptor.",
    dolor: "Contracciones musculares fuertes."
  },
  "body_tensor": {
    nombre: "Body Tensor",
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
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "Rejuvenecimiento total (4 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
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
Eres Zara, experta comercial de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

PERSONALIDAD (CAMALEÓNICA):
1. **ADAPTACIÓN:** Lee el tono del cliente. Si es formal, responde formal. Si usa modismos ("bkn", "wena"), relájate y sé más coloquial, pero siempre educada.
2. **BASE:** Tu tono por defecto es cercano, visual y con emojis (✨, 💙).

DATOS ÚTILES:
- 🚗 Estacionamiento GRATIS (Strip Center Las Pircas).
- 🚇 Metro Quilín + Micro D17V.
- 💳 Pagos: Todo medio de pago. NO Fonasa/Isapre.

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número aquí".
- **Cierre:** Ofrece DOBLE OPCIÓN: "¿Te gustaría agendarte tú misma en este link (AGENDA_AQUI_LINK) o prefieres que te llamemos para coordinar?"
`;
