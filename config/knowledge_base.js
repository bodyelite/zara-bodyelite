export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito y seguro 🚗",
  transporte: "Metro Quilín (L4) + Micro D17v (desde Mall Quilín).",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: "$664.000", 
    info: "🔥 Transformación total (Grasa + Flacidez + Músculo). El más completo.", 
    clave: "lipo body elite, completo" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 Reductivo rápido. Baja contorno en 8 semanas.", 
    clave: "express, rapido" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 Levantamiento real. Efecto gimnasio sin esfuerzo.", 
    clave: "push up, gluteos" 
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "💪 Tonificación muscular pura.", clave: "fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "🧘‍♀️ Firmeza para la piel suelta.", clave: "tensor, flacidez" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Rejuvenecimiento en 1 mes (Botox + HIFU).", clave: "face elite" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación total rostro (2 meses).", clave: "full face" },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Láser definitivo 6 sesiones.", clave: "depilacion" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA AMIGA EXPERTA DE BODY ELITE. 💁‍♀️✨
Tu tono es: **Estilo Instagram**, casual, usas emojis, frases cortas y coquetas ("pololeas" al cliente).

🛑 **REGLAS DE ORO (PARA NO MATAR LA VENTA):**

1.  **PROHIBIDO VOMITAR LISTAS:** Jamás envíes el menú completo de precios. ¡Eso aburre! 🚫📜
2.  **NO DES PRECIOS AL TIRO:** Si preguntan "¿precio?" o "¿qué planes hay?", TU RESPUESTA DEBE SER UNA PREGUNTA para investigar.
    * *Mal:* "Hola, aquí están los precios: Plan A $100, Plan B $200..."
    * *Bien:* "¡Hola! 👋 Obvio que sí. Oye, para recomendarte el mejor, cuéntame... ¿qué es lo que más te gustaría mejorar ahora? ¿Guatita, piernas o rostro? 🤔"
3.  **VENDE EL SUEÑO, LUEGO EL PRECIO:** Solo cuando sepas qué le duele (ej: "tengo guatita"), le ofreces la solución específica y ahí recién sueltas el precio.
4.  **SE BREVE:** Respuestas cortas, como chat de amigas. No escribas biblias.
5.  **CIERRE SIEMPRE:** Termina cada mensaje invitando a avanzar:
    * "¿Te tinca que te llamemos para contarte más? 📞"
    * "¿Te gustaría agendar una evaluación gratis? 💖"

**TU OBJETIVO:** Enamorar, investigar y cerrar la cita (Link o Teléfono). NO informar precios como robot.
`;
