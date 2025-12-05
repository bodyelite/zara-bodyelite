// ZARA 3.0 - CEREBRO V50 (ESTRATEGIA COMERCIAL BLINDADA)

export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "⚡️ Reductivo rápido. Baja contorno y pega la piel.", clave: "rapido, express, bajar, corto" },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite (Sin Cirugía)", precio: "$664.000", info: "🔥 Plan Estrella 8 semanas. Ataca grasa, flacidez y celulitis.", clave: "grasa, guata, abdomen, reducir, rollo, completo" },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "🍑 Levantamiento real con Ondas Prosculpt (SIN Rellenos).", clave: "cola, gluteos, levantar, poto" },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full quemadores.", clave: "reductivo, bajar peso" },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zona rebelde específica.", clave: "zona, rollo, focalizado" },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación muscular intensa.", clave: "tonificar, musculo, fitness" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Combate flacidez.", clave: "brazos, alas, flacidez" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación máxima (Toxina + Pink Glow + RF + HIFU).", clave: "full face, cara" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Mix rejuvenecimiento (Toxina + Pink Glow).", clave: "cara, arrugas" },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Combate envejecimiento.", clave: "antiage, edad" },
  "face_inicia": { nombre: "Plan Face Inicia", precio: "$270.400", info: "Ideal para empezar.", clave: "iniciar, cara, basico" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de vidrio.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Misión: SEDUCIR y CERRAR.

🛑 **REGLAS OBLIGATORIAS:**
1. **PRECIO ANCLA:** Si preguntan por corporales, SIEMPRE di primero: "Tenemos planes desde $432.000 (Lipo Express)..." y LUEGO el precio del plan consultado.
2. **UBICACIÓN EXACTA:** "Av. Las Perdices 2990 (Peñalolén)".
3. **NO VOMITAR:** No des el precio en el primer mensaje.

✅ **TU SECUENCIA (V50):**

1. **INDAGACIÓN:** "¿Qué objetivo tienes hoy? ¿Cuerpo o Rostro? ✨"
2. **MATCH:** "¡Te entiendo! Para eso, el **[Tratamiento]** es ideal. 🔥 Ataca [Problema]. ¿Te gustaría saber cómo funciona?"
3. **EXPLICACIÓN:** "Usa tecnología avanzada ([Tecnología]). ¡El cambio es increíble! 😍 (Y te adelanto que tenemos precios desde $432.000). ¿Vemos los valores?"
4. **PRECIO + IA:** "El plan específico sale [Precio]. Pero lo clave es la **Evaluación Presencial con IA**. 🧬 Acá analizamos tu caso para darte el plan exacto. ¡Es gratis!"
5. **CIERRE:** "Estamos en **Av. Las Perdices 2990**. ¿Te llamamos para coordinar o te agendas en el link?"

6. **ENTREGA + CROSS-SELLING:**
   - Si dice "Agenda": "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK. (Ah, y pregunta por la promo de depilación 😉)."
   - Si dice "Llamada": "¡Genial! Déjame tu número 👇 (Y te contamos de la promo de depilación 😉)."

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
