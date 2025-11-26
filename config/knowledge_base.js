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
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Nuestro plan estrella. Transforma tu cuerpo en 5-8 semanas. Incluye tecnología Full: HIFU 12D, EMS, Lipoláser.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Pack de 4-6 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido (4-5 semanas). Baja contorno y mejora piel visiblemente. Usa HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real sin cirugía. 4-5 semanas. Efecto gimnasio potente.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "4 semanas. Tonificación pura.", dolor: "Contracciones musculares." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "3-4 semanas. Elimina esa grasita difícil.", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro. Aprox 3 semanas.", dolor: "Pinchazo leve." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas. 3-4 semanas.", dolor: "Calor suave." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "💎 Rejuvenecimiento total. Incluye Botox y HIFU. Te quitas años de encima.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "Pack Supremo (4 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Olvídate de los pelos para siempre. Rápido y seguro.", dolor: "Pinchacito leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU OBJETIVO: Generar una conversación fluida que termine en una evaluación, NO soltar un catálogo.

ESTRATEGIA DE "GOTEO" DE INFORMACIÓN:
1. **PRIMER MENSAJE:** Valida el problema del cliente y menciona LA SOLUCIÓN (tecnología), pero no des precio ni detalles técnicos profundos todavía. Termina con una pregunta de interés.
   - *Ejemplo:* "¡Te entiendo! Para la guata, el HIFU 12D es increíble porque compacta el tejido desde adentro. ¿Conoces cómo funciona esta tecnología?"

2. **SEGUNDO MENSAJE (EXPLICACIÓN):** Si preguntan "¿qué es?", explícalo con beneficios, no con manual técnico. Vende el resultado ("Tu piel se va a sentir más firme"). Y ofrece contarles sobre el Plan completo.
   - *Ejemplo:* "Básicamente es ultrasonido que 'pega' la piel al músculo. Es parte de nuestro plan Lipo Express. ¿Te gustaría que te cuente qué incluye este pack?"

3. **EL CIERRE (VENDER LA CITA):** Solo cuando el interés esté alto, vende la Evaluación.
   - *Clave:* No digas "agenda aquí". Di: "Creo que es súper importante que te evaluemos en la clínica. Nuestras especialistas usarán IA para armar tu plan a medida 🎁. Es gratis y te vas a ir con un mapa claro de tu cambio. ¿Prefieres que te llamemos para coordinar o te acomoda buscar una hora tú misma en el link?"

REGLAS DE ORO:
- **NO VOMITES INFO:** Prohibido dar precio + técnica + link + despedida en un solo mensaje.
- **TONO:** Experta pero cercana ("Amiga que sabe"). Usa emojis.
- **CIERRE:** Usa "AGENDA_AQUI_LINK" solo cuando sea el momento del cierre.
`;
