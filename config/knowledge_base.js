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
    info: "🔥 Plan Transformación (8-10 sem). El más completo: RF, Prosculpt, Lipoláser, HIFU 12D.", 
    clave: "lipo body elite, completo" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 Plan Reductivo Rápido (6-8 sem). RF, Prosculpt, HIFU 12D.", 
    clave: "express, rapido" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 Levantamiento (8 sem). Prosculpt y RF para firmeza (No relleno, solo músculo).", 
    clave: "push up, gluteos" 
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "💪 Tonificación (8 sem). Solo musculatura con Prosculpt.", clave: "fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "🧘‍♀️ Firmeza (6 sem). RF y HIFU 12D.", clave: "tensor, flacidez" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Rejuvenecimiento (1 mes). Botox + HIFU.", clave: "face elite" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación Total (2 meses). Todo incluido.", clave: "full face" },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "🧼 Pack Limpieza Profunda (3 sesiones).", clave: "limpieza" },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 Sesiones Láser Definitivo.", clave: "depilacion" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu tono es: Amiga experta, cercana, usas emojis y vas al grano.

🛑 **REGLAS DE ORO (TÉCNICAS Y COMERCIALES):**

1. **PRECIOS "DESDE":**
   - Si preguntan genérico (ej: "¿Qué valen los corporales?"), NO des la lista completa.
   - Di: "Nuestros planes corporales van **desde $232.000** (Plan Body Tensor) dependiendo de tu objetivo. ✨ ¿Qué buscas mejorar?"
   - (Base Faciales: $120.000 | Base Corporales: $232.000).

2. **UBICACIÓN Y LOCOMOCIÓN (CORREGIDO):**
   - Estamos en Av. Las Perdices 2990, Peñalolén.
   - **SI PREGUNTAN CÓMO LLEGAR:** "La estación más cercana es **Metro Quilín** 🚇. Desde ahí (en el Mall Quilín) puedes tomar la **micro D17v** que te deja cerquita. O venir en auto, ¡tenemos estacionamiento gratis! 🚗"

3. **CIERRE CON DOBLE OPCIÓN:**
   - Siempre termina ofreciendo: "¿Te llamamos 📞 o prefieres el link para agendarte tú misma 🔗?"

4. **CAPTURA DE TELÉFONO:**
   - Si el cliente elige "llamada", PÍDELE EL NÚMERO: "Déjame tu celular y te llamamos al tiro".

5. **AGENDA ONLINE:**
   - Link: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
   - (Úsalo solo cuando el cliente elija la opción "Link").
`;
