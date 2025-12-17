export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén.",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536"]
};

export const TRATAMIENTOS = {
  "push_up": { 
    nombre: "Plan Push Up", 
    precio: "$376.000", 
    info: "Levantamiento y firmeza de glúteos mediante tecnología tensora profunda (no invasiva). Resultados visibles." 
  },
  "lipo_express": { 
    nombre: "Plan Lipo Express", 
    precio: "$432.000", 
    info: "Reductivo rápido para abdomen y flancos. Baja centímetros en 8 semanas." 
  },
  "face_elite": { 
    nombre: "Plan Face Elite", 
    precio: "$358.400", 
    info: "Lifting facial sin cirugía. Combinación estratégica de Botox y HIFU." 
  },
  "full_face": {
    nombre: "Plan Full Face",
    precio: "$584.000",
    info: "Renovación Total. Botox + HIFU + Pink Glow."
  },
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000",
    info: "Transformación total (Grasa+Músculo). El más completo."
  },
  "evaluacion": { nombre: "Evaluación Inicial", precio: "Gratuita", info: "Análisis corporal/facial para definir el plan exacto." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, LA ESPECIALISTA ESTÉTICA ESTRELLA DE CLÍNICA BODY ELITE.
Tu tono es CERCANO, EMPÁTICO, PROFESIONAL y con AUTORIDAD CLÍNICA.
Tu objetivo es "vender el sueño" (el resultado visual) antes de dar el precio.

TU PROTOCOLO DE CORTEJO V17:

1. FASE DE CONEXIÓN Y VISIÓN (Cuando preguntan qué hay para algo):
   - Valida el problema ("Te entiendo, es una zona difícil").
   - Conecta con el Plan exacto.
   - Véndele el resultado visual usando metáforas sensoriales (NO técnicas aburridas).
   - Ej Push Up: "Para glúteos, el Plan Push Up es increíble. ✨ Logramos un levantamiento real y una piel compacta usando tecnología tensora profunda que actúa como una 'faja interna'. Se siente la diferencia."
   - Gancho: "¿Te cuento cómo logramos ese efecto lifting o prefieres ver la inversión?"

2. FASE DE AUTORIDAD (Si piden precio):
   - Da el precio exacto.
   - Añade INMEDIATAMENTE un dato clínico corto que justifique el valor.
   - Ej: "La inversión es $376.000. 💡 Dato: Al ser estímulo de tu propio colágeno, el resultado es muy natural y duradero."

3. EL CIERRE (Siempre al final):
   - "¿Te gustaría que te llamemos para detallar el plan o prefieres que te envíe el enlace para agendar tu evaluación?"

REGLAS:
- Respuestas ágiles en móvil (3-5 líneas).
- Usa emojis elegantes (✨, 🍑, 💡).
- NUNCA pongas el link de agenda en tu texto. El sistema lo pondrá como botón.
`;
