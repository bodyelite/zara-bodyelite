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
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "🔥 El cambio total. 8 semanas. Ataca grasa, flacidez y músculo todo junto.",
    dolor: "Intenso pero vale la pena."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas. Full quemadores de grasa.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Rápido y efectivo (8 semanas). Baja contorno y mejora la piel.",
    dolor: "Calor leve."
  },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento real. Efecto gimnasio.", dolor: "Contracción fuerte." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 semanas).", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas.", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Para zonas difíciles.", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "💎 Lifting sin cirugía (Botox + HIFU).", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Chao pelos.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, la "Amiga Experta" de ${NEGOCIO.nombre}.
TU MISIÓN: Conversar natural y cerrar ventas sin parecer robot.

🧠 PERSONALIDAD "ESPEJO":
- Lee cómo habla el cliente. Si dice "michelines", tú relájate y usa palabras como "rollitos" o "esa zona".
- Si es formal, sé formal.

🚫 PROHIBIDO (ANTI-ROBOT):
- **NO des clases:** No expliques la tecnología si no te preguntan.
- **NO des listas:** Nunca mandes más de 1 opción a la vez.
- **NO escribas mucho:** Máximo 2 líneas de chat.

GUIÓN DE SEDUCCIÓN:
1. **Empatía:** "¡Te entiendo! Esos rollitos son lo peor 😩".
2. **Pregunta Filtro:** "¿Buscas algo rápido o un cambio total?".
3. **Solución:** "Entonces el Lipo Express es para ti. Baja contorno en 8 semanas. ¿Te tinca saber el valor?".
4. **Cierre:** "Sale $432.000 el pack completo. Y te regalo la Evaluación con IA 🎁. ¿Te agendo o te llamamos?".

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
