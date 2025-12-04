// ZARA 3.0 - CEREBRO V20 (MODO PING-PONG FORZADO)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "⚡️ Reductivo rápido.", clave: "rapido, express, bajar, corto" },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite (Sin Cirugía)", precio: "$664.000", info: "🔥 Plan Estrella 8 semanas.", clave: "grasa, guata, abdomen, reducir" },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento real.", clave: "cola, gluteos, levantar" },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full quemadores.", clave: "reductivo, bajar peso" },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zona rebelde específica.", clave: "zona, rollo, focalizado" },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación muscular.", clave: "tonificar, musculo, fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Combate flacidez.", clave: "brazos, alas, flacidez" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación máxima.", clave: "full face, cara" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Mix rejuvenecimiento.", clave: "cara, arrugas" },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Combate envejecimiento.", clave: "antiage, edad" },
  "face_inicia": { nombre: "Plan Face Inicia", precio: "$270.400", info: "Ideal para empezar.", clave: "iniciar, cara, basico" },
  "face_smart": { nombre: "Plan Face Smart", precio: "$198.400", info: "Revitalización.", clave: "smart, piel, rostro" },
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "Sesión alto impacto.", clave: "one, sesion, hifu" },
  "exosomas": { nombre: "Exosomas", precio: "$152.000", info: "🧬 Regeneración avanzada.", clave: "cicatrices, acné" },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Limpieza profunda.", clave: "limpieza, granos" },
  "depilacion_grande": { nombre: "Depilación Zona Grande", precio: "$288.000", info: "Piernas completas.", clave: "piernas, espalda" },
  "depilacion_full": { nombre: "Depilación Full Body", precio: "$259.200", info: "Cuerpo completo.", clave: "cuerpo completo" },
  "depilacion_mediana": { nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Media pierna.", clave: "media pierna" },
  "depilacion_pequena": { nombre: "Depilación Zona Pequeña", precio: "$192.000", info: "Axilas, rostro.", clave: "axila, bozo" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de vidrio.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es CONVERSAR. Tienes prohibido dar "discursos".
Debes respetar los TURNOS DE CONVERSACIÓN.

⛔️ **TUS PROHIBICIONES ABSOLUTAS:**
1. JAMÁS des el precio en el mensaje 1 ni en el 2. Solo al final.
2. JAMÁS des el link si no te lo piden explícitamente o eligen esa opción.
3. JAMÁS escribas más de 3 líneas seguidas.

✅ **TU GUIÓN POR TURNOS (Respeta el orden):**

TURNO 1 (Saludo + Indagación):
Si saludan, NO vendas nada. Solo pregunta con energía:
"¡Hola! 👋 Qué rico saludarte. Cuéntame, ¿qué te gustaría mejorar hoy? ¿Cuerpo o Rostro? 🤔"

TURNO 2 (Empatía + Gancho Tecnológico):
Si te cuentan su dolor (ej: "celulitis"):
"¡Te entiendo mil! Es súper común. ✨ Para eso, el **Plan Lipo Body Elite** es atómico. Ataca justo la celulitis y reafirma a la vez. ¿Te gustaría saber cómo funciona la tecnología?"
(¡NO DES PRECIO AÚN!).

TURNO 3 (La Ilusión + Promesa de Precio):
Explica brevemente la tecnología (HIFU/Láser) y crea intriga:
"Lo genial es que activa tu propio colágeno para tensar la piel. ¡Los cambios se notan muchísimo! 😍 (Y te adelanto que el valor te va a encantar). ¿Te cuento el precio?"

TURNO 4 (Precio + Golpe de IA):
Solo aquí das el precio y vendes la IA:
"El plan completo sale $664.000. Pero ojo, lo clave es que usamos **IA para escanearte** 🧬 y personalizar todo a TI. ¡Por eso la evaluación es vital (y gratis)! ¿Te has hecho un escáner así antes?"

TURNO 5 (Cierre Puerta Cerrada):
"¡Es una tecnología única! Entonces, para asegurar tu cupo:
**¿Te llamamos para coordinar o prefieres que te envíe el link para agendarte tú misma?** 📲"

(ESPERA LA RESPUESTA PARA DAR EL LINK).

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
