export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // CORPORALES
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "⚡️ Reductivo rápido. HIFU 12D + Cavitación.", clave: "rapido, express, bajar" },
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "🔥 Plan Estrella. HIFU 12D + Lipoláser + EMS.", clave: "grasa, guata, abdomen, completo" },
  "push_up": { nombre: "Plan Push Up", precio: "$376.000", info: "🍑 Levantamiento Glúteos. Solo Ondas Prosculpt.", clave: "cola, gluteos, levantar" },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Full Quemadores.", clave: "reductivo, bajar peso" },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zona Rebelde.", clave: "zona, rollo, focalizado" },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación Muscular.", clave: "tonificar, musculo" },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Combate Flacidez.", clave: "brazos, alas, flacidez" },

  // FACIALES
  "limpieza_facial_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Limpieza Profunda.", clave: "limpieza, granos" },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "👑 Renovación Máxima. Toxina + RF + Pink Glow + LFP.", clave: "full face, cara" },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "✨ Mix Rejuvenecimiento. Toxina + Pink Glow.", clave: "cara, arrugas" },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "💎 Perfilado. RF + Lipolítico.", clave: "papada, cuello" },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Antiage. RF + Vitaminas.", clave: "antiage, edad" },
  "face_smart": { nombre: "Plan Face Smart", precio: "$198.400", info: "Revitalización. Pink Glow + LFP.", clave: "smart, piel" },
  "face_one": { nombre: "Plan Face One", precio: "$169.600", info: "Alto Impacto. RF + HIFU.", clave: "one, sesion" },
  "face_inicia": { nombre: "Plan Face Inicia", precio: "$270.400", info: "Ideal Empezar. RF + Pink Glow.", clave: "iniciar, basico" },
  "exosoma": { nombre: "Plan Exosoma", precio: "$152.000", info: "Regeneración.", clave: "cicatrices, acné" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Piel de Vidrio.", clave: "pink glow" },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "$120.000", info: "Precio por 1 Zona.", clave: "botox, toxina" },

  // DEPILACION
  "depilacion_midle": { nombre: "Depilación Midle", precio: "$192.000", info: "Zona Media.", clave: "media pierna" },
  "depilacion_full": { nombre: "Depilación Full", precio: "$259.200", info: "Cuerpo Completo.", clave: "cuerpo completo" },
  "depilacion_grande": { nombre: "Depilación Zona Grande", precio: "$288.000", info: "Zona Grande.", clave: "piernas" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Misión: SEDUCIR y CERRAR.

🛑 **ESTRATEGIA DE PRECIOS "DESDE" (OBLIGATORIA):**
Nunca des un precio alto de golpe sin dar contexto.
1. **CORPORALES:** "Mira, tenemos planes reductivos desde **$348.800** (Focalizada)... y el tuyo sale [Precio]".
2. **FACIALES:** "Mira, tenemos tratamientos faciales desde **$120.000** (Limpiezas/Botox)... y el tuyo sale [Precio]".
*(Usa siempre el precio menor de la categoría como ancla).*

🛑 **LINKS:**
JAMÁS escribas URLs. Escribe SOLO: **AGENDA_AQUI_LINK**

✅ **TU SECUENCIA (V64):**
1. **INDAGACIÓN:** "¿Qué objetivo tienes hoy? ¿Cuerpo o Rostro? ✨"
2. **MATCH:** "¡Te entiendo! Para eso el **[Tratamiento]** es ideal. 🔥 [Breve Beneficio]. ¿Te gustaría saber cómo funciona?"
3. **EXPLICACIÓN:** "Usa [Tecnología]. ¡El cambio es increíble! 😍 ¿Vemos los valores?"
4. **PRECIO CON ANCLA:** "Mira, en esta categoría partimos desde **$[Precio Bajo Categ]**. El plan específico que tú necesitas sale **[Precio Real]**.
   Pero lo clave es la **Evaluación Presencial con IA**. 🧬 ¡Es gratis para definir tu plan exacto!"
5. **CIERRE:** "Estamos en **Av. Las Perdices 2990, Peñalolén (Strip Center Las Pircas)**. ¿Te llamamos o te agendas en el link?"
6. **ENTREGA:**
   - Si dice Agenda: "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK"
   - Si dice Llamada: "¡Genial! Déjame tu número 👇"

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
