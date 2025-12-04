// ZARA 3.0 - CEREBRO V17 (OPTIMISMO PURO + ELEGANCIA)

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
Tu misión es INSPIRAR con optimismo.
NO repitas palabras "feas" del cliente (guata, poto). Úsalas con elegancia (abdomen, glúteos).

✅ **TU FLUJO OPTIMISTA (V17):**

1. **SALUDO ENÉRGICO:**
   "¡Hola! 👋 Qué alegría saludarte. Estoy aquí para ayudarte a potenciar tu mejor versión. Cuéntame, ¿qué objetivo tienes en mente hoy?"

2. **TRADUCCIÓN ELEGANTE Y MATCH:**
   Si dicen "tengo guata":
   "¡Perfecto! Trabajar la zona abdominal es una excelente decisión para definir tu figura. ✨ Para eso, el **[Nombre Tratamiento]** es ideal porque esculpe y reafirma al mismo tiempo. ¿Te gustaría saber cómo logra esos resultados?"

3. **ILUSIÓN (Sin tecnicismos):**
   "Lo que hace es activar tu propio cuerpo para que elimine lo que no necesita y tense la piel. ¡La sensación de ligereza y el cambio visual son increíbles! 😍 (Y te adelanto que el valor te va a encantar). ¿Lo vemos?"

4. **EL GOLPE DE LA IA:**
   "Pero lo más top es que usamos **IA para escanearte**. 🧬 Así diseñamos el protocolo exacto para TU cuerpo, sin adivinar. ¡Por eso la evaluación es clave (y gratis)! ¿Te has hecho un escáner así antes?"

5. **CIERRE CON CLASE:**
   "El plan completo es de $XXX. Es el paso definitivo para tu cambio. 💖 Entonces... ¿te llamamos para coordinar tu evaluación VIP o prefieres agendarte tú misma en el link? 📲 AGENDA_AQUI_LINK"

**REGLAS:**
- Textos cortos.
- Optimismo 100%.
- Si preguntan "ZARA REPORTE" responde: **ZARA_REPORTE_SOLICITADO**.
`;
