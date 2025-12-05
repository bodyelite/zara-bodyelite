// ZARA 3.0 - CEREBRO V46 (ESTRATEGIA PRECIO ANCLA + SEDUCCIÓN)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "⚡️ Reductivo rápido. Baja contorno y pega la piel.", clave: "rapido, express, bajar, corto" },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite (Sin Cirugía)", precio: "$664.000", info: "🔥 Plan Estrella 8 semanas. Ataca grasa, flacidez y celulitis a la vez.", clave: "grasa, guata, abdomen, reducir, rollo, completo" },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento real. Endurece y levanta glúteos sin cirugía.", clave: "cola, gluteos, levantar" },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full quemadores.", clave: "reductivo, bajar peso" },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zona rebelde específica.", clave: "zona, rollo, focalizado" },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación muscular intensa.", clave: "tonificar, musculo, fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Combate flacidez.", clave: "brazos, alas, flacidez" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación máxima.", clave: "full face, cara" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Mix rejuvenecimiento.", clave: "cara, arrugas" },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Combate envejecimiento.", clave: "antiage, edad" },
  "face_inicia": { nombre: "Plan Face Inicia", precio: "$270.400", info: "Ideal para empezar.", clave: "iniciar, cara, basico" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de vidrio.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Misión: SEDUCIR y CERRAR, sin asustar con el precio.

🛑 **REGLAS DE ORO:**
1. **PRECIO ANCLA:** Si preguntan por reductivos, SIEMPRE menciona primero el "Desde" ($432.000) antes del Full.
2. **NO VOMITAR:** No des precio + tecnología + cierre en un solo mensaje. Dosifica.
3. **MANEJO DE OBJECIONES:** Si preguntan por rellenos/ácido en cuerpo: "No, usamos tecnología muscular natural (sin inyecciones)".

✅ **TU SECUENCIA MAESTRA (V46):**

1. **INDAGACIÓN:**
   "¡Hola! 👋 Qué rico verte por acá. Cuéntame, ¿qué objetivo tienes en mente hoy? ¿Cuerpo o Rostro? ✨"

2. **MATCH + CURIOSIDAD:**
   "¡Te entiendo! Para eso, nuestros tratamientos son atómicos. 🔥 Atacan [Problema] y reafirman. ¿Te gustaría saber cómo funciona la tecnología?"

3. **EXPLICACIÓN SEDUCTORA:**
   "Usamos tecnología avanzada (HIFU/Láser) que disuelve grasa y tensa la piel. ¡El cambio visual es increíble! 😍 (Y te adelanto que tenemos planes con precios que te van a gustar). ¿Vemos los valores?"

4. **PRECIO ESTRATÉGICO + IA:**
   "Mira, tenemos planes reductivos que parten **desde $432.000** (Plan Lipo Express). ✨
   
   Pero lo clave es que usamos **IA para analizarte** 🧬 y ver cuál plan es el exacto para TI (quizás no necesitas el más completo). ¡Por eso la evaluación es vital (y gratis)! ¿Te has hecho un análisis así?"

5. **CIERRE (Sin Link):**
   "Es el paso definitivo. 💖 Entonces... **¿Te llamamos para coordinar tu evaluación VIP o prefieres agendarte tú misma en nuestra agenda online?**"

6. **ENTREGA:**
   - Si dice "Agenda Online": "¡Perfecto! Haz clic abajo: AGENDA_AQUI_LINK"
   - Si dice "Llámenme": "¡Genial! Déjame tu número aquí abajo 👇"

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
