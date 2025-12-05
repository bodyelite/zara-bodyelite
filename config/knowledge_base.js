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
      nombre: "Plan Lipo Body Elite (Sin Cirugía)", 
      precio: "$664.000", 
      info: "🔥 Plan Estrella (8 Semanas). El mix más potente: **HIFU 12D + Lipoláser + EMS**. Ataca grasa profunda, flacidez y celulitis a la vez.", 
      clave: "grasa, guata, abdomen, reducir, rollo, completo" 
  },
  "lipo_focalizada": { 
      nombre: "Plan Lipo Focalizada", 
      precio: "$348.800", 
      info: "Ideal para zonas rebeldes. Usa **Lipoláser + Masaje Reductivo** para atacar grasa localizada específica.", 
      clave: "zona, rollo, focalizado, muslos" 
  },
  "push_up": { 
      nombre: "Plan Push Up Glúteos", 
      precio: "$376.000", 
      info: "🍑 Levantamiento Muscular (17 Sesiones). Solo **Ondas Prosculpt** (20.000 contracciones). (SIN Rellenos).", 
      clave: "cola, gluteos, levantar, poto" 
  },
  "lipo_reductiva": { 
      nombre: "Plan Lipo Reductiva", 
      precio: "$480.000", 
      info: "Full Quemadores + Aparatología (21 Sesiones).", 
      clave: "reductivo, bajar peso" 
  },
  "body_fitness": { 
      nombre: "Plan Body Fitness", 
      precio: "$360.000", 
      info: "Tonificación Muscular Intensa (18 Sesiones).", 
      clave: "tonificar, musculo, fitness" 
  },
  "body_tensor": { 
      nombre: "Plan Body Tensor", 
      precio: "$232.000", 
      info: "Combate Flacidez (11 Sesiones) con **Radiofrecuencia Tripolar**.", 
      clave: "brazos, alas, flacidez, piernas" 
  },
  "full_face": { 
      nombre: "Plan Full Face", 
      precio: "$584.000", 
      info: "👑 Renovación Máxima. Botox + Pink Glow + RF + HIFU.", 
      clave: "full face, cara completa, premium" 
  },
  "face_elite": { 
      nombre: "Plan Face Elite", 
      precio: "$358.400", 
      info: "✨ Mix Rejuvenecimiento. Botox + Pink Glow.", 
      clave: "cara, arrugas, manchas, rejuvenecer" 
  },
  "lipo_papada": { 
      nombre: "Plan Lipo Papada", 
      precio: "$313.600", 
      info: "💎 Perfilado (9 Sesiones). HIFU Facial + Enzimas.", 
      clave: "papada, cuello, cara gorda" 
  },
  "face_antiage": { 
      nombre: "Plan Face Antiage", 
      precio: "$281.600", 
      info: "Antiage (3 Sesiones). RF + Vitaminas.", 
      clave: "antiage, edad, arrugas" 
  },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas de expresión.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Mesoterapia Piel de Vidrio.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Misión: SEDUCIR con lógica impecable.

🛑 **REGLAS DE PRECIOS (INTELIGENCIA):**
1. **SI VENDES LIPO BODY ELITE ($664k) O REDUCTIVA ($480k):**
   Usa la técnica del ancla: "Tenemos planes desde $432.000 (Express)... y el tuyo sale [Precio]".
2. **SI VENDES PLANES MENORES ($380k o menos):**
   NO uses el ancla de $432.000 (sería ilógico). Da el precio directo y destaca que es una oportunidad.
   Ej: "Este plan específico sale solo [Precio]. ¡Es súper conveniente!"

✅ **TU SECUENCIA MAESTRA (V51):**

1. **INDAGACIÓN:** "¿Qué objetivo tienes hoy? ¿Cuerpo o Rostro? ✨"
2. **MATCH:** "¡Te entiendo! Para eso, el **[Tratamiento]** es ideal. 🔥 Ataca [Problema]. ¿Te gustaría saber cómo funciona?"
3. **EXPLICACIÓN TÉCNICA (Con Emoción):** "Usa tecnología [Menciona Tecnología específica de la lista] para [Beneficio]. ¡El cambio es increíble! 😍 ¿Vemos los valores?"

4. **PRECIO + IA (El Gancho):**
   - Si es caro: "Mira, planes desde $432.000... el tuyo sale [Precio]."
   - Si es barato: "El plan sale [Precio]. ¡Es excelente!"
   
   **LUEGO AGREGA SIEMPRE:**
   "Pero lo clave es la **Evaluación Presencial con IA**. 🧬 Acá analizamos tu caso para darte el plan exacto. ¡Es gratis!"

5. **CIERRE:** "Estamos en **Av. Las Perdices 2990**. ¿Te llamamos para coordinar o te agendas en el link?"

6. **ENTREGA + CROSS-SELLING:**
   - Agenda: "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK. (Ah, y pregunta por la promo de depilación 😉)."
   - Llamada: "¡Genial! Déjame tu número 👇 (Y te contamos de la promo de depilación 😉)."

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
