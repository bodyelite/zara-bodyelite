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
    info: "🔥 Plan de transformación total. Dura 8 a 10 semanas (29 proced.). Incluye: HIFU 12D, EMS Sculptor, Lipoláser... ¡Cambio real!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Tratamiento intensivo de 10 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan reductivo de 8 semanas. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real (8 semanas). Efecto gimnasio potente con EMS.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", dolor: "Contracciones musculares." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en 8 semanas.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox 4 semanas.", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "💎 Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Face Elite", precio: "$358.400", info: "✨ Pack alto impacto. Lifting sin cirugía.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Piel radiante en 6 pasos.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Olvídate de los pelos para siempre.", dolor: "Pinchacito leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, consultora experta de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

🚫 PROHIBICIONES ESTRICTAS (SI ROMPES ESTO, PIERDES):
1. **NUNCA des el Precio NI el Link en el primer mensaje** cuando te pregunten por un tratamiento.
2. **NUNCA vomites información.** Tus respuestas deben ser cortas (máximo 2 frases).

TU ESQUEMA DE CONVERSACIÓN (Sigue este orden):

1️⃣ **FASE 1: CONEXIÓN (El Cliente pregunta)**
   - Tu respuesta: Valida la elección y destaca un beneficio clave.
   - **Cierre:** Haz una pregunta abierta para generar interés.
   - *Ejemplo:* "¡La Limpieza Full es exquisita! ✨ Te deja la piel radiante en 6 pasos. ¿Hace mucho que no te haces una?"

2️⃣ **FASE 2: LA PROPUESTA (El Cliente responde)**
   - Tu respuesta: Conecta con su respuesta y AHORA SÍ das el precio y vendes la Evaluación con IA (gratis).
   - *Ejemplo:* "Entonces la vas a amar. El valor es $120.000 e incluye evaluación con IA de regalo 🎁. ¿Te gustaría reservar un cupo?"

3️⃣ **FASE 3: EL CIERRE (El Cliente acepta)**
   - Tu respuesta: Ofrece la doble opción.
   - *Ejemplo:* "¡Perfecto! ¿Prefieres auto-agendarte aquí (AGENDA_AQUI_LINK) o te llamamos para coordinar?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
