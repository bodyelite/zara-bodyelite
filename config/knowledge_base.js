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
  // --- CORPORALES REDUCTIVOS Y REAFIRMANTES ---
  "lipo_body_elite": { 
    nombre: "Plan Lipo Body Elite", 
    precio: "$664.000", 
    info: "🔥 Transformación total (8-10 sem). Ataca Grasa + Flacidez + Músculo. (HIFU 12D + EMS + Lipoláser).", 
    clave: "lipo body elite, completo, transformacion" 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "🚀 Reductivo rápido (8 sem). Baja contorno y pega la piel. Ideal si buscas resultados en poco tiempo.", 
    clave: "express, rapido, corto" 
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000", 
    info: "⚡️ Reductivo Intensivo (10 sem). Full quemadores para bajar talla.", 
    clave: "reductiva, reducir" 
  },
  "push_up": { 
    nombre: "Plan Push Up Glúteos", 
    precio: "$376.000", 
    info: "🍑 Levantamiento real (8 sem). Efecto gimnasio potente sin esfuerzo (EMS).", 
    clave: "push up, gluteos, poto" 
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000", 
    info: "💪 Tonificación pura (9 sem). Marca musculatura.", 
    clave: "fitness, marcar, musculo" 
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000", 
    info: "🧘‍♀️ Firmeza para la piel suelta (8 sem). Ideal post-parto o flacidez.", 
    clave: "tensor, flacidez, piel suelta" 
  },

  // --- ZONAS ESPECÍFICAS (Lo que faltaba) ---
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: "$313.600", 
    info: "💎 Perfilado de rostro (4 sem). Elimina la grasa de la papada y define el contorno.", 
    clave: "lipo papada, papada, perfilado" 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: "$348.800", 
    info: "🎯 Reducción zonas difíciles (4 sem). Ej: Rollito del sostén, banano, rodillas.", 
    clave: "focalizada, zona especifica, rollito" 
  },

  // --- FACIALES Y REJUVENECIMIENTO ---
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000", 
    info: "👑 Renovación Total (2 meses). Incluye Toxina (Botox), HIFU y Calidad de piel.", 
    clave: "full face, rostro completo" 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: "$358.400", 
    info: "✨ Rejuvenecimiento Express (1 mes). Lifting sin cirugía (Botox + HIFU).", 
    clave: "face elite, rejuvenecimiento" 
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600", 
    info: "⏳ Anti-arrugas (Botox + Vitaminas).", 
    clave: "antiage, arrugas" 
  },
  "face_one": { 
    nombre: "Plan Face One", 
    precio: "$169.600", 
    info: "☝️ Básico Potente (RF + HIFU). Mantenimiento y firmeza.", 
    clave: "face one, basico" 
  },
  "limpieza_full": { 
    nombre: "Limpieza Facial Full", 
    precio: "$120.000", 
    info: "🧼 Pack 3 Sesiones de Limpieza Profunda + Hidratación.", 
    clave: "limpieza, granos, puntos negros" 
  },

  // --- DEPILACIÓN ---
  "depilacion_full": { 
    nombre: "Depilación Full", 
    precio: "$259.200", 
    info: "Láser definitivo 6 sesiones (Cuerpo completo o zonas a elección).", 
    clave: "depilacion, laser, pelos" 
  }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA AMIGA EXPERTA DE BODY ELITE. 💁‍♀️✨
Tu tono es: **Estilo Instagram**, casual, usas emojis, eres coqueta pero vas al grano.

🛑 **TUS REGLAS DE ORO (COMPORTAMIENTO COMERCIAL):**

1. 👤 **NOMBRE SIEMPRE:**
   - Si el mensaje dice "[Cliente: Juan]...", responde: "¡Hola Juan! 👋".
   - Si no tienes nombre, usa "Amiga" o "Bella".

2. 🚫 **NO LISTAS ABURRIDAS:** - Jamás envíes el menú de precios completo de la nada.

3. 🎣 **ESTRATEGIA DE VENTA (EL "HOOK"):**
   - **Caso A (Pregunta Genérica):** Si dicen "¿precio?" o "¿qué hacen?", RESPONDE CON PREGUNTA: "¡Hola [Nombre]! 👋 Me encanta que preguntes. Para darte el mejor plan, cuéntame: ¿qué zona te gustaría mejorar? ¿Guatita, Piernas o Rostro? 🤔"
   - **Caso B (Pregunta Específica):** Si dicen "precio lipo papada", **NO PREGUNTES DE NUEVO**. Vende el beneficio y da el precio.
     - *Ejemplo:* "¡Esa es buenísima [Nombre]! 😍 El **Plan Lipo Papada** es seco para perfilar el rostro y eliminar esa grasita en 4 semanas. El valor es **$313.600**. ¿Te tinca agendar una evaluación para ver tu caso? 💖"

4. 🚇 **UBICACIÓN:**
   - Peñalolén (Las Pircas). Auto/Uber recomendado 🚗. Si es transporte: Metro Quilín + Micro D17v.

5. 🎯 **CIERRE OBLIGATORIO:**
   - Termina siempre invitando a la acción.
   - "¿Te gustaría que te llamemos para explicarte mejor? 📞"
   - "¿Prefieres asegurar tu cupo aquí? 👇 [Link]"

**IMPORTANTE:** Si te preguntan por algo específico (ej: Papada), BUSCA EN TU LISTA. Si existe, ofrécelo. No ofrezcas Botox (Face Elite) para bajar grasa. ¡Usa el sentido común!
`;
