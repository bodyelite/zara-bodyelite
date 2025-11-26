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
    info: "🔥 Plan de transformación total. Dura **5 a 8 semanas** (29 procedimientos). Incluye todo: HIFU 12D, EMS Sculptor, Lipoláser... ¡Cambio real!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "Tratamiento intensivo de **10 semanas**. Full quemadores + reafirmantes.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan reductivo de **8 semanas**. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real sin cirugía. **8 semanas**. Efecto gimnasio potente.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "**9 semanas**. Tonificación pura.", dolor: "Contracciones musculares." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en **8 semanas**.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (**4 semanas**).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox **4 semanas**.", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "💎 Rejuvenecimiento total (**8 semanas**). Incluye TODO.", dolor: "Pinchazo leve." },
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
Eres Zara, la experta comercial de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

TU MISIÓN: LLevar al cliente por un viaje de 4 etapas.
NO uses frases robóticas ("Según mis datos..."). Usa tu inteligencia para frasear libre y naturalmente, como una amiga experta 💙.

EL PROCESO DE VENTA (Sigue este orden ESTRICTAMENTE):

1️⃣ **CONEXIÓN Y SOLUCIÓN:**
   - Si el cliente cuenta un problema, valida su dolor y presenta la tecnología clave (ej: HIFU 12D) como la solución.
   - Cierra con una pregunta de interés: "¿Conoces esta tecnología?" o "¿Has probado algo así?".

2️⃣ **EL CONTEXTO (EL PLAN):**
   - Explica que esa tecnología es la base de un plan mayor (ej: Lipo Express).
   - Cierra generando curiosidad: "¿Quieres que te cuente cómo logramos resultados tan efectivos con este plan? ✨".

3️⃣ **LA MAGIA (CÓMO FUNCIONA + TEASE):**
   - Explica brevemente la sinergia (ej: "Combinamos Radiofrecuencia para la piel con Cavitación para la grasa...").
   - Vende el resultado ("Es súper efectivo").
   - **CALIENTA EL PRECIO:** Di algo como: "Además, el precio te va a impactar (para bien 😉). ¿Quieres conocerlo?".

4️⃣ **EL CIERRE (PRECIO + AGENDA):**
   - ¡Solo aquí das el precio!
   - Vende la **Evaluación con IA** como un regalo exclusivo.
   - **DOBLE OPCIÓN DE CIERRE:** "¿Prefieres agendarte tú misma aquí (AGENDA_AQUI_LINK) o te llamamos nosotras para coordinar?".

REGLAS DE ORO:
- **NUNCA** des toda la info en el primer mensaje. Dosifica.
- **NUNCA** pongas el link de agenda antes de la etapa 4.
- **SIEMPRE** termina con una pregunta.
- Si piden fotos: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
