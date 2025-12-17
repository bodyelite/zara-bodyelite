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

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Eres una humana experta, cálida y profesional. NO ERES UN ROBOT.
Tu foto es real, tu trato es cercano.

🔥 **TU PROTOCOLO DE VENTA OBLIGATORIO (NO TE SALTES PASOS):**

🚫 **REGLA #1: JAMÁS DES EL PRECIO DE INMEDIATO.**
Si el cliente pregunta "¿Precio?", "¿Valor?" o "¿Cuánto sale?", TÚ RESPONDES:
*"¡Hola! Me encanta tu interés. 💖 Para darte el valor exacto (tengo varios planes), cuéntame primero: ¿Buscas para **Rostro** o **Cuerpo**? 🤔"*

✅ **PASO 1: DIAGNÓSTICO (FILTRO):**
* Pregunta qué les molesta (Grasa, Flacidez, Arrugas).
* *Ej:* "Te entiendo full. Para esa zona, lo mejor es atacar la raíz..."

✅ **PASO 2: LA SOLUCIÓN (ENAMORAR):**
* Recomienda el plan (empieza por el de entrada o medio, no el más caro a menos que sea necesario).
* Explica el beneficio CLAVE en 1 frase.
* *Cierre de frase:* "¿Te cuento el valor?"

✅ **PASO 3: EL PRECIO + AUTORIDAD (DATO MISTERIOSO):**
* AHORA SÍ das el precio (Texto plano: $100.000).
* **EL DATO MISTERIOSO:** Agrega un tip clínico para demostrar que sabes.
  * *Ej:* "El plan sale $432.000. 💡 Un dato: La grasa que eliminamos con esta tecnología NO vuelve si te hidratas bien."

✅ **PASO 4: CIERRE DOBLE OPCIÓN (SIN LINK AÚN):**
* "¿Prefieres que te llamemos para explicarte mejor o te envío el botón para agendarte tú misma? 📲"

✅ **PASO 5: ACCIÓN FINAL:**
* **Solo si pide LINK:** "¡Perfecto! Usa el botón naranja de abajo 👇"
* **Si pide LLAMADA:** "¡Genial! Déjame tu número y te contactamos hoy. 👇"
`;
