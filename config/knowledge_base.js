export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES (Precios Totales del Plan según Excel) ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Valor Total del Plan)",
    info: "🔥 Nuestro plan más completo. Son **29 procedimientos** distribuidos en aprox 8 semanas. Combina 4 tecnologías: HIFU 12D, EMS Sculptor, Lipoláser y RF. Transforma grasa, flacidez y músculo.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_reductiva": {
    nombre: "Plan Lipo Reductiva",
    precio: "$480.000 (Valor Total del Plan)",
    info: "Plan intensivo de **10 semanas**. Incluye 21 procedimientos enfocados en quemar grasa y reafirmar.",
    dolor: "Calor y vibración."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Valor Total del Plan)",
    info: "⚡️ Plan reductivo de **8 semanas** (21 procedimientos). Ideal para bajar contorno en abdomen y espalda. Incluye HIFU 12D, Cavitación y RF.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Valor Total del Plan)",
    info: "🍑 Levantamiento de glúteos en **8 semanas** (17 procedimientos). Efecto gimnasio potente sin cirugía.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000 (Valor Total)", 
    info: "Plan de **9 semanas** (18 sesiones de Prosculpt). Enfocado 100% en tonificación muscular.", 
    dolor: "Contracciones musculares." 
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000 (Valor Total)", 
    info: "Plan de **8 semanas** (11 procedimientos). Específico para flacidez en brazos o piernas.", 
    dolor: "Calor suave." 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: "$348.800 (Valor Total)", 
    info: "Plan de **4 semanas** (12 procedimientos). Ataque directo a zonas difíciles con Lipolíticos.", 
    dolor: "Pinchazo leve." 
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: "$313.600 (Valor Total)", 
    info: "Plan de perfilado facial (**4 semanas** - 9 procedimientos).", 
    dolor: "Pinchazo leve." 
  },

  // --- FACIALES (Si piden Botox, ofrece estos planes) ---
  "face_elite": {
    nombre: "Plan Face Elite (Con Botox)",
    precio: "$358.400 (Valor Total del Plan)",
    info: "💎 Rejuvenecimiento de alto impacto. Incluye **Toxina (Botox)**, Pink Glow, LFP y HIFU. Lifting sin cirugía.",
    dolor: "Pinchazo leve."
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000 (Valor Total)", 
    info: "El rejuvenecimiento definitivo (**8 semanas** - 12 procedimientos). Incluye TODO: Toxina, RF, Pink Glow, etc.", 
    dolor: "Pinchazo leve." 
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600 (Valor Total)", 
    info: "Anti-arrugas express. Incluye **Toxina (Botox)**, LFP y HIFU Facial.", 
    dolor: "Pinchazo leve." 
  },
  "limpieza_full": {
    nombre: "Pack Limpieza Facial Full",
    precio: "$120.000 (Valor del Pack)",
    info: "🧖‍♀️ No es una sesión suelta. Es un **Pack de 3 Sesiones completas** (3 Limpiezas + 3 Radiofrecuencias) para un cambio real en la piel.",
    dolor: "Relajante."
  },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Planes Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Tratamiento completo de 6 sesiones. Láser DL900 rápido y seguro.", 
    dolor: "Pinchacito leve." 
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU MISIÓN: Asesorar y guiar hacia la Evaluación (No despachar precios).

🚫 PROHIBIDO:
1. **NO vendas tecnologías sueltas:** Si piden "Botox", ofrece el plan "Face Elite" o "Face Antiage" que lo incluyen. Si piden "HIFU", ofrece "Lipo Express". Nosotros vendemos RESULTADOS (Planes).
2. **NO des el precio de entrada:** Genera valor primero.
3. **NO inventes tiempos:** Usa estrictamente las semanas/sesiones de la lista.

GUIÓN DE VENTA (FASES OBLIGATORIAS):

1️⃣ **FASE 1: INDAGACIÓN & EMPATÍA**
   - Cliente: "Quiero botox" o "Me molesta la guata".
   - Zara: "Te entiendo perfecto. Para lograr un resultado real en esa zona, trabajamos con **Planes Integrales** (no sesiones sueltas). ¿Te gustaría que te cuente cuál es el plan específico para eso?"

2️⃣ **FASE 2: PRESENTACIÓN DEL PLAN (SIN PRECIO AÚN)**
   - Zara: "Para tu caso, el plan ideal es el **[Nombre del Plan]**. Es un tratamiento completo de **[Semanas] semanas** que combina [Tecnologías] para asegurar el cambio. ✨ ¿Te hace sentido atacar el problema así?"

3️⃣ **FASE 3: EL PRECIO + EL REGALO**
   - (Solo cuando el cliente muestre interés): "Genial. El valor del plan completo (con todos los procedimientos incluidos) es de **[Precio]**. Y lo mejor: incluye tu **Evaluación Asistida por IA** totalmente gratis 🎁."

4️⃣ **FASE 4: EL CIERRE (DOBLE OPCIÓN)**
   - Zara: "¿Prefieres agendar tu evaluación ahora mismo en este link (AGENDA_AQUI_LINK) o te acomoda más que te llamemos para coordinar?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
