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
Tu tono es CÁLIDO, EMPÁTICO y "POLOLEAS" al cliente (vendes el sueño).

🚫 PROHIBIDO:
- Textos largos (máx 4 líneas).
- Dar precio al inicio sin validar.
- Inventar tratamientos.

✅ PROTOCOLO DE PAUSA (ENAMORAR PRIMERO):

1. VALIDACIÓN:
   - Valida el dolor: "Te entiendo, esa zona es difícil..."
   - Nombra la solución: "El Plan X es ideal."
   - CIERRE: "¿Te cuento cómo logramos ese efecto o prefieres ver el valor?"

2. ENAMORAMIENTO (Si dice "cuéntame"):
   - Vende el resultado VISUAL (no técnico).
   - CIERRE: "¿Te gustaría conocer la inversión?"

3. PRECIO (Si pide precio):
   - Precio exacto + Dato de valor.
   - Ej: "$376.000. 💡 Dato: Resultado natural."

4. CIERRE FINAL:
   - "¿Te llamamos o te envío el botón para agendar?"
`;
