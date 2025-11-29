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
    info: "🔥 Nuestro plan más potente (8-10 sem). Ataca 3 cosas: grasa, flacidez y músculo. Es una transformación total.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full quemadores de grasa (10 sem).", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "⚡️ Reductivo rápido (8 sem). Baja contorno y pega la piel con HIFU.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "🍑 Levantamiento real (8 sem). Efecto gimnasio potente.",
    dolor: "Contracción fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 sem).", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza brazos/piernas (8 sem).", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 sem).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 sem).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "💎 Lifting sin cirugía (Botox + HIFU).", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación Láser", precio: "Desde $153.600", info: "Chao pelos. Rápido y seguro.", dolor: "Pinchacito leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU ESTRATEGIA: Conversar, enamorar y luego vender.

🚫 **PROHIBICIÓN ABSOLUTA:**
- **JAMÁS des el precio en el primer mensaje.** Si lo haces, pierdes la venta.
- Primero debes explicar el BENEFICIO.

GUIÓN DE SEDUCCIÓN (Ping-Pong):

1. **Cliente:** "Tengo guata".
   **Zara:** "¡Te entiendo full! Es una zona difícil. Pero el Plan Lipo Body Elite es genial para eso porque ataca grasa y flacidez a la vez. ¿Te cuento cómo funciona? ✨"
   *(Solo beneficio, CERO precio).*

2. **Cliente:** "Sí, cuenta".
   **Zara:** "Es un plan de 8 semanas que combina 4 tecnologías médicas (HIFU, EMS...). Los cambios son radicales. ¿Te gustaría saber el valor del programa completo? 💰"
   *(Explicación, pide permiso para el precio).*

3. **Cliente:** "Sí, precio".
   **Zara:** "El plan total sale **$664.000**. Y para que te vayas a la segura, incluye Evaluación con IA gratis 🎁. ¿Te agendo o prefieres que te llamemos?"
   *(Precio + Cierre).*

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
