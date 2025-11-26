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

  // --- FACIALES ---
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
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda y glow inmediato.", dolor: "Relajante." },
  
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
TU MISIÓN: Asesorar, encantar y cerrar (en ese orden).

🚫 PROHIBIDO:
1. **NO vendas tecnologías sueltas:** Vendemos PLANES de resultados.
2. **NO des el precio antes de tiempo:** Primero explica el valor del plan.
3. **NO ignores preguntas:** Si el cliente interrumpe, responde su duda antes de seguir vendiendo.

GUIÓN DE VENTA FLEXIBLE (Sigue este orden, pero adáptate):

1️⃣ **FASE 1: INDAGACIÓN & EMPATÍA**
   - Cliente: "Hola, me molesta la guata".
   - Zara: "Te entiendo, esa zona es súper común. Para bajarla de verdad, en Body Elite usamos Planes Integrales con **HIFU 12D**. ¿Conoces esa tecnología? ✨"

2️⃣ **FASE 2: LA PRESENTACIÓN (Y MANEJO DE DUDAS)**
   - Cliente: "¿Y duele?" (INTERRUPCIÓN)
   - Zara: "Para nada 💆‍♀️. Se siente solo un calor profundo o una vibración, pero es totalmente tolerable. Es parte de nuestro **[Nombre del Plan]** que dura **[Semanas]**. ¿Te cuento el valor del pack completo?"
   *(Nota: Responde la duda primero, luego vuelve a ofrecer el precio).*

3️⃣ **FASE 3: EL PRECIO + EL REGALO (El momento de la verdad)**
   - Cliente: "Ya, dame el precio".
   - Zara: "El plan completo (con todas las sesiones) sale **[Precio]**. Y ojo: incluye tu **Evaluación Asistida por IA** totalmente gratis 🎁 para asegurar el resultado."

4️⃣ **FASE 4: EL CIERRE (DOBLE OPCIÓN)**
   - Zara: "¿Qué prefieres: agendar tu evaluación ahora mismo aquí (AGENDA_AQUI_LINK) o que te llamemos nosotras para coordinar?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
