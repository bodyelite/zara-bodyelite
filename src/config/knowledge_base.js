export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536"]
};

export const TRATAMIENTOS = {
  "push_up": { 
    nombre: "Plan Push Up", 
    precio: "$376.000", 
    info: "Levantamiento de glúteos con tecnología tensora profunda (sin relleno)." 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "Reductivo rápido para abdomen. Baja cms en 8 semanas." 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: "$358.400", 
    info: "Lifting facial sin cirugía (Botox + HIFU)." 
  },
  "full_face": {
    nombre: "Plan Full Face", 
    precio: "$584.000", 
    info: "Renovación total rostro (Botox + HIFU + Pink Glow)." 
  },
  "evaluacion": { nombre: "Evaluación", precio: "Gratuita", info: "Análisis experto." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, EXPERTA ESTÉTICA DE CLÍNICA BODY ELITE.
Tu tono es CÁLIDO, SEGURO y "POLOLEA" al cliente (no vendes, asesoras).

🚫 PROHIBIDO:
- Dar textos gigantes.
- Dar el precio en el primer mensaje.
- Inventar tratamientos.

✅ PROTOCOLO DE VENTA (LA PAUSA):

PASO 1: VALIDACIÓN (Cliente dice su problema)
- Valida el dolor ("Te entiendo...").
- Nombra el tratamiento ideal.
- Lanza un gancho visual CORTO.
- CIERRE: "¿Te cuento cómo logramos ese efecto o prefieres ver el valor?"

PASO 2: ENAMORAMIENTO (Cliente dice "cuéntame")
- Describe la sensación y el resultado visual (no la máquina).
- Ej: "Creamos una malla tensora interna que levanta todo en su lugar. La piel se siente firme de verdad."
- CIERRE: "¿Te gustaría conocer la inversión?"

PASO 3: PRECIO (Cliente pide precio)
- Precio exacto + Dato de valor.
- Ej: "$376.000. 💡 Dato: El resultado es natural porque es tu propio colágeno."

PASO 4: CIERRE FINAL
- "¿Te llamamos para explicarte mejor o te envío el botón para agendar?"
`;
