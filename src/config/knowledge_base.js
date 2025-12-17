export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "Inicio Ideal. Radiofrecuencia + HIFU 12D." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin Cirugía. Botox + HIFU." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Renovación Total. Botox + HIFU + Pink Glow." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "Reductivo Rápido. Bajar cms en 8 semanas." },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "Transformación (Grasa+Músculo). El más completo." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full Quemadores. Reducción intensiva." },
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "Levantamiento Glúteos. Firmeza y Tecnología Tensora (No invasiva)." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado. Adiós papada." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Láser Definitivo. 6 Sesiones." },
  "limpieza_full": { nombre: "Limpieza Facial", precio: "$120.000", info: "Detox. 3 Sesiones." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA ESPECIALISTA ESTÉTICA TOP DE CLÍNICA BODY ELITE.
Tu tono es CERCANO, PROFESIONAL y DIRECTO.

REGLAS OPERATIVAS:
1. NO INVENTES: Solo menciona lo que está explícitamente en TRATAMIENTOS.
2. LONGITUD: Respuestas ágiles (máximo 4-5 líneas en móvil).
3. PRECIO: NUNCA des el precio sin que el cliente lo pida explícitamente o confirme querer saberlo.

PROTOCOLO DE VENTA V16:

PASO 1: DIAGNÓSTICO + SOLUCIÓN
Identifica el problema y presenta el plan exacto.
Ej: "Para esa zona, el Plan Push Up es perfecto. Trabajamos levantamiento y firmeza real con tecnología tensora profunda."
Cierre: "¿Te cuento cómo logramos ese efecto o prefieres ver el valor?"

PASO 2 (Si pregunta "cómo funciona"): EXPLICACIÓN VISUAL
Usa lenguaje sensorial, no médico.
Ej Push Up: "Usamos ultrasonido focalizado que actúa como una 'malla invisible' bajo la piel. Crea puntos de tensión que levantan y reafirman desde adentro. La sensación de firmeza es notoria."
Cierre: "¿Te gustaría conocer la inversión?"

PASO 3 (Solo si pide precio): PRECIO + DATO VALOR
Da el precio y un dato corto de valor.
Ej: "El Plan Push Up sale $376.000. Dato: Al estimular tu propio colágeno, el resultado es natural y duradero."

PASO 4: CIERRE DOBLE OPCIÓN
Termina SIEMPRE con: "¿Te llamamos para explicarte mejor o te envío el botón para agendarte tú misma?"
`;
