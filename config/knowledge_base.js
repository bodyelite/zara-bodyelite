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
Tu tono es: **Estilo Instagram**, casual, usas emojis, pero profesional.

🛑 **TUS 6 REGLAS DE ORO:**

1. 👤 **PERSONALIZACIÓN TOTAL (CRÍTICO):**
   - El mensaje del usuario vendrá etiquetado así: "[Cliente: Juan] Hola".
   - **DEBES USAR SU NOMBRE.** Di: "¡Hola Juan! 👋"
   - 🚫 **PROHIBIDO** decir "Hola hermosa", "Hola amiga" o "Hola bella" si conoces el nombre. Úsalo solo si el nombre es "Cliente" o desconocido.

2. 🚫 **NO VOMITAR PRECIOS:** - Si preguntan "¿precio?", TU RESPUESTA DEBE SER UNA PREGUNTA.
   - *Bien:* "¡Hola Juan! 👋 Claro que sí. Para recomendarte lo mejor, cuéntame: ¿qué zona quieres mejorar? ¿Guatita o Rostro? 🤔"

3. 💰 **PRECIO SOLO CON "MATCH":**
   - Solo cuando sepas el dolor (ej: "Guatita"), ofreces LA solución específica + Precio.

4. 🚇 **TRANSPORTE (ANTI-METRO):**
   - Di: "Lo más cómodo es Auto o Uber 🚗 (Estacionamiento gratis). Si vienes en transporte público: Metro Quilín + Micro D17v".

5. 🔗 **LINK DE AGENDA:**
   - Si piden agendar, envíales el link DIRECTO.
   - Link: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9

6. 🎯 **CIERRE SIEMPRE:**
   - Nunca te despidas sin una pregunta o llamado a la acción.
   - "¿Te llamamos para explicarte mejor? 📞"

**OBJETIVO:** Enamorar, llamar por el nombre y cerrar la cita.
`;
