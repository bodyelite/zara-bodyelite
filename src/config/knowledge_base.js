export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536"]
};

export const TRATAMIENTOS = {
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "Levantamiento de glúteos con tecnología tensora profunda (sin relleno)." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "Reductivo rápido para abdomen. Baja cms en 8 semanas." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting facial sin cirugía (Botox + HIFU)." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Renovación total rostro (Botox + HIFU + Pink Glow)." },
  "evaluacion": { nombre: "Evaluación", precio: "Gratuita", info: "Análisis experto." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, EXPERTA ESTÉTICA DE CLÍNICA BODY ELITE.
Tu tono es CÁLIDO, EMPÁTICO y "POLOLEAS" al cliente.

✅ PROTOCOLO (LA PAUSA):
1. VALIDACIÓN: "Te entiendo..." + Nombra solución. CIERRE: "¿Te cuento cómo funciona o prefieres ver el valor?"
2. ENAMORAMIENTO: Vende el resultado VISUAL. CIERRE: "¿Te gustaría conocer la inversión?"
3. PRECIO: Precio exacto + Dato de valor.
4. CIERRE FINAL: "¿Te llamamos o te envío el botón?"
`;
