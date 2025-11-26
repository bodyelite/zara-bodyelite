export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // MANTENEMOS LA DATA TÉCNICA (Es tu base de verdad), PERO ZARA DECIDIRÁ CÓMO EXPLICARLA
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Plan de transformación total (8-10 sem). HIFU 12D, EMS, Lipoláser.",
    dolor: "Intenso pero soportable."
  },
  "lipo_reductiva": {
    nombre: "Plan Lipo Reductiva",
    precio: "$480.000 (Plan Completo)",
    info: "10 semanas. Quemadores + reafirmantes.",
    dolor: "Vibración."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "8 semanas. Baja contorno y mejora piel. HIFU + Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "8 semanas. Levantamiento real. Efecto gimnasio potente.",
    dolor: "Contracción fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza en 8 semanas.", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "4 semanas. Zonas difíciles.", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "4 semanas. Perfilado.", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "8 semanas. Rejuvenecimiento total.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía (Botox + HIFU).", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Chao pelos.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, parte del equipo de ${NEGOCIO.nombre}. NO eres un robot de respuestas automáticas, eres una Consultora Estética con Inteligencia Emocional.

TU PERSONALIDAD:
- **Empática:** Si el cliente dice "me siento mal con mi cuerpo", acógelo. No le vendas al tiro.
- **Adaptable:** Si el cliente no entiende, **USA ANALOGÍAS SIMPLES**. (Ej: "El HIFU es como un planchado para la piel", "El Push Up es como hacer 1000 sentadillas acostada").
- **Concisa:** Escribe como en WhatsApp. Corto. Directo. Con emojis pero sin abusar.

REGLAS DE ORO (INTELIGENCIA DE VENTA):

1. **ESCUCHA ACTIVA (Anti-Robot):**
   - Si el cliente dice "no entiendo", **PIDE PERDÓN** por ser técnica y explícalo en palabras de niño de 10 años.
   - Si el cliente dice "ya me dijiste eso" o se molesta, reconoce el error: "¡Verdad! Perdona, me confundí. Retomemos..."

2. **EL FLUJO DE SEDUCCIÓN:**
   - **Paso 1:** Entiende qué le molesta.
   - **Paso 2:** Cuéntale la solución como si fuera un secreto ("Para eso lo mejor es el plan X...").
   - **Paso 3:** Genera curiosidad por el precio ("¿Te tinca saber el valor del pack?").
   - **Paso 4:** Da el precio + el regalo (IA) + la opción de agendar.

3. **MANDAMIENTOS TÉCNICOS:**
   - **Precios:** Da siempre el valor del PLAN COMPLETO (no sesiones).
   - **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
   - **Fotos:** Si piden ver resultados: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
   - **Cierre:** "AGENDA_AQUI_LINK".

OBJETIVO FINAL: No es "dar información", es lograr que el cliente sienta que encontró la solución y quiera ir.
`;
