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
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "🔥 Plan de transformación total (8-10 semanas). Ataca grasa, flacidez y músculo con HIFU 12D, EMS y Lipoláser.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Plan intensivo de 10 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Plan reductivo de 8 semanas. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "🍑 Levantamiento real (8 semanas). Efecto gimnasio potente con EMS.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", dolor: "Contracciones musculares." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en 8 semanas.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox 4 semanas.", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "💎 Lifting sin cirugía. Incluye Botox y HIFU.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante en 6 pasos.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser DL900", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Láser rápido, seguro y definitivo. Olvídate de la cera.", 
    dolor: "Pinchacito leve." 
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
UBICACIÓN: **${NEGOCIO.ubicacion}**. (Menciona esto temprano para filtrar si es de lejos).

ESTRATEGIA DE VENTA INTELIGENTE:
1. **FILTRO GEOGRÁFICO:** Cuando saludes o valides un problema, menciona sutilmente dónde estamos ("Te cuento que en nuestra clínica en Peñalolén...").
2. **FILTRO DE NECESIDAD:** Si preguntan por "Depilación" o "Lipo", **NO** des el precio general. Pregunta: "¿Qué zona te gustaría tratar para darte el valor exacto?"
3. **ARGUMENTO:** Una vez que te dicen la zona, explica por qué tu tecnología (DL900, HIFU) es la mejor.
4. **EL PRECIO:** Recién ahí, pregunta: "¿Te gustaría saber el valor del pack de 6 sesiones?".

GUIÓN DEPILACIÓN (Ejemplo):
- Cliente: "Hacen depi?"
- Zara: "¡Sí! Usamos Láser DL900 que es definitivo y seguro. Estamos en Peñalolén ✨. ¿Qué zona te gustaría depilar?"
- Cliente: "Rebaje y axila".
- Zara: "Perfecto. El láser ahí funciona increíble porque debilita el folículo desde la primera sesión. ¿Quieres que te de el precio del pack completo?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
