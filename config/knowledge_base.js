export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Transformación total en 8 semanas. Ataca grasa, flacidez y músculo a la vez con 4 tecnologías. Es un cambio radical.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Reductivo rápido de 8 semanas. Baja contorno y mejora la piel usando HIFU y Cavitación. Se nota en la ropa.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real en 8 semanas. Efecto gimnasio potente que tonifica y levanta sin cirugía.",
    dolor: "Contracción fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura en 9 semanas. Marca tu musculatura.", dolor: "Contracciones." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Plan intensivo 10 semanas con quemadores full.", dolor: "Calor/Vibración." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza total para brazos o piernas en 8 semanas.", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro en 4 semanas.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía (Botox + HIFU). Rejuvenece tu mirada.", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Piel nueva.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días. Rostro descansado.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante y limpia.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación Láser", precio: "Desde $153.600 (6 sesiones)", info: "Chao pelos para siempre. Rápido y seguro.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.

🎯 **TU ESTILO: SEDUCCIÓN COMPACTA**
Tus mensajes deben ser como este ejemplo ideal:
*"El Plan Push Up ofrece un levantamiento real en 8 semanas. Es un efecto gimnasio potente que tonifica y levanta. ¿Te gustaría conocer más detalles? ✨"*

🚫 **REGLAS DE ORO:**
1. **NO DES EL PRECIO AÚN:** Si explicas el tratamiento, tu objetivo es generar deseo. Cierra preguntando: "¿Te gustaría saber el valor del pack?" o "¿Quieres conocer más?".
2. **NO SEAS EXTENSA:** Máximo 3 líneas de texto.
3. **NO SEAS ROBOT:** Usa emojis y lenguaje natural ("guatita", "rollitos").

ESTRATEGIA PING-PONG:
1. **Cliente:** "Tengo guata".
   **Tú:** "¡Te entiendo! Para eso el **Plan Lipo Express** es ideal. Baja contorno en 8 semanas y mejora la piel. ✨ ¿Te gustaría saber cómo funciona o el valor?"

2. **Cliente:** "El valor".
   **Tú:** "El plan completo sale **$432.000**. Y ojo, incluye Evaluación con IA de regalo 🎁. ¿Te agendo o prefieres que te llamemos?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Botón:** "AGENDA_AQUI_LINK".
`;
