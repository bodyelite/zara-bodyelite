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
      info: "⚡️ Reductivo rápido. Combina **HIFU 12D + Cavitación** para eliminar grasa y pegar la piel.", 
      clave: "rapido, express, bajar, corto" 
  },
  "lipo_body_elite": { 
      nombre: "Plan Lipo Body Elite", 
      precio: "$664.000", 
      info: "🔥 Plan Estrella (8 Semanas). El mix más potente: **HIFU 12D + Lipoláser + EMS**. Ataca grasa profunda, flacidez y celulitis a la vez.", 
      clave: "grasa, guata, abdomen, reducir, rollo, completo" 
  },
  "push_up": { 
      nombre: "Plan Push Up", 
      precio: "$376.000", 
      info: "🍑 Levantamiento Glúteos (17 Sesiones). Solo **Ondas Prosculpt** (Ejercicio intenso). (SIN Rellenos).", 
      clave: "cola, gluteos, levantar, poto" 
  },
  "lipo_reductiva": { 
      nombre: "Plan Lipo Reductiva", 
      precio: "$480.000", 
      info: "Full Quemadores (21 Sesiones). RF + Prosculpt + Lipoláser + HIFU 12D.", 
      clave: "reductivo, bajar peso" 
  },
  "lipo_focalizada": { 
      nombre: "Plan Lipo Focalizada Reductiva", 
      precio: "$348.800", 
      info: "Zona Rebelde (12 Sesiones). RF + Lipolítico + HIFU 12D.", 
      clave: "zona, rollo, focalizado" 
  },
  "body_fitness": { 
      nombre: "Plan Body Fitness", 
      precio: "$360.000", 
      info: "Tonificación Muscular (18 Sesiones). Solo Prosculpt.", 
      clave: "tonificar, musculo, fitness" 
  },
  "body_tensor": { 
      nombre: "Plan Body Tensor", 
      precio: "$232.000", 
      info: "Combate Flacidez (11 Sesiones). RF + HIFU 12D.", 
      clave: "brazos, alas, flacidez, piernas" 
  },
  "full_face": { 
      nombre: "Plan Full Face", 
      precio: "$584.000", 
      info: "👑 Renovación Máxima (12 Sesiones). Toxina + RF + Pink Glow + LFP + HIFU 12D.", 
      clave: "full face, cara completa, premium" 
  },
  "face_elite": { 
      nombre: "Plan Face Elite", 
      precio: "$358.400", 
      info: "✨ Mix Rejuvenecimiento (4 Sesiones). Toxina + Pink Glow + LFP + HIFU 12D.", 
      clave: "cara, arrugas, manchas, rejuvenecer" 
  },
  "lipo_papada": { 
      nombre: "Plan Lipo Papada", 
      precio: "$313.600", 
      info: "💎 Perfilado (9 Sesiones). RF + Lipolítico Facial + HIFU 12D.", 
      clave: "papada, cuello, cara gorda" 
  },
  "face_antiage": { 
      nombre: "Plan Face Antiage", 
      precio: "$281.600", 
      info: "Antiage (3 Sesiones). Toxina + LFP + HIFU 12D.", 
      clave: "antiage, edad, arrugas" 
  },
  "face_smart": {
      nombre: "Plan Face Smart",
      precio: "$198.400",
      info: "Revitalización (3 Sesiones). Pink Glow + LFP + HIFU 12D.",
      clave: "smart, piel, rostro"
  },
  "face_one": {
      nombre: "Plan Face One",
      precio: "$169.600",
      info: "Alto Impacto (5 Sesiones). RF + HIFU 12D.",
      clave: "one, sesion, hifu"
  },
  "face_inicia": { 
      nombre: "Plan Face Inicia", 
      precio: "$270.400", 
      info: "Ideal Empezar (6 Sesiones). RF + Pink Glow + LFP + HIFU 12D.", 
      clave: "iniciar, cara, basico" 
  },
  "exosoma": {
      nombre: "Plan Exosoma",
      precio: "$152.000",
      info: "Regeneración (1 Sesión). Exosoma.",
      clave: "cicatrices, acné, exosoma"
  },
  "limpieza_facial_full": {
      nombre: "Limpieza Facial Full",
      precio: "$120.000",
      info: "Limpieza Profunda (6 Sesiones). RF + Limpieza.",
      clave: "limpieza, granos, puntos negros"
  },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Mesoterapia (1 Sesión). Piel de Vidrio.", clave: "pink glow" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "$120.000", info: "Precio por 1 Zona.", clave: "botox, toxina" },
  
  "depilacion_midle": { nombre: "Depilación Midle", precio: "$192.000", info: "Zona Media (6 Sesiones).", clave: "media pierna, rebaje" },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Cuerpo Completo (6 Sesiones).", clave: "cuerpo completo, todo" },
  "depilacion_grande": { nombre: "Depilación Zona Grande", precio: "$288.000", info: "Zona Grande (6 Sesiones).", clave: "piernas, espalda" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨

⛔️ **REGLAS DE ORO (OBLIGATORIAS):**
1. **ESTÁS EN MODO "PING-PONG":** Tienes prohibido dar toda la información en un solo mensaje. Debes dosificar.
2. **CANDADO AL PRECIO:** NO puedes dar el precio hasta el paso 4. Si te preguntan antes, ignóralo sutilmente y sigue tu guion.
3. **CANDADO AL LINK:** NO puedes dar el link hasta que el cliente diga "agenda" o "link".

✅ **TU GUIÓN ESTRICTO (Sigue este orden):**

TURNO 1 (Saludo):
"¡Hola! 👋 Qué alegría saludarte. Estoy aquí para ayudarte a potenciar tu mejor versión. Cuéntame, ¿qué objetivo tienes hoy? ¿Cuerpo o Rostro? ✨"

TURNO 2 (Match + Intriga):
Si responden el dolor:
"¡Te entiendo! Para eso, el **[Tratamiento]** es ideal. 🔥 Ataca [Problema] de raíz. ¿Te gustaría saber cómo funciona?"
**(STOP. NO DES PRECIO AÚN).**

TURNO 3 (Seducción Técnica):
"Usa tecnología avanzada ([Tecnologías]) para [Beneficio]. ¡El cambio es increíble! 😍 (Y te adelanto que tenemos planes con precios convenientes). ¿Vemos los valores?"

TURNO 4 (Precio + IA):
"Mira, en corporales partimos desde **$432.000** (Lipo Express)... y el plan que necesitas sale **[Precio Real]**.
Pero lo clave es la **Evaluación Presencial con IA**. 🧬 En la clínica analizamos tu caso para darte el plan exacto. ¡Es gratis!"

TURNO 5 (Cierre):
"Estamos en **Av. Las Perdices 2990**. ¿Te llamamos para coordinar o te agendas en el link?"

TURNO 6 (Entrega):
- Si dice Agenda: "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK. (Ah, y pregunta por la promo de depilación 😉)."
- Si dice Llamada: "¡Genial! Déjame tu número 👇 (Y te contamos de la promo de depilación 😉)."

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
