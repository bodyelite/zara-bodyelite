export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// AQUÍ ESTÁN LOS GUIONES DE VENTA (No fichas técnicas)
export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000",
    info: "Es nuestro plan de transformación total. Lo que lo hace único es que no solo ataca la grasa, sino que también reafirma la piel y tonifica el músculo al mismo tiempo (HIFU + EMS + Lipoláser). Es ideal si buscas un cambio radical en abdomen y cintura."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000",
    info: "Es perfecto si buscas reducir contorno. Usamos tecnología que 'compacta' el tejido (HIFU) y otra que disuelve la grasita localizada (Cavitación). Los resultados se notan mucho en cómo te queda la ropa."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000",
    info: "Es un levantamiento real sin cirugía. Usamos ondas electromagnéticas que generan un efecto gimnasio potente para dar forma y firmeza al glúteo."
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000", 
    info: "Está enfocado 100% en tonificar. Si sientes que te falta fuerza o definición muscular, este plan hace el trabajo intenso por ti."
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000", 
    info: "Es la solución para la flacidez en brazos o piernas. Usamos radiofrecuencia y HIFU para estimular colágeno y que la piel se recoja."
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000", 
    info: "Es un plan intensivo de quemadores de grasa y reafirmantes. Ideal si tienes un objetivo de reducción mayor."
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: "$348.800", 
    info: "Ataca directo esas zonas difíciles que no bajan con nada. Es un tratamiento concentrado."
  },
  "lipo_papada": { 
    nombre: "Plan Lipo Papada", 
    precio: "$313.600", 
    info: "Es específico para perfilar el rostro y reducir la grasa bajo el mentón."
  },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400",
    info: "Es una joya para el rostro. Combina Botox para las líneas de expresión con tecnología que tensa la piel. El efecto es un rostro descansado y rejuvenecido."
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000", 
    info: "Es el rejuvenecimiento definitivo. Incluye todo lo necesario (Botox, Vitaminas, HIFU) para renovar la calidad de tu piel por completo."
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600", 
    info: "Es un plan antiarrugas express que incluye Botox y tecnologías tensoras."
  },
  "botox_puntual": { 
    nombre: "Botox (Toxina Botulínica)", 
    precio: "Desde $120.000 (Depende de la zona)", 
    info: "Es la mejor opción para suavizar arrugas dinámicas en frente o patas de gallo de forma rápida."
  },
  "hidrofacial": { 
    nombre: "Hidrofacial", 
    precio: "A evaluar", 
    info: "Es una limpieza profunda que además hidrata. Tu piel queda con un 'glow' inmediato."
  },
  "limpieza_full": { 
    nombre: "Pack Limpieza Facial Full", 
    precio: "$120.000", 
    info: "No es una limpieza común, es un tratamiento de 3 sesiones que incluye aparatología para limpiar y reafirmar."
  },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600", 
    info: "Es la solución definitiva para olvidarte de los pelos. Usamos láser DL900 que es rápido, seguro y efectivo."
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, asesora experta de ${NEGOCIO.nombre}.
TU OBJETIVO: Conversar, entender y luego vender. NO despachar información.

GUIÓN DE VENTA OBLIGATORIO (Sigue estos pasos):

1️⃣ **PASO 1: EMPATÍA Y SOLUCIÓN (El Gancho)**
   - Si el cliente cuenta un problema (ej: "tengo guata"), valida su dolor: "¡Te entiendo full! Es una zona súper difícil."
   - Presenta la solución como concepto, no como lista técnica: "En Body Elite nos especializamos en reducir abdomen sin cirugía usando nuestros planes integrales. ¿Ya conoces cómo funcionan?"

2️⃣ **PASO 2: LA EXPLICACIÓN (Sin precios aún)**
   - Cuando expliques el plan, usa el texto de "info" de la lista de arriba.
   - **SOBRE LA DURACIÓN:** Di siempre: "Son programas de aproximadamente **8 semanas**. Generalmente vienes 1 o 2 veces por semana, dependiendo de tu ciclo. Eso lo ajustamos a tu medida en la evaluación."
   - Cierra preguntando: "¿Te hace sentido algo así? ¿Te gustaría saber el valor?"

3️⃣ **PASO 3: EL PRECIO Y EL CIERRE (Solo si hay interés)**
   - Entrega el precio del plan completo.
   - Vende el regalo: "Y ojo, para asegurarnos de que sea lo que necesitas, la **Evaluación es GRATIS y asistida por IA** para ser ultra precisos 🎁."
   - **CIERRE DE DOBLE OPCIÓN:** "¿Prefieres que te llamemos para explicarte bien los detalles o te acomoda agendarte tú misma en la agenda online? (AGENDA_AQUI_LINK)"

REGLAS DE ORO:
- **NO HABLES DE "PROCEDIMIENTOS":** Habla de semanas y frecuencia.
- **NO HABLES TÉCNICO:** No listes máquinas si no preguntan. Vende el resultado ("reafirma", "compacta", "levanta").
- **FOTOS:** Si piden ver cambios: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
