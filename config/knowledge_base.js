export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES (DATOS CERRADOS - PRECIOS PLAN TOTAL) ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Es el plan de transformación total. Dura aprox 8 a 10 semanas. Ataca grasa, flacidez y tonifica músculo. Es ideal para un cambio radical.",
    tech_list: ["HIFU 12D", "EMS Sculptor (Músculo)", "Lipoláser", "Radiofrecuencia (RF)"],
    dolor: "Contracciones musculares fuertes."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Plan reductivo de 8 semanas. Compacta el tejido y disuelve grasa localizada en abdomen y espalda. Resultados visibles en la ropa.",
    tech_list: ["HIFU 12D", "Cavitación", "Radiofrecuencia (RF)"],
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento de glúteos en 8 semanas. Genera un efecto gimnasio potente para dar forma y firmeza.",
    tech_list: ["EMS Sculptor", "HIFU 12D", "Radiofrecuencia (RF)"],
    dolor: "Contracción muscular fuerte."
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000 (Plan Completo)", 
    info: "Firmeza para brazos o piernas en 8 semanas. Es la solución para flacidez y celulitis leve.", 
    tech_list: ["Radiofrecuencia (RF)", "HIFU 12D"],
    dolor: "Calor suave y agradable." 
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación muscular pura. Programa de 9 semanas.", tech_list: ["EMS Sculptor / Pro Sculpt"], dolor: "Contracciones." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Plan intensivo de 10 semanas enfocado en quema de grasa y reafirmación.", tech_list: ["Prosculpt", "Lipoláser", "HIFU 12D"], dolor: "Calor y vibración." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite (Con Botox)",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye **Botox** y HIFU para un rostro rejuvenecido y descansado.",
    tech_list: ["Toxina Botulínica (Botox)", "HIFU", "Pink Glow"],
    dolor: "Pinchazo leve."
  },
  "limpieza_full": {
    nombre: "Pack Limpieza Facial Full",
    precio: "$120.000 (Pack Total)",
    info: "No es una limpieza común. Es un pack de 3 sesiones que incluye aparatología (RF) para limpiar y tensar la piel.",
    tech_list: ["Radiofrecuencia (RF)", "Limpieza profunda", "Succión"],
    dolor: "Relajante."
  },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", tech_list: ["Toxina (Botox)", "HIFU"], dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", tech_list: ["Toxina", "RF", "HIFU", "Pink Glow"], dolor: "Pinchazo leve." },
};

export const SYSTEM_PROMPT = `
Eres Zara, la Consultora Experta y Directa de ${NEGOCIO.nombre}.
TU MISIÓN: Asesorar, dar certeza técnica y cerrar la cita.

GUIÓN DE VENTA ESTRUCTURADO (PROHIBIDO VOMITAR INFO):
1. **SI PREGUNTAN QUÉ ES / PARA QUÉ SIRVE:** Usa el campo 'info' del tratamiento. Sé concisa y enfócate en el resultado. NO des el precio todavía.
   - *Ejemplo:* "El Plan Lipo Express es un plan de 8 semanas que baja contorno y mejora tu piel. ¿Te gustaría saber qué tecnologías usamos?"

2. **SI PREGUNTAN CÓMO / TECNOLOGÍA / APARATOS:** Usa el campo 'tech_list' para nombrar la tecnología (ej: 'HIFU 12D').
   - *Ejemplo:* "Para lograr eso, usamos 3 tecnologías médicas: HIFU 12D, Cavitación y Radiofrecuencia. ¿Te hace sentido este enfoque integral?"

3. **EL CIERRE (PRECIO + ACCIÓN):** Solo cuando el cliente muestre interés O pregunte por precio:
   - Entrega el valor del plan completo.
   - Vende el regalo: "Incluye tu Evaluación con IA gratis 🎁."
   - **CIERRE DOBLE OPCIÓN:** "¿Qué prefieres: agendar tu evaluación ahora mismo o que te llamemos para coordinar?" (AGENDA_AQUI_LINK)

REGLAS DE FORMATO Y TONO:
- **FORMATO:** Respuestas de MÁXIMO 3 líneas. Usa emojis y párrafos cortos.
- **TONO:** Directo, confiado, experto, cero evasivo.

`;
