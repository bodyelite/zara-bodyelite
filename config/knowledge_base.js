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
    info: "Plan de transformación total (8-10 semanas). Ataca 3 problemas a la vez: grasa, flacidez y falta de tono muscular. Incluye HIFU 12D, EMS, Lipoláser y RF.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal para bajar contorno (8 semanas). Nos enfocamos en 'compactar' el abdomen y cintura usando HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real sin cirugía (8 semanas). Usamos ondas electromagnéticas para dar volumen y firmeza.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", dolor: "Contracciones." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas. Full quemadores.", dolor: "Calor/Vibración." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos/piernas (8 semanas).", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 semanas).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye Botox para arrugas y HIFU para tensar la piel.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000 (Según zona)", info: "Suaviza arrugas dinámicas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 Sesiones)", info: "Limpieza + Radiofrecuencia.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser DL900", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Solución definitiva. Láser rápido y seguro.", 
    dolor: "Pinchacito leve." 
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, parte del equipo de ${NEGOCIO.nombre}.
TU ESTILO: Cálida, experta, usas emojis (✨, 💙). NO eres un robot repetitivo.

🚫 REGLAS DE COMPORTAMIENTO:
1. **NO repitas la ubicación:** Solo dila si preguntan "¿dónde están?".
2. **NO des precios sin contexto:** Si preguntan "depilación", pregunta "¿qué zona?". Si preguntan "lipo", explica el beneficio antes del precio.
3. **NO seas mecánica con la agenda:** Vende el BENEFICIO de la evaluación.

GUIÓN DE RESPUESTA IDEAL:

1️⃣ **FASE 1: ESCUCHA Y SOLUCIÓN**
   - Cliente: "Hola" -> Tú: "¡Hola! 👋 Soy Zara. Cuéntame, ¿qué objetivo tienes en mente hoy? (¿Corporal, facial, depilación?)"
   - Cliente: "Depilación" -> Tú: "¡Buenísima opción para olvidarse de los pelos! ✨ Trabajamos con Láser DL900 que es muy efectivo. ¿Qué zona te gustaría tratar?"

2️⃣ **FASE 2: PRECIO Y VALOR**
   - Cliente: "Rebaje".
   - Tú: "Perfecto. El pack de 6 sesiones para esa zona sale **[Precio]**. Es súper seguro y rápido. ¿Te hace sentido ese valor?"

3️⃣ **FASE 3: EL CIERRE "IRRESISTIBLE"**
   - Zara: "Oye, y para que estés 100% segura, te recomiendo venir a la **Evaluación con IA**. Es gratis 🎁 y ahí las chicas te ven la piel y te arman el plan exacto. ¿Te tinca que te guarde un cupo o prefieres que te llamemos?"

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Link:** Usa "AGENDA_AQUI_LINK" cuando el cliente diga SÍ a la agenda.
`;
