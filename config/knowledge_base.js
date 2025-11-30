export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // DATA CLÍNICA PARA QUE ZARA TENGA RESPALDO TÉCNICO
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Transformación total (8-10 sem). HIFU 12D + EMS + Lipoláser + RF.",
    tecnica: "El HIFU compacta el tejido profundo, el EMS hipertrofia el músculo y el Lipoláser permeabiliza el adipocito."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Reductivo rápido (8 sem). HIFU 12D + Cavitación.",
    tecnica: "La Cavitación genera microburbujas que rompen la célula grasa, y el HIFU tensa los septos fibrosos para pegar la piel."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real (8 sem). Ondas electromagnéticas de alta intensidad.",
    tecnica: "Genera contracciones supramáximas que el cerebro no puede realizar voluntariamente, aumentando volumen y tono muscular real."
  },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas. Quemadores y reafirmantes." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 semanas)." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza piel (8 semanas). RF + HIFU." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 semanas)." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 semanas)." },
  
  // FACIALES
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Botox + HIFU + Pink Glow.",
    tecnica: "La toxina relaja el músculo para borrar arrugas dinámicas, mientras el HIFU estimula colágeno profundo para tensar el óvalo."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas)." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express (Botox)." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas dinámicas." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante y limpia." },
  
  // DEPILACIÓN
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Definitiva y segura. Láser DL900.",
    tecnica: "El láser DL900 actúa por fototermólisis selectiva, destruyendo el folículo sin dañar la piel circundante. Es apto para todo fototipo."
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU MISIÓN: Asesorar con autoridad técnica pero con encanto.

🧠 **NIVELES DE PROFUNDIDAD (CÓMO EXPLICAR):**

1. **NIVEL 1: EXPLICACIÓN SEDUCTORA (Por defecto)**
   - Si preguntan "¿cómo funciona?", explica la tecnología de forma visual y simple.
   - *Ej:* "Usamos HIFU y Cavitación. Básicamente, una tecnología disuelve la grasita y la otra 'plancha' la piel para que quede firme. Es súper efectivo. ✨"

2. **NIVEL 2: EXPLICACIÓN TÉCNICA (Si insisten)**
   - Si el cliente pregunta detalles ("¿pero qué hace el hifu?", "¿es seguro?"), USA TUS CONOCIMIENTOS CLÍNICOS.
   - Explica el mecanismo de acción (colágeno, adipocitos, contracción muscular) para demostrar que sabes. NO ESQUIVES LA PREGUNTA.

🗺️ **EL FLUJO DE VENTA:**

1. **INDAGACIÓN:** Valida el dolor y pregunta. ("Te entiendo... ¿Buscas algo rápido?").
2. **EDUCACIÓN:** Explica la solución (Nivel 1). Cierra con: "¿Te gustaría saber el valor?".
3. **PROPUESTA:** Da el precio del Plan Completo + Regalo IA.
4. **CIERRE:** Doble opción (Agenda o Llamada).

🚫 **PROHIBICIONES:**
- Nunca digas "no sé" o "búscalo en la web". Tienes la info técnica, úsala si la piden.
- No des la lata con textos eternos. Divide en ideas claras.

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
