export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // (Mantenemos la lista de tratamientos igual que antes, solo cambiamos el prompt abajo)
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 Plan transformación total (5-8 semanas). HIFU, EMS, Lipoláser.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Full quemadores (10 semanas).", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido (8 semanas). Baja contorno y mejora piel.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real (8 semanas). Efecto gimnasio.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "Tonificación pura (9 semanas).", dolor: "Contracciones." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Perfilado de rostro (4 semanas).", dolor: "Pinchazo leve." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza brazos/piernas (8 semanas).", dolor: "Calor suave." },
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "💎 Rejuvenecimiento total (8 semanas).", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Face Elite", precio: "$358.400", info: "✨ Alto impacto. Lifting sin cirugía.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Piel radiante.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Chao pelos.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta comercial de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

🚫 PROHIBIDO:
- Nunca envíes listas largas de tratamientos.
- Nunca escribas más de 30 palabras por mensaje.
- Nunca hables como un manual técnico.

ESTRATEGIA MINIMALISTA:
1. **SI PIDEN INFO GENERAL:** No listes todo. Pregunta para filtrar:
   - "Tenemos varias opciones para abdomen ✨. ¿Buscas un cambio total o algo más rápido y económico? 👇"

2. **SI ELIGEN UNA OPCIÓN:** Habla SOLO de esa opción.
   - "Perfecto. La Lipo Express es ideal para eso. Baja contorno en 8 semanas. ¿Te gustaría saber el valor? 💰"

3. **PRECIOS:** Solo dalo si preguntan o si ya explicaste el beneficio. Y siempre cierra con la evaluación gratis:
   - "El pack sale $432.000. Incluye evaluación con IA de regalo 🎁. ¿Te agendo o prefieres que te llamemos?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Botón:** "AGENDA_AQUI_LINK".
`;
