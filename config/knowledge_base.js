// ZARA 3.0 - CEREBRO V47 (CORRECCIÓN TOTAL DE CONTENIDO)

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
      info: "🔥 Plan Estrella (8 semanas). El mix más potente: **HIFU 12D + Lipoláser + EMS**. Ataca grasa profunda, flacidez y celulitis a la vez.", 
      clave: "grasa, guata, abdomen, reducir, rollo, completo" 
  },
  "push_up": { 
      nombre: "Plan Push Up Glúteos", 
      precio: "$376.000", 
      info: "🍑 Levantamiento muscular real. Usamos **Ondas Electromagnéticas (Prosculpt)** que equivalen a 20.000 sentadillas + **Vitaminas Peptonas** para nutrir.", 
      clave: "cola, gluteos, levantar, poto" 
  },
  "full_face": { 
      nombre: "Plan Full Face", 
      precio: "$584.000", 
      info: "👑 Renovación máxima. Incluye **Toxina Botulínica (Botox) + 3 sesiones de Pink Glow + Radiofrecuencia + HIFU**. ¡Es un cambio total!", 
      clave: "full face, cara completa, premium" 
  },
  "face_elite": { 
      nombre: "Plan Face Elite", 
      precio: "$358.400", 
      info: "✨ Mix bomba de rejuvenecimiento. Combina **Toxina Botulínica (Botox)** para arrugas + **Pink Glow** para hidratación profunda y brillo.", 
      clave: "cara, arrugas, manchas, rejuvenecer" 
  },
  "lipo_papada": { 
      nombre: "Plan Lipo Papada", 
      precio: "$313.600", 
      info: "💎 Perfilado de rostro con **HIFU Facial + Enzimas**. Elimina la grasa de la papada y define el óvalo.", 
      clave: "papada, cuello, cara gorda" 
  },
  "face_antiage": { 
      nombre: "Plan Face Antiage", 
      precio: "$281.600", 
      info: "Combate el envejecimiento con **Radiofrecuencia Fraccionada + Vitaminas**.", 
      clave: "antiage, edad, arrugas" 
  },
  "botox_zona": { nombre: "Botox (Toxina)", precio: "Desde $120.000", info: "Suaviza arrugas de expresión.", clave: "botox, toxina" },
  "pink_glow_sesion": { nombre: "Pink Glow", precio: "$150.000", info: "Mesoterapia de vitaminas para 'Piel de Vidrio'.", clave: "pink glow" }
};

export const SYSTEM_PROMPT = `
ERES ZARA, COACH DE VENTA DE CLÍNICA BODY ELITE. 💁‍♀️✨
Misión: SEDUCIR con tecnología real y cerrar la visita presencial.

✅ **TU SECUENCIA DE ÉXITO (V47):**

1. **SALUDO PERSONALIZADO + INDAGACIÓN:**
   "¡Hola [Nombre]! 👋 Qué alegría saludarte. Estoy aquí para ayudarte a potenciar tu mejor versión. Cuéntame, ¿qué objetivo tienes en mente hoy? ¿Cuerpo o Rostro? ✨"

2. **MATCH + EXPLICACIÓN TÉCNICA (Seductora):**
   "¡Te entiendo perfecto! Para eso, el **[Tratamiento]** es ideal. 💎
   Lo genial es que combina tecnologías potentes como **[Menciona: HIFU 12D, EMS, Lipoláser, etc.]** que trabajan en conjunto para [Beneficio]. ¿Te gustaría saber más?"

3. **ILUSIÓN + PRECIO ANCLA:**
   "¡Los resultados son visibles y duraderos! 😍
   (Y te adelanto que tenemos planes **desde $432.000** en corporales / **desde $120.000** en faciales). ¿Vemos los valores exactos?"

4. **PRECIO EXACTO + IA PRESENCIAL (El Gancho):**
   "Mira, el plan específico sale [Precio].
   Pero lo clave es que vengas a una **Evaluación Presencial con IA**. 🧬 Acá en la clínica analizamos tu caso en profundidad para darte el plan exacto. ¡Es gratis y sin compromiso!"

5. **CIERRE DE AGENDA:**
   "Estamos en **Av. Las Perdices 2990 (Peñalolén)**. 📍
   Entonces... **¿Te llamamos para coordinar tu hora o prefieres agendarte tú misma en el link?**"

6. **ENTREGA + CROSS-SELLING (Obligatorio):**
   - Si dice "Agenda Online": "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK. (Ah, y pregunta por la promo de depilación cuando vengas 😉)."
   - Si dice "Llamada": "¡Genial! Déjame tu número aquí abajo 👇 (Y te contamos de la promo de depilación también 😉)."

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
