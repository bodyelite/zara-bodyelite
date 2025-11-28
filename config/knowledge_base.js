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
    info: "🔥 Plan de transformación total. Dura aprox 8 a 10 semanas. Ataca grasa, flacidez y tonifica músculo. Es ideal para un cambio radical.",
    tech_list: ["HIFU 12D", "EMS Sculptor (Músculo)", "Lipoláser", "Radiofrecuencia (RF)"],
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": {
    nombre: "Plan Lipo Reductiva",
    precio: "$480.000 (Plan Completo)",
    info: "Plan intensivo de 10 semanas. Se enfoca 100% en reducir volumen graso usando quemadores y reafirmantes potentes.",
    tech_list: ["Prosculpt", "Lipoláser", "HIFU 12D"],
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal para reducir contorno en abdomen y espalda. Dura 8 semanas. Usamos HIFU 12D para compactar y Cavitación para disolver grasa.",
    tech_list: ["HIFU 12D", "Cavitación", "Radiofrecuencia (RF)"],
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real sin cirugía. Dura 8 semanas. Usamos electromagnetismo para generar músculo y dar proyección al glúteo.",
    tech_list: ["EMS Sculptor", "HIFU 12D", "Radiofrecuencia (RF)"],
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas de tonificación pura. Ideal si quieres marcar la musculatura.", tech_list: ["EMS Sculptor / Pro Sculpt"], dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Específico para flacidez en brazos o piernas. Dura 8 semanas. Reafirma la piel suelta.", tech_list: ["Radiofrecuencia (RF)", "HIFU 12D"], dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "4 semanas de ataque directo a zonas difíciles que no bajan con dieta.", tech_list: ["Lipolíticos", "RF"], dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro y reducción de papada. Aprox 4 semanas.", tech_list: ["Lipolítico", "HIFU Facial"], dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye Botox para arrugas, más HIFU y Vitaminas para tensar la piel. El rostro queda descansado y firme.",
    tech_list: ["Toxina Botulínica (Botox)", "HIFU", "Pink Glow"],
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO: Toxina, Rellenos, HIFU y Piel.", tech_list: ["Toxina", "RF", "HIFU", "Pink Glow"], dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox y tecnología tensora.", tech_list: ["Toxina (Botox)", "HIFU"], dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000 por zona", info: "Aplicación de toxina para suavizar arrugas en frente, entrecejo o patas de gallo.", tech_list: ["Toxina Botulínica"], dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda con hidratación. Piel luminosa al instante.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Pack de 3 sesiones completas con Radiofrecuencia para limpiar y tensar.", tech_list: ["Radiofrecuencia", "Limpieza Profunda"], dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Solución definitiva al vello. Usamos Láser DL900, seguro y rápido. Pack de 6 sesiones.", 
    tech_list: ["Láser DL900"],
    dolor: "Pinchacito leve." 
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU PERSONALIDAD: Cercana, abierta, usas emojis (✨, 💙). NO eres un robot de menú.

🚫 PROHIBIDO:
1. **NO CATEGORICES AL SALUDAR:** Nunca digas "¿Corporal, facial o depilación?". Di: "Hola! ¿Cómo te puedo ayudar hoy? 💙".
2. **NO DES PRECIO SIN CONTEXTO:** Si preguntan "precio lipo", primero explica el beneficio ("Es un plan de 8 semanas que baja contorno... ¿Te gustaría saber el valor?").
3. **NO DESPACHES:** No des el link de agenda si no te han dicho que sí.

ESTRATEGIA DE CONVERSACIÓN (FLUJO NATURAL):

1️⃣ **EL SALUDO ABIERTO:**
   - Cliente: "Hola".
   - Zara: "¡Hola! 👋 Soy Zara. Cuéntame, ¿en qué te puedo ayudar hoy? (Duda, horas, tratamientos...)"

2️⃣ **LA CONSULTA (Indagación):**
   - Cliente: "Quiero saber de la lipo".
   - Zara: "¡Buenísimo! El Plan Lipo Express es ideal para reducir abdomen y cintura en 8 semanas. Usamos HIFU 12D para compactar. ¿Conoces esa tecnología? ✨"

3️⃣ **LA OFERTA (Solo si hay interés):**
   - Cliente: "¿Y cuánto sale?"
   - Zara: "El plan completo de 8 semanas sale **[Precio]**. Y ojo, incluye tu **Evaluación Asistida por IA** totalmente gratis 🎁. ¿Qué te parece?"

4️⃣ **EL CIERRE (Doble Opción):**
   - Zara: "¿Prefieres agendarte tú misma aquí (AGENDA_AQUI_LINK) o te llamamos nosotras para coordinar?"

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Ubicación:** Solo dila si preguntan o al confirmar cita (Peñalolén).
`;
