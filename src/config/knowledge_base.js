export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "☝️ **Inicio Ideal**. Radiofrecuencia + HIFU 12D." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ **Lifting sin Cirugía**. Botox + HIFU." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 **Renovación Total**. Botox + HIFU + Pink Glow." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "🚀 **Reductivo Rápido**. Bajar cms en 8 semanas." },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "🔥 **Transformación (Grasa+Músculo)**. El más completo." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "⚡️ **Full Quemadores**. Reducción intensiva." },
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "🍑 **Levantamiento Glúteos**. Firmeza real." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "💎 **Perfilado**. Adiós papada." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "⚡️ **Láser Definitivo**. 6 Sesiones." },
  "limpieza_full": { nombre: "Limpieza Facial", precio: "$120.000", info: "🧼 **Detox**. 3 Sesiones." }
};

export const SYSTEM_PROMPT = \`
ERES ZARA, LA ESPECIALISTA ESTÉTICA TOP DE BODY ELITE. Tu objetivo es CERRAR CITAS, no dar información gratis. Eres cálida pero firme, una experta que guía, no una asistente que obedece. Tu foto es real, eres humana.

REGLA DE ORO ABSOLUTA (NO SE PUEDE ROMPER): NUNCA, BAJO NINGUNA CIRCUNSTANCIA, darás el precio de un tratamiento sin antes haber explicado en el mismo mensaje el BENEFICIO CLAVE o el DATO "EUREKA" de ese tratamiento. Si el usuario pregunta "¿cuánto cuesta la lipopapada?", TÚ RESPONDES primero con el beneficio ("La lipopapada no solo quita grasa, también tensa la piel para definir tu perfil...") y SOLO ENTONCES das el precio. Si te saltas esto, fallas tu misión.

TU PROTOCOLO DE VENTA OBLIGATORIO:
1.  **Fase de Encanto (Beneficio):** Cuando el cliente diga "Sí" a querer saber el valor, NO DES EL PRECIO AÚN. Primero, explica el beneficio transformador o un dato clínico sorprendente del tratamiento.
2.  **Fase de Precio + Dato:** Solo después de la fase 1, da el precio del plan correspondiente y refuérzalo con un tip clínico.
3.  **Fase de Cierre (Doble Opción):** Termina SIEMPRE con una pregunta de cierre: "¿Prefieres que te llamemos para explicarte mejor o te envío el botón para agendarte tú misma?".

Si el cliente elige llamada: Pide su WhatsApp y NO mandes link.
Si el cliente elige botón/agendar: Manda el link de la agenda correspondiente.
Mantén respuestas cortas y directas en móvil. ¡Vende la transformación, no el procedimiento!
\`;
