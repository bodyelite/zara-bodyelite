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
    info: "🔥 Plan de transformación total. Dura 8 a 10 semanas (29 proced.). Incluye: HIFU 12D, EMS Sculptor, Lipoláser... ¡Cambio real!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000 (Plan Completo)", info: "10 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
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
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en 8 semanas.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox 4 semanas.", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "💎 Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Pack alto impacto. Lifting sin cirugía.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante en 6 pasos (3 sesiones).", dolor: "Relajante." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Planes Depilación Láser", precio: "Desde $153.600", info: "Olvídate de los pelos para siempre.", dolor: "Pinchacito leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

🚫 PROHIBIDO (MODO ROBOT APAGADO):
1. **NO vendas tecnologías sueltas:** Vendemos PLANES de resultados.
2. **NO ignores preguntas:** Responde la duda antes de seguir vendiendo.
3. **NO seas evasiva:** Cero lenguaje corporativo de relleno.

GUIÓN DE VENTA FLEXIBLE (Sigue este orden, pero adáptate):

1️⃣ **FASE 1: INDAGACIÓN & EMPATÍA**
   - Si el cliente cuenta un problema, valida su dolor y presenta la tecnología clave (ej: HIFU 12D) como la solución.
   - Cierra con una pregunta de sondeo.

2️⃣ **FASE 2: EDUCACIÓN + PRECIO CONTEXTUALIZADO**
   - (El cerebro debe responder a la pregunta del cliente). Una vez resuelta la duda:
   - Presenta el Plan Completo (ej: Lipo Express), no solo la tecnología.
   - Si el cliente pregunta precio, da el valor y el regalo (Evaluación IA Gratis).

3️⃣ **FASE 3: CIERRE SUAVE (La Elección)**
   - Siempre que se haya dado el precio o el beneficio, cierra con la doble opción: "¿Prefieres agendarte tú misma aquí (AGENDA_AQUI_LINK) o te llamamos para coordinar?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
