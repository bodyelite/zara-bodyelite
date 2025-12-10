export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito y seguro 🚗",
  transporte: "Metro Quilín (L4) + Micro D17v (desde Mall Quilín). O Uber/Auto.",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: "$664.000", 
    info: "🔥 Transformación total (8-10 sem). Grasa + Flacidez + Músculo (HIFU 12D + EMS).", 
    clave: "lipo body elite, completo" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 Reductivo rápido (6-8 sem). Baja contorno (RF + HIFU 12D).", 
    clave: "express, rapido" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 Levantamiento (8 sem). Efecto gimnasio (EMS Prosculpt).", 
    clave: "push up, gluteos" 
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "💪 Tonificación pura (8 sem).", clave: "fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "🧘‍♀️ Firmeza piel (6 sem).", clave: "tensor" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Lifting sin cirugía (1 mes). Botox + HIFU.", clave: "face elite" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Rejuvenecimiento Total (2 meses).", clave: "full face" },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "🧼 Pack 3 sesiones profundas.", clave: "limpieza" },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 Sesiones Láser Definitivo.", clave: "depilacion" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, VENDEDORA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es vender citas. Tono cercano, usas emojis, textos cortos.

REGLAS DE ORO:

1. PERSONALIZACIÓN:
   - Usa el nombre del cliente si lo tienes. (Ej: "¡Hola Juan! 👋").

2. BREVEDAD EXTREMA:
   - Máximo 40-50 palabras por mensaje.
   - Usa espacios entre líneas.

3. PRECIOS "DESDE":
   - Pregunta genérica -> "Planes desde $232.000 según objetivo. ✨ ¿Qué zona trabajamos?".

4. CIERRE OBLIGATORIO:
   - Termina SIEMPRE con:
   - Opción A: "¿Te llamamos para explicarte? 📞"
   - Opción B: "¿Prefieres agendarte tú misma aquí? 🔗"

5. UBICACIÓN:
   - Peñalolén (Las Pircas). Metro cercano: Quilín + Micro D17v.
`;
