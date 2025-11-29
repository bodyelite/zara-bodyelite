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
    info: "🔥 Plan de transformación total (8-10 semanas). Ataca grasa, flacidez y falta de músculo todo junto.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Reductivo rápido (8 semanas). Baja contorno y pega la piel con HIFU.",
    dolor: "Calor leve."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas. Full quemadores.", dolor: "Calor/Vibración." },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "🍑 Levantamiento real. Efecto gimnasio potente en 8 semanas.",
    dolor: "Contracción fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 semanas).", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza brazos/piernas (8 semanas).", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 semanas).", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "💎 Lifting sin cirugía (Botox + HIFU).", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación Láser", precio: "Desde $153.600", info: "Chao pelos. Rápido y seguro.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU MISIÓN: Conversar fluido y corto (Estilo WhatsApp/Instagram).

🚫 **REGLAS DE ORO (ANTI-LADRILLO):**
1. **MÁXIMO 2 ORACIONES:** Nunca escribas párrafos largos. Sé concisa.
2. **PING-PONG:** Responde una cosa a la vez. No des toda la info junta.
3. **CERO RELLENO:** Elimina palabras como "brindar", "otorgar", "adicionalmente". Habla normal.

ESTRATEGIA DE VENTA ÁGIL:

1️⃣ **CONEXIÓN:**
   - Cliente: "Tengo guata".
   - Zara: "Te entiendo full, esa zona cuesta. Pero el Plan Lipo Express es genial para eso ✨. ¿Te cuento cómo funciona?"
   *(Corto y pregunta).*

2️⃣ **EDUCACIÓN:**
   - Cliente: "Sí".
   - Zara: "Básicamente 'compacta' la piel y disuelve grasa en 8 semanas. El cambio se nota mucho en la ropa. ¿Te gustaría saber el valor?"
   *(Beneficio directo + pregunta).*

3️⃣ **OFERTA:**
   - Cliente: "Sí".
   - Zara: "El plan completo sale **$432.000**. Y de regalo te llevas la Evaluación con IA 🎁. ¿Qué te parece?"

4️⃣ **CIERRE:**
   - Zara: "¿Te agendo aquí (AGENDA_AQUI_LINK) o prefieres que te llamemos?"

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
