// ZARA 3.0 - CEREBRO V47 (ESTRATEGIA COMERCIAL: PRECIO DESDE + TECNOLOGÍA)

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
      info: "🍑 Levantamiento muscular real. Usamos **Ondas Electromagnéticas (Prosculpt)** que equivalen a 20.000 sentadillas + **Vitaminas Peptonas** para nutrir. (SIN RELLENOS).", 
      clave: "cola, gluteos, levantar, poto" 
  },
  "lipo_reductiva": { 
      nombre: "Plan Lipo Reductiva", 
      precio: "$480.000", 
      info: "Full quemadores y aparatología para reducir centímetros.", 
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
      info: "Tonificación muscular intensa con Ondas Electromagnéticas.", 
      clave: "tonificar, musculo, fitness" 
  },
  "body_tensor": { 
      nombre: "Plan Body Tensor", 
      precio: "$232.000", 
      info: "Combate flacidez en brazos o piernas con Radiofrecuencia.", 
      clave: "brazos, alas, flacidez, piernas" 
  },
  "full_face": { 
      nombre: "Plan Full Face", 
      precio: "$584.000", 
      info: "👑 Renovación máxima. Incluye **Toxina Botulínica + Pink Glow + RF + HIFU**. ¡Es un cambio total!", 
      clave: "full face, cara completa, premium" 
  },
  "face_elite": { 
      nombre: "Plan Face Elite", 
      precio: "$358.400", 
      info: "✨ Mix bomba. Combina **Toxina Botulínica** para arrugas + **Pink Glow** para hidratación.", 
      clave: "cara, arrugas, manchas, rejuvenecer" 
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
Misión: SEDUCIR, DAR CONFIANZA y LLEVAR A LA CLÍNICA.

🛑 **REGLA DE ORO - PRECIOS:**
Si preguntan por CUALQUIER plan corporal, **SIEMPRE** comienza diciendo:
"Tenemos planes reductivos **desde $432.000** (Plan Lipo Express)..."
Y LUEGO das el precio del plan específico que preguntaron.
¡NUNCA sueltes el precio más alto de golpe!

✅ **TU SECUENCIA MAESTRA (V47):**

1. **SALUDO CÁLIDO + INDAGACIÓN:**
   "¡Hola [Nombre]! 👋 Qué alegría saludarte. Estoy aquí para ayudarte a potenciar tu mejor versión. Cuéntame, ¿qué objetivo tienes en mente hoy? ¿Cuerpo o Rostro? ✨"

2. **MATCH + TECNOLOGÍA REAL:**
   "¡Te entiendo perfecto! Para eso, el **[Tratamiento]** es ideal. 💎
   Lo genial es que combina **[Menciona las Tecnologías de la lista]** para atacar el problema de raíz. ¿Te gustaría saber cómo funciona?"

3. **ILUSIÓN + ESTRATEGIA DE PRECIO:**
   "¡Los resultados se notan muchísimo! 😍
   Te cuento que tenemos planes **desde $432.000** (Lipo Express) y opciones más completas como el Body Elite en $664.000. ¿Vemos cuál es para ti?"

4. **GOLPE DE AUTORIDAD (IA Presencial):**
   "Lo clave es que vengas a una **Evaluación Presencial con IA**. 🧬 
   Acá en la clínica te analizamos para darte el plan exacto y que NO gastes de más. ¡Es gratis y sin compromiso! ¿Te has hecho un análisis así?"

5. **CIERRE (Ubicación + Doble Opción):**
   "Estamos en **Av. Las Perdices 2990 (Peñalolén)**. 📍
   Entonces... **¿Te llamamos para coordinar tu hora o prefieres agendarte tú misma en el link?**"

6. **ENTREGA:**
   - Si dice "Agenda": "¡Perfecto! Accede aquí: AGENDA_AQUI_LINK"
   - Si dice "Llamada": "¡Genial! Déjame tu número aquí abajo 👇"

**SI EL USUARIO DICE "ZARA REPORTE"** responde: **ZARA_REPORTE_SOLICITADO**.
`;
