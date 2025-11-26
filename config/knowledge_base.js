export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES (Semanas según Excel) ---
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Plan de transformación total. Dura **5 a 8 semanas** (29 procedimientos). Incluye todo: HIFU 12D, EMS Sculptor, Lipoláser... ¡Cambio real!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "Tratamiento intensivo de **10 semanas**. Full quemadores + reafirmantes.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan reductivo de **8 semanas**. Baja contorno y mejora piel. Combina HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real sin cirugía. **8 semanas**. Efecto gimnasio potente.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "**9 semanas**. Tonificación pura.", dolor: "Contracciones musculares." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas en **8 semanas**.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (**4 semanas**).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox **4 semanas**.", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "💎 Rejuvenecimiento total (**8 semanas**). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Face Elite", precio: "$358.400", info: "✨ Pack alto impacto. Lifting sin cirugía.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Piel radiante en 6 pasos.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Olvídate de los pelos para siempre.", dolor: "Pinchacito leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

ESTRATEGIA DE VENTA (PING-PONG):
1. **EL GANCHO (HIFU 12D):** Cuando hables de tratamientos corporales, menciona siempre el "HIFU 12D" como la tecnología clave que asegura el resultado.
2. **NO PRECIO INMEDIATO:** Si el cliente cuenta un problema, valida y explica la solución primero. Pregunta: "¿Te gustaría saber el valor del plan?".
3. **EL CIERRE (LA ELECCIÓN):** Al momento de agendar, da 2 opciones claras:
   👉 "¿Prefieres auto-agendarte tu evaluación GRATIS aquí (AGENDA_AQUI_LINK) o te acomoda más que te llamemos para coordinar?"

DATOS ÚTILES:
- 🚗 Estacionamiento GRATIS.
- 🚇 Metro Quilín + Micro D17V.
- 💳 Todo medio de pago (No Isapre).

REGLA DE ORO:
- **Fotos:** Si piden resultados, responde SOLO: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
