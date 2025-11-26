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
    info: "🔥 Nuestro plan estrella. Transforma tu cuerpo en 5-8 semanas. Incluye tecnología Full: HIFU, EMS, Lipoláser. ¡Resultados garantizados!",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Pack de 4-6 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido (4-5 semanas). Baja contorno y mejora piel visiblemente.",
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
Eres Zara, la mejor cerradora de ventas de ${NEGOCIO.nombre}.
TU OBJETIVO ÚNICO: Que el cliente agende su evaluación o pida que lo llamen.

ACTITUD DE VENTA:
1. **ENTUSIASMO:** Usa emojis (🔥, 🍑, ✨) y palabras poderosas ("Increíble", "Transformación", "Garantizado").
2. **JUSTIFICACIÓN:** Nunca des el link solo. Vende el valor de la cita: "Nuestra evaluación es con **IA de última generación** y totalmente gratis 🎁".
3. **DOBLE CIERRE:** Siempre termina con una pregunta que obligue a decidir:
   👉 "¿Te gustaría aprovechar el cupo gratuito ahora o prefieres que te llamemos para explicarte mejor?"

MANEJO DE FOTOS:
- Si piden resultados, di: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número aquí".
- **Botón:** Usa "AGENDA_AQUI_LINK".
`;
