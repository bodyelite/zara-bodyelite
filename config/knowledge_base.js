export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23 (Peñalolén). (Única sucursal)",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  // 👇 AQUÍ ESTÁN LOS 3 NÚMEROS DE ALERTA AHORA
  staff_alertas: ["56937648536", "56931720760", "56983300262"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES REDUCTIVOS Y REAFIRMANTES ---
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "El plan más completo (29 procedimientos). Incluye: 6 RF, 12 Prosculpt (EMS), 6 Lipoláser, 2 HIFU 12D y 3 Controles Nutricionales.",
    dolor: "Calor profundo y contracciones musculares, tolerable."
  },
  "full_face": {
    nombre: "Full Face (Rejuvenecimiento Total)",
    precio: "$584.000",
    info: "Pack de 12 procedimientos premium: 1 Toxina (Botox), 2 RF, 3 Pink Glow, 2 LFP, 1 HIFU 12D Facial y 3 Controles.",
    dolor: "Pinchazo leve y calor."
  },
  "lipo_reductiva": {
    nombre: "Lipo Reductiva",
    precio: "$480.000",
    info: "Pack de 21 procedimientos: 4 RF, 8 Prosculpt, 4 Lipoláser, 2 HIFU 12D y 3 Controles Nutricionales.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "Pack de 21 procedimientos para reducir rápido: 8 RF, 8 Prosculpt, 2 HIFU 12D y 3 Controles Nutricionales.",
    dolor: "Calor y contracción muscular."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "Levantamiento de glúteos (17 procedimientos): 4 RF, 12 Prosculpt (EMS) y 1 HIFU 12D.",
    dolor: "Contracciones musculares profundas (efecto gimnasio)."
  },
  "body_fitness": {
    nombre: "Body Fitness (Tonificación)",
    precio: "$360.000",
    info: "Pack de 18 sesiones full Prosculpt para tonificar músculo intensamente.",
    dolor: "Contracciones musculares."
  },
  "lipo_focalizada": {
    nombre: "Lipo Focalizada Reductiva",
    precio: "$348.800",
    info: "Pack de 12 procedimientos: 6 RF, 3 Lipolíticos, 1 HIFU 12D y 2 Controles.",
    dolor: "Pinchazo leve (lipolítico) y calor."
  },
  "lipo_papada": {
    nombre: "Lipo Papada",
    precio: "$313.600",
    info: "Pack específico de 9 procedimientos: 4 RF, 4 Lipolíticos faciales y 1 HIFU 12D facial.",
    dolor: "Pinchazo leve y calor."
  },
  "body_tensor": {
    nombre: "Body Tensor (Flacidez)",
    precio: "$232.000",
    info: "Pack de 11 procedimientos para tensar piel: 6 RF, 2 HIFU 12D y 3 Controles Nutricionales.",
    dolor: "Calor suave."
  },

  // --- FACIALES Y REJUVENECIMIENTO ---
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "Pack de 4 procedimientos de alto impacto: 1 Toxina (Botox), 1 Pink Glow, 1 LFP y 1 HIFU 12D Facial.",
    dolor: "Pinchazo leve."
  },
  "face_antiage": {
    nombre: "Face Antiage",
    precio: "$281.600",
    info: "Pack de 3 procedimientos: 1 Toxina (Botox), 1 LFP y 1 HIFU 12D Facial.",
    dolor: "Pinchazo leve."
  },
  "face_inicia": {
    nombre: "Face Inicia",
    precio: "$270.400",
    info: "Pack de 6 procedimientos: 2 RF, 1 Pink Glow, 2 LFP y 1 HIFU 12D Facial.",
    dolor: "Calor leve y pinchacito suave."
  },
  "face_smart": {
    nombre: "Face Smart",
    precio: "$198.400",
    info: "Pack de 3 procedimientos: 1 Pink Glow, 1 LFP y 1 HIFU 12D Facial.",
    dolor: "Leve."
  },
  "face_one": {
    nombre: "Face One",
    precio: "$169.600",
    info: "Pack de 5 procedimientos: 4 RF y 1 HIFU 12D Facial.",
    dolor: "Calor agradable."
  },
  "exosoma": {
    nombre: "Exosoma",
    precio: "$152.000",
    info: "1 Sesión de Exosomas (regeneración celular potente).",
    dolor: "Mínimo."
  },
  "face_light": {
    nombre: "Face Light",
    precio: "$128.800",
    info: "Pack de 3 procedimientos: 1 RF, 1 Pink Glow y 1 LFP.",
    dolor: "Suave."
  },
  "face_h12": {
    nombre: "Face H12",
    precio: "$121.600",
    info: "Pack de 2 procedimientos: 1 LFP y 1 HIFU 12D facial.",
    dolor: "Leve."
  },
  "limpieza_full": {
    nombre: "Limpieza Facial Full",
    precio: "$120.000",
    info: "Pack de 6 pasos: 3 Radiofrecuencias y 3 Limpiezas profundas.",
    dolor: "Relajante."
  },

  // --- DEPILACIÓN LÁSER ---
  "depilacion_grande": {
    nombre: "Depilación Zona Grande",
    precio: "$288.000",
    info: "Pack de 6 sesiones (Zona 3). Láser rápido y efectivo.",
    dolor: "Pinchacito leve."
  },
  "depilacion_full": {
    nombre: "Depilación Full",
    precio: "$259.200",
    info: "Pack de 6 sesiones (Láser 1).",
    dolor: "Pinchacito leve."
  },
  "depilacion_mediana": {
    nombre: "Depilación Zona Mediana",
    precio: "$240.000",
    info: "Pack de 6 sesiones (Zona 2).",
    dolor: "Pinchacito leve."
  },
  "depilacion_midle": {
    nombre: "Depilación Midle / Summer Elite",
    precio: "$192.000",
    info: "Pack de 6 sesiones (Láser 2). Ideal para axilas/rebaje o zonas medias.",
    dolor: "Pinchacito leve."
  },
  "depilacion_inicia": {
    nombre: "Depilación Inicia",
    precio: "$153.600",
    info: "Pack de 6 sesiones (Láser 3). Para zonas pequeñas o inicio de tratamiento.",
    dolor: "Muy suave."
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

TUS REGLAS DE ORO:
1. **Precios y Packs:** Los precios que tienes son por PACKS de tratamientos (varias sesiones y tecnologías), no por sesión suelta. Si das un precio, menciona qué incluye (ej: "El Lipo Express vale $432.000 y es un pack de 21 procedimientos con RF, Prosculpt...").
2. **Botox:** Si preguntan por Botox, ofrece los packs "Face Elite" ($358.400) o "Face Antiage" ($281.600) que lo incluyen. También puedes decir que la evaluación de Toxina sola es aprox $160.000.
3. **Modismos:** Entiende "bkn", "guata", "poto", "chao pelos".
4. **Venta:** Siempre invita a evaluar gratis: ${NEGOCIO.agenda_link}
5. **Alertas:** Si te dan el número, confirma y avisa al equipo.
`;
