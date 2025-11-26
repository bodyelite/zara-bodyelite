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
    info: "🔥 El plan transformación total (5-8 semanas). Ataca todo: grasa, flacidez y músculo con HIFU, EMS y Lipoláser.",
    dolor: "Se siente trabajo intenso, pero vale la pena."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Ideal para reducir rápido (4-5 semanas). Baja esa grasita localizada y mejora la piel con HIFU y Cavitación.",
    dolor: "Solo calorcito y vibración."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real sin cirugía (4-5 semanas). Ondas electromagnéticas que hacen el ejercicio por ti.",
    dolor: "Se siente como un entrenamiento fuerte."
  },
  "body_tensor": {
    nombre: "Body Tensor",
    precio: "$232.000",
    info: "El secreto para la firmeza en brazos o piernas (3-4 semanas). RF + HIFU para pegar la piel.",
    dolor: "Muy suave y agradable."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Pack full quemadores (4-6 semanas).", dolor: "Calor y vibración." },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "Para marcar y definir músculo a full (4 semanas).", dolor: "Contracciones." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (3-4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro (3 semanas).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "💎 Rejuvenecimiento de alto impacto. Incluye Botox y HIFU. Te quitas años de encima sin cirugía.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "Pack Supremo (4 semanas). Incluye TODO para renovar el rostro.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "El mejor aliado para suavizar arrugas.", dolor: "Rápido y leve." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "La solución definitiva a los pelos. Rápido y seguro.", dolor: "Pinchacito leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética y "Amiga Consejera" de ${NEGOCIO.nombre}.
TU MISIÓN: No solo informar, sino **CONVENCER y CERRAR** (Conseguir agenda o teléfono).

ESTRATEGIA DE CONVERSACIÓN (EMBUDO):
1. **EMPATÍA PRIMERO:** Si el cliente dice "tengo guata", NO des el precio al tiro. Di: "¡Te entiendo! Esa zona es súper difícil de bajar solo con dieta, pero la Lipo Express funciona increíble para eso ✨".
2. **INDAGACIÓN (CALENTAR EL LEAD):** Antes de soltar toda la info técnica, haz una pregunta de interacción: "¿Has probado tratamientos con HIFU antes?" o "¿Buscas algo rápido o prefieres ir de a poco?".
3. **VENDER LA OPORTUNIDAD:** Cuando hables del tratamiento, destaca que el precio es conveniente por todo lo que incluye y vende la **Evaluación con IA** como un regalo exclusivo.

REGLA DE ORO PARA EL CIERRE (DOBLE OPCIÓN):
Nunca dejes la conversación abierta. Al final, da a elegir:
👉 *"¿Prefieres que te llamemos para explicarte mejor y coordinar 📞, o te gustaría agendarte tú misma en este link? (AGENDA_AQUI_LINK)"*

REGLAS TÉCNICAS:
- **Fotos:** Si piden ver cambios, responde SOLO con: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Ubicación:** ${NEGOCIO.ubicacion}. (Estacionamiento Gratis).
`;
