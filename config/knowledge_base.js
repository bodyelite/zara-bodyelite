// ZARA 3.0 - CEREBRO V10 (ROMANCE + PATRONES IA + CIERRE SERVICIAL)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000",
    info: "⚡️ Reductivo rápido. Baja contorno y pega la piel.",
    clave: "rapido, express, bajar, corto"
  },
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite (Sin Cirugía)",
    precio: "$664.000",
    info: "🔥 Plan Estrella. 8 semanas. Ataca grasa, flacidez y celulitis a la vez con HIFU 12D y Lipoláser.",
    clave: "grasa, guata, abdomen, reducir, rollo, completo"
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real. Endurece y levanta glúteos sin cirugía.",
    clave: "cola, gluteos, levantar, poto"
  },
  "lipo_reductiva": {
    nombre: "Plan Lipo Reductiva",
    precio: "$480.000",
    info: "Full quemadores para reducir centímetros.",
    clave: "reductivo, bajar peso"
  },
  "lipo_focalizada": {
    nombre: "Plan Lipo Focalizada",
    precio: "$348.800",
    info: "Para atacar esa zona rebelde específica.",
    clave: "zona, rollo, focalizado"
  },
  "body_fitness": {
    nombre: "Plan Body Fitness",
    precio: "$360.000",
    info: "Tonificación muscular intensa. Define y marca.",
    clave: "tonificar, musculo, fitness"
  },
  "body_tensor": {
    nombre: "Plan Body Tensor",
    precio: "$232.000",
    info: "Combate la flacidez en brazos o piernas.",
    clave: "brazos, alas, flacidez, piernas"
  },
  "full_face": {
    nombre: "Plan Full Face",
    precio: "$584.000",
    info: "👑 Renovación máxima de rostro.",
    clave: "full face, cara completa, premium"
  },
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400",
    info: "✨ Mix rejuvenecimiento (Toxina + Pink Glow).",
    clave: "cara, arrugas, manchas, rejuvenecer"
  },
  "lipo_papada": {
    nombre: "Plan Lipo Papada",
    precio: "$313.600",
    info: "💎 Elimina papada y perfila el rostro.",
    clave: "papada, cuello, cara gorda"
  },
  "face_antiage": {
    nombre: "Plan Face Antiage",
    precio: "$281.600",
    info: "Combate el envejecimiento con tecnología.",
    clave: "antiage, edad, arrugas"
  },
  "face_inicia": {
    nombre: "Plan Face Inicia",
    precio: "$270.400",
    info: "Ideal para empezar a cuidar tu rostro.",
    clave: "iniciar, cara, basico"
  },
  "face_smart": {
    nombre: "Plan Face Smart",
    precio: "$198.400",
    info: "Revitalización inteligente de piel.",
    clave: "smart, piel, rostro"
  },
  "face_one": {
    nombre: "Plan Face One",
    precio: "$169.600",
    info: "Sesión de alto impacto facial.",
    clave: "one, sesion, hifu"
  },
  "exosomas": {
    nombre: "Exosomas",
    precio: "$152.000",
    info: "🧬 Regeneración avanzada de piel y cicatrices.",
    clave: "cicatrices, acné, exosoma"
  },
  "limpieza_full": {
    nombre: "Limpieza Facial Full",
    precio: "$120.000",
    info: "Limpieza profunda con aparatología.",
    clave: "limpieza, granos, puntos negros"
  },
  "depilacion_grande": { nombre: "Depilación Zona Grande", precio: "$288.000", info: "Piernas completas, espalda.", clave: "piernas, espalda" },
  "depilacion_full": { nombre: "Depilación Full Body", precio: "$259.200", info: "Cuerpo completo promo.", clave: "cuerpo completo, todo" },
  "depilacion_mediana": { nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Media pierna, rebaje.", clave: "media pierna, rebaje" },
  "depilacion_pequena": { nombre: "Depilación Zona Pequeña", precio: "$192.000", info: "Axilas, rostro.", clave: "axila, bozo, cara" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas de expresión.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de vidrio, hidratación.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es CONVERSAR, SEDUCIR y generar MISTERIO antes de cerrar.
NO VOMITES INFORMACIÓN. Dosifica.

✅ **TU ESTRATEGIA DE ROMANCE (4 PASOS):**

1. **EL COQUETEO (Indagación):**
   Si te saludan o piden precio, NO LO DES.
   Pregunta primero por su "dolor" con empatía.
   Ej: "¡Hola! 👋 Me encanta que preguntes. Pero cuéntame antes... ¿qué es lo que te tiene incómoda de esa zona? ¿Es grasita localizada o sientes flacidez? 🤔"

2. **LA INTRIGA (Patrones + Promesa):**
   Cuando respondan, valida y menciona los "patrones" y la IA.
   Ej: "¡Te entiendo mil! Es súper común. Lo interesante es que existen ciertos **patrones** en el cuerpo que la tecnología detecta. ✨ Tenemos planes que se ajustan perfecto a eso. ¿Te gustaría saber cómo los personalizamos? (Te adelanto que los precios te van a gustar 😉)."

3. **EL GOLPE DE VALOR (La Evaluación IA):**
   Explica por qué la evaluación es el secreto.
   Ej: "La clave es nuestra **Tecnología Asistida por IA**. 🧬 Escaneamos tu cuerpo para adaptar el protocolo exacto a TI. Por eso es vital que te evalúes (¡y es gratis!). Así no gastas de más en algo que no necesitas."

4. **EL CIERRE ROMÁNTICO (Doble Opción):**
   Da el precio (parte por el Lipo Express si aplica) y ofrece servicio.
   Ej: "Para que te hagas una idea, el Plan Lipo Express sale $432.000 (y el Full $664.000). Entonces... ¿cómo prefieres asegurar tu evaluación gratis? ¿Te llamamos nosotras para coordinar o prefieres autoagendarte en el link? 📲"

**REGLAS:**
- Textos cortos (máx 2-3 líneas).
- Usa emojis para suavizar.
- Si preguntan "ZARA REPORTE" responde: **ZARA_REPORTE_SOLICITADO**.
`;
