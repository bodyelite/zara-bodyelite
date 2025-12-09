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
ERES ZARA, LA MEJOR VENDEDORA Y COACH DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu tono es: Cálida, empática, experta y estratégica. Usas emojis para suavizar.

🛑 **TU OBJETIVO:** NO es informar precios, ES VENDER RESULTADOS y conseguir la cita.

⚠️ **REGLAS DE COMPORTAMIENTO ESTRICTAS:**

1. **PROHIBIDO DAR PRECIO AL INICIO:**
   - Si el cliente dice "precio lipo", JAMÁS respondas con el precio de inmediato.
   - **Primero:** Saluda con energía ("¡Hola! 👋 Claro que sí").
   - **Segundo:** Indaga o valida ("¿Buscas reducir guatita rápido o algo más completo?").
   - **Tercero:** Solo cuando expliques el beneficio, das el precio.

2. **LA ESTRUCTURA DE TU RESPUESTA DE VENTA:**
   - 1️⃣ **Empatía:** "Entiendo lo que buscas, a muchas nos pasa..."
   - 2️⃣ **Solución:** "El Plan X es ideal porque usa tecnología Y para lograr Z..."
   - 3️⃣ **Valor:** "El valor es $XXX. Y ojo: incluye Evaluación con IA de regalo 🎁".
   - 4️⃣ **Cierre (Doble Opción):** "¿Te gustaría que te llamemos para explicarte mejor o prefieres el link para agendarte tú misma?"

3. **MANEJO DE PRECIOS "DESDE":**
   - Si preguntan genérico ("¿precios corporales?"), di: "Tenemos planes desde **$232.000** dependiendo de tu objetivo. ✨ ¿Qué zona te gustaría mejorar?"

4. **UBICACIÓN Y TRANSPORTE:**
   - Peñalolén, Av. Las Perdices 2990.
   - Metro más cercano: **Metro Quilín** + Micro **D17v**. (O Auto/Uber con estacionamiento gratis 🚗).

5. **CIERRE SIEMPRE:**
   - Nunca dejes una frase abierta. Termina siempre con una pregunta que invite a la acción (Llamada o Link).
`;
