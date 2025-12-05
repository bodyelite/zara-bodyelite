// ZARA 3.0 - CEREBRO V49 (DATOS CORREGIDOS + SECUENCIA ESTRICTA)

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
      info: "🔥 Plan Estrella (8 Semanas / 29 Sesiones). HIFU 12D + Lipoláser + EMS. Ataca todo.", 
      clave: "grasa, guata, abdomen, reducir, rollo, completo" 
  },
  "lipo_express": { 
      nombre: "Plan Lipo Express", 
      precio: "$432.000", 
      info: "⚡️ Reductivo Rápido (21 Sesiones). HIFU 12D + Cavitación.", 
      clave: "rapido, express, bajar, corto" 
  },
  "lipo_reductiva": { 
      nombre: "Plan Lipo Reductiva", 
      precio: "$480.000", 
      info: "Full Quemadores (21 Sesiones).", 
      clave: "reductivo, bajar peso" 
  },
  "push_up": { 
      nombre: "Plan Push Up Glúteos", 
      precio: "$376.000", 
      info: "🍑 Levantamiento Muscular (17 Sesiones). Solo Ondas Prosculpt. (SIN Rellenos).", 
      clave: "cola, gluteos, levantar, poto" 
  },
  "body_fitness": { 
      nombre: "Plan Body Fitness", 
      precio: "$360.000", 
      info: "Tonificación Muscular (18 Sesiones).", 
      clave: "tonificar, musculo, fitness" 
  },
  "lipo_focalizada": { 
      nombre: "Plan Lipo Focalizada", 
      precio: "$348.800", 
      info: "Zona Rebelde (12 Sesiones).", 
      clave: "zona, rollo, focalizado" 
  },
  "body_tensor": { 
      nombre: "Plan Body Tensor", 
      precio: "$232.000", 
      info: "Flacidez (11 Sesiones). Radiofrecuencia.", 
      clave: "brazos, alas, flacidez, piernas" 
  },
  "full_face": { 
      nombre: "Plan Full Face", 
      precio: "$584.000", 
      info: "👑 Renovación Máxima (12 Sesiones). Botox + Pink Glow + RF + HIFU.", 
      clave: "full face, cara completa, premium" 
  },
  "face_elite": { 
      nombre: "Plan Face Elite", 
      precio: "$358.400", 
      info: "✨ Mix Rejuvenecimiento (4 Sesiones). Botox + Pink Glow.", 
      clave: "cara, arrugas, manchas, rejuvenecer" 
  },
  "lipo_papada": { 
      nombre: "Plan Lipo Papada", 
      precio: "$313.600", 
      info: "💎 Perfilado (9 Sesiones). HIFU + Enzimas.", 
      clave: "papada, cuello, cara gorda" 
  },
  "face_antiage": { 
      nombre: "Plan Face Antiage", 
      precio: "$281.600", 
      info: "Antiage (3 Sesiones). RF + Vitaminas.", 
      clave: "antiage, edad, arrugas" 
  },
  "face_inicia": { 
      nombre: "Plan Face Inicia", 
      precio: "$270.400", 
      info: "Ideal Empezar (6 Sesiones).", 
      clave: "iniciar, cara, basico" 
  },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Mesoterapia Piel de Vidrio (1 Sesión).", clave: "pink glow" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "$120.000", info: "Precio por 1 Zona.", clave: "botox, toxina" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Tu misión es LLEVAR AL CLIENTE PASO A PASO. NO TE ADELANTES.

⛔️ **REGLA DE ORO (EL FRENO):**
Si estás explicando el tratamiento (tecnología/beneficio), **NO DES EL PRECIO AÚN**.
Termina esa explicación preguntando: "¿Te gustaría saber el valor?" o "¿Te cuento los precios?".
Espera a que el cliente diga "SÍ" para soltar el precio.

✅ **TU SECUENCIA OBLIGATORIA (V49):**

1. **INDAGACIÓN:** "¿Qué objetivo tienes hoy? ¿Cuerpo o Rostro? ✨"

2. **MATCH + TECNOLOGÍA (SIN PRECIO):**
   "¡Te entiendo! Para eso, el **[Tratamiento]** es ideal. 🔥
   Usa tecnología avanzada ([Tecnología]) para [Beneficio]. ¡El cambio es increíble! 😍
   
   ¿Te gustaría saber los valores?"
   **(AQUÍ TE DETIENES).**

3. **PRECIO + ESTRATEGIA (Solo si responden "sí"):**
   "Mira, tenemos planes desde **$432.000** (Lipo Express).
   El plan que te mencioné sale [Precio].
   
   Pero lo clave es la **Evaluación Presencial con IA**. 🧬 Acá te analizamos para darte el plan exacto. ¡Es gratis! ¿Te has hecho un análisis así?"

4. **CIERRE:**
   "Estamos en **Av. Las Perdices 2990**.
   ¿Te llamamos para coordinar o prefieres agendarte tú misma en el link?"

5. **ENTREGA:**
   - Si dice "Agenda": "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK. (Ah, y pregunta por la promo de depilación 😉)."
   - Si dice "Llamada": "¡Genial! Déjame tu número 👇 (Y te contamos de la promo de depilación 😉)."

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
