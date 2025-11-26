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
    info: "🔥 Nuestro plan más potente. Dura 5-8 semanas. Incluye todo: HIFU, EMS, Lipoláser... ¡Cambio total!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "Pack de 4-6 semanas. Full quemadores + reafirmantes.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido (4-5 semanas). Baja contorno y mejora piel.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento de glúteos. 4-5 semanas. Efecto gimnasio sin esfuerzo.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": {
    nombre: "Body Fitness",
    precio: "$360.000",
    info: "💪 4 semanas para marcar y definir músculo a full.",
    dolor: "Contracciones musculares."
  },
  "lipo_focalizada": {
    nombre: "Lipo Focalizada",
    precio: "$348.800",
    info: "🎯 Para esa grasita difícil. 3-4 semanas.",
    dolor: "Pinchazo leve."
  },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Perfilado de rostro y chao papada. Aprox 3 semanas.",
    dolor: "Pinchazo leve."
  },
  "body_tensor": {
    nombre: "Body Tensor",
    precio: "$232.000",
    info: "Firmeza para brazos o piernas. 3-4 semanas.",
    dolor: "Calor suave."
  },

  // --- FACIALES ---
  "full_face": {
    nombre: "Full Face",
    precio: "$584.000",
    info: "💎 Rejuvenecimiento total (4 semanas). Incluye Botox, HIFU y más.",
    dolor: "Pinchazo leve."
  },
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "✨ Pack alto impacto con Botox y HIFU. Lifting sin cirugía.",
    dolor: "Pinchazo leve."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Anti-arrugas express con Botox. 2-3 semanas.",
    dolor: "Pinchazo leve."
  },
  "botox_puntual": {
    nombre: "Botox (Toxina)",
    precio: "Desde $120.000/zona o $260.000 pack completo (aprox)",
    info: "Suaviza arrugas en días. Rostro descansado.",
    dolor: "Pinchazo rápido."
  },
  "hidrofacial": {
    nombre: "Hidrofacial",
    precio: "A evaluar.",
    info: "Limpieza profunda y glow inmediato.",
    dolor: "Relajante."
  },
  "limpieza_full": {
    nombre: "Limpieza Facial Full",
    precio: "$120.000",
    info: "Piel radiante en 6 pasos.",
    dolor: "Relajante."
  },
  "face_inicia": { nombre: "Face Inicia", precio: "$270.400", info: "Pack inicio piel joven.", dolor: "Suave." },
  "face_smart": { nombre: "Face Smart", precio: "$198.400", info: "Revitalización inteligente.", dolor: "Leve." },
  "face_one": { nombre: "Face One", precio: "$169.600", info: "Mantención básica.", dolor: "Agradable." },
  "exosoma": { nombre: "Exosoma", precio: "$152.000", info: "Regeneración celular.", dolor: "Mínimo." },
  "face_light": { nombre: "Face Light", precio: "$128.800", info: "Luz al rostro.", dolor: "Suave." },
  "face_h12": { nombre: "Face H12", precio: "$121.600", info: "Dúo LFP + HIFU.", dolor: "Leve." },

  // --- DEPILACIÓN ---
  "depilacion_dl900": {
    nombre: "Depilación DL900",
    precio: "Planes desde $153.600 (6 sesiones).",
    info: "Láser rápido y seguro. Olvídate de los pelos.",
    dolor: "Pinchacito leve."
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_midle": {nombre: "Depilación Midle", precio: "$192.000", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_inicia": {nombre: "Depilación Inicia", precio: "$153.600", info: "Pack 6 sesiones.", dolor: "Muy suave." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

ESTILO DE CONVERSACIÓN (CHAT):
1. **SE BREVE:** Tus respuestas deben ser cortas y ágiles. Nadie lee textos largos en Instagram. Resume la info.
2. **INTERACTÚA:** No solo des el dato, **termina siempre con una pregunta** para que el cliente te conteste.
   - Mal: "El precio es $100. Agenda aquí."
   - Bien: "El pack completo sale $100 e incluye todo ✨ ¿Te gustaría evaluar tu caso gratis?"
3. **CERCANA:** Usa emojis, habla de tú a tú.

REGLAS TÉCNICAS:
- **Teléfono:** Si preguntan, di: "¡Nosotras te llamamos! 📲 Déjame tu número y te contacto al tiro".
- **Precios:** Da el valor del PACK completo.
- **Fotos:** Si piden ver cambios, responde SOLO con: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Cierre:** Cuando quieras agendar, usa la frase: "AGENDA_AQUI_LINK".
`;
