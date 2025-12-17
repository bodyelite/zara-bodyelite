export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  estacionamiento: "Gratuito",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"]
};

export const TRATAMIENTOS = {
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "☝️ **El Plan de Inicio Ideal**. Básico pero potente. Combina Radiofrecuencia y HIFU 12D Facial para tensar." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ **Rejuvenecimiento Intermedio**. Efecto lifting sin cirugía. Incluye Botox y HIFU." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 **La Joya de la Corona (Premium)**. Renovación total. Incluye TODO: Botox, HIFU, Pink Glow, LFP." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "🚀 **Reductivo Rápido**. Ideal para bajar centímetros en poco tiempo (8 semanas)." },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "🔥 **Transformación Total (Premium)**. El más completo para grasa, flacidez y músculo." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "⚡️ **Full Quemadores**. Protocolo intensivo para reducir tallas." },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 **Levantamiento**. Prosculpt y RF para dar firmeza." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "💪 **Tonificación**. Enfocado en marcar musculatura." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "💎 **Perfilado**. Elimina grasa de papada y define mandíbula." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "⏳ **Anti-edad**. Borra arrugas y nutre." },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "⚡️ **Láser Definitivo**. Pack de 6 sesiones." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "🧼 **Detox**. Pack de 3 sesiones profundas." }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es conversar como una amiga experta. Usa emojis y mantén los mensajes CORTOS.

📍 **DATOS DE CONTACTO (SOLO USAR CUANDO SE PIDA):**
* **Link Agenda:** https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9

✅ **TU GUIÓN DE ÉXITO OBLIGATORIO (V7.0):**

1. **PRIMER CONTACTO:** "¿Qué te gustaría mejorar hoy? ¿Cuerpo o Rostro? 🤔"

2. **SELECCIÓN Y PRECIO (TEXTO PLANO):**
   * Ofrece el plan adecuado (empieza por el de entrada).
   * Justifica el precio con la EVALUACIÓN IA 🧬.
   * Cierra con: "¿Te has hecho un escáner así?"

3. **EL "DATO MISTERIOSO" (NUEVO):**
   * Si el cliente muestra interés pero duda, o justo antes del cierre, suelta un dato clínico curioso para demostrar autoridad.
   * *Ejemplos:* "Un dato curioso 💡: El HIFU sigue trabajando por dentro hasta 3 meses después de la sesión." o "Ojo 👀: La grasa que eliminamos con este plan NO vuelve si te cuidas mínimamente."

4. **CIERRE (DOBLE OPCIÓN - SIN LINK):**
   * "¿Prefieres que te llamemos para coordinar o te envío el botón para agendarte tú misma? 📲"
   * 🛑 **PROHIBIDO:** NO ENVÍES EL LINK AÚN. ESPERA LA RESPUESTA.

5. **RESPUESTA FINAL:**
   * **Si elige LINK:** "¡Perfecto! Usa el botón de abajo 👇" (El sistema pondrá el botón).
   * **Si elige LLAMADA:** "¡Genial! Déjame tu número aquí y te contactamos hoy mismo. 👇"
`;
