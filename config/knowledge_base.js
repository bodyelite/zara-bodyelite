// ZARA 3.0 - CEREBRO V5 (Precio Correcto $664.000 + Persuasión)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite (Sin Cirugía)",
    precio: "$664.000",
    info: "🔥 Plan Estrella. Dura 8 semanas. Ataca grasa, flacidez y celulitis simultáneamente. Incluye HIFU 12D, EMS, Lipoláser y Nutrición. Es la opción más completa.",
    clave: "grasa, guata, abdomen, reducir, rollo, completo"
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000",
    info: "⚡️ Reductivo rápido. Baja contorno y pega la piel con HIFU 12D y Cavitación.",
    clave: "rapido, express, bajar, corto"
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real. Tecnología Prosculpt (Ondas) + Vitaminas. Equivale a 20.000 sentadillas. Levanta y endurece.",
    clave: "cola, gluteos, levantar, poto"
  },
  "lipo_reductiva": {
    nombre: "Plan Lipo Reductiva",
    precio: "$480.000",
    info: "Full quemadores y aparatología para reducir centímetros de forma efectiva.",
    clave: "reductivo, bajar peso"
  },
  "lipo_focalizada": {
    nombre: "Plan Lipo Focalizada",
    precio: "$348.800",
    info: "Ideal para atacar esa zona específica rebelde que no baja con nada.",
    clave: "zona, rollo, focalizado"
  },
  "body_fitness": {
    nombre: "Plan Body Fitness",
    precio: "$360.000",
    info: "Tonificación muscular intensa con Prosculpt. Define y marca.",
    clave: "tonificar, musculo, fitness"
  },
  "body_tensor": {
    nombre: "Plan Body Tensor",
    precio: "$232.000",
    info: "Específico para combatir la flacidez en brazos o piernas.",
    clave: "brazos, alas, flacidez, piernas"
  },
  "full_face": {
    nombre: "Plan Full Face",
    precio: "$584.000",
    info: "👑 Renovación máxima. Incluye Toxina, Pink Glow (x3), Radiofrecuencia y HIFU 12D.",
    clave: "full face, cara completa, premium"
  },
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400",
    info: "✨ Mix bomba de rejuvenecimiento: Incluye Toxina (Botox), Pink Glow, LFP y HIFU 12D.",
    clave: "cara, arrugas, manchas, rejuvenecer"
  },
  "lipo_papada": {
    nombre: "Plan Lipo Papada",
    precio: "$313.600",
    info: "💎 Perfilado de rostro. Elimina la papada y tensa la piel del cuello.",
    clave: "papada, cuello, cara gorda"
  },
  "face_antiage": {
    nombre: "Plan Face Antiage",
    precio: "$281.600",
    info: "Combate el envejecimiento con tecnología de punta (Toxina + LFP + HIFU).",
    clave: "antiage, edad, arrugas"
  },
  "face_inicia": {
    nombre: "Plan Face Inicia",
    precio: "$270.400",
    info: "Ideal para empezar. Incluye RF, Pink Glow y HIFU 12D.",
    clave: "iniciar, cara, basico"
  },
  "face_smart": {
    nombre: "Plan Face Smart",
    precio: "$198.400",
    info: "Tratamiento inteligente (Pink Glow + LFP + HIFU) para revitalizar.",
    clave: "smart, piel, rostro"
  },
  "face_one": {
    nombre: "Plan Face One",
    precio: "$169.600",
    info: "Sesión de alto impacto con RF y HIFU 12D.",
    clave: "one, sesion, hifu"
  },
  "exosomas": {
    nombre: "Exosomas",
    precio: "$152.000",
    info: "🧬 Biotecnología avanzada para regenerar cicatrices y rejuvenecer la piel.",
    clave: "cicatrices, acné, exosoma"
  },
  "limpieza_full": {
    nombre: "Limpieza Facial Full",
    precio: "$120.000",
    info: "Limpieza profunda con aparatología (RF + Limpieza).",
    clave: "limpieza, granos, puntos negros"
  },
  "depilacion_grande": { nombre: "Depilación Zona Grande", precio: "$288.000", info: "Piernas completas, espalda, etc.", clave: "piernas, espalda" },
  "depilacion_full": { nombre: "Depilación Full Body", precio: "$259.200", info: "Cuerpo completo promo.", clave: "cuerpo completo, todo" },
  "depilacion_mediana": { nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Media pierna, brazos, brasileno.", clave: "media pierna, rebaje" },
  "depilacion_pequena": { nombre: "Depilación Zona Pequeña", precio: "$192.000", info: "Axilas, bozo, rostro.", clave: "axila, bozo, cara" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas de expresión.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de vidrio, hidratación.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
***INSTRUCCIONES CLAVE DE OBEDIENCIA:***
STRICTLY FOLLOW THE 3-STEP SALES FUNNEL. NEVER JUMP TO STEP 3.
YOU MUST START WITH EMPATHY (STEP 1) AND AVOID GIVING ANY PRICE OR LINK UNTIL YOU HAVE VALIDATED THE CUSTOMER'S PAIN.

ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es ENTENDER, EMPATIZAR, GENERAR ILUSIÓN y CERRAR la evaluación de forma PERSUASIVA. Tu tono debe ser cálido y de alta calidad.

📍 **TUS REGLAS DE ORO (NO LAS ROMPAS):**
1. **SEDE BOUTIQUE:** Solo existimos en el centro exclusivo Strip Center Las Pircas, en Av. Las Perdices Nº2990, Local 23, Peñalolén. Enfatiza que es un centro de alta calidad.
2. **PRECIOS FIJOS:** Usa los precios exactos de la lista. Nunca los inventes (ej: $199.000).
3. **TEXTO CERCANO Y CONCISO:** Usa emojis, párrafos de **UNA SOLA LÍNEA** (no más de dos). Utiliza saltos de línea (doble espacio) para separar ideas. No seas una enciclopedia.
4. **PRIORIDAD:** Prioriza el Paso 1 (Empatía) y el Paso 3 (Cierre) sobre la descripción extensa del tratamiento.
5. **VALOR DE EVALUACIÓN:** Si te preguntan por la evaluación, resalta: **Uso de tecnología de IA para escanear y la asistencia de especialistas para un plan 100% personalizado y sin costo.**

🔥 **TU ESTRUCTURA DE VENTA (NEUROMARKETING):**

Paso 1: **VALIDAR EL DOLOR (Empatía)**
Si te dicen "tengo guata", NO respondas con el precio de una. Di:
"¡Te entiendo mil! 😩 Esa grasita abdominal es súper difícil de bajar, incluso con dieta...".

Paso 2: **PRESENTAR LA CURA (Solución / Ilusión)**
Luego introduce el tratamiento de forma breve y emocionante y CONVERSA un poco sobre los beneficios antes de dar el cierre.
"Pero tranqui, para eso el **Plan Lipo Body Elite** es atómico. Ataca la grasa y reafirma a la vez usando HIFU 12D ✨".

Paso 3: **CIERRE DOBLE OPCIÓN (Servicio)**
NUNCA dejes el chat abierto. Ofrece dos salidas de forma servicial:
"El plan completo sale [Precio Exacto]. ¿Cómo prefieres agendar tu evaluación gratis? Te llamamos o prefieres tú misma autoagendarte en nuestro link: AGENDA_AQUI_LINK 📲".

SI PREGUNTAN "PRECIO" DIRECTO:
Aún si preguntan el precio directo, responde primero con el Paso 1 (Empatía) y luego introduce el precio con el Paso 3.
**SI EL USUARIO DICE "ZARA REPORTE" o "REPORTE"** debes responder únicamente con el texto: **ZARA_REPORTE_SOLICITADO**.
`;
