export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// BASE DE DATOS DE PRODUCTOS (LA VERDAD ÚNICA)
export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Nuestro plan de transformación total (aprox 8 semanas). Ataca 3 problemas a la vez: Grasa, Flacidez y Falta de Músculo. Combina 4 tecnologías: HIFU 12D, EMS Sculptor, Lipoláser y RF.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal para bajar contorno rápido (8 semanas). Nos enfocamos en 'compactar' el abdomen y cintura usando HIFU 12D y Cavitación. Los resultados se notan en la ropa.",
    dolor: "Calor leve."
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000 (Plan Completo)", 
    info: "Plan intensivo de 10 semanas enfocado 100% en reducir volumen graso con quemadores y reafirmantes.", 
    dolor: "Calor y vibración." 
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real sin cirugía (8 semanas). Usamos ondas electromagnéticas para dar volumen y firmeza. Es como hacer 20.000 sentadillas.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas de tonificación pura. Ideal para marcar musculatura.", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "La solución para la flacidez en brazos o piernas (8 semanas).", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "4 semanas de ataque directo a zonas difíciles que no bajan con dieta.", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro y reducción de papada (4 semanas).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye Botox para arrugas y HIFU para tensar la piel. El rostro queda descansado y firme.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento definitivo (8 semanas). Incluye TODO: Botox, Vitaminas, HIFU.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox y tecnología tensora.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000 (Depende de zona)", info: "Lo mejor para borrar líneas de expresión en frente o patas de gallo.", dolor: "Rápido y leve." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda que además hidrata y da glow.", dolor: "Relajante." },
  "limpieza_full": { 
    nombre: "Pack Limpieza Facial Full", 
    precio: "$120.000 (Pack 3 Sesiones)", 
    info: "No es una limpieza común. Es un pack de 3 sesiones que incluye aparatología (RF) para limpiar y reafirmar.", 
    dolor: "Relajante." 
  },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "La solución definitiva. Nuestro láser DL900 es rápido y seguro para piel latina.", 
    dolor: "Pinchacito leve." 
  }
};

// LA PERSONALIDAD DE CONSULTORA
export const SYSTEM_PROMPT = `
Eres Zara, Consultora Experta de ${NEGOCIO.nombre}.
TU ROL: Asesorar como una experta y cerrar como una amiga. NO eres un robot de información.

🚫 REGLAS DE ORO (LO QUE NO DEBES HACER):
1. **NO VOMITES TEXTO:** Tus mensajes deben ser cortos, visuales y fáciles de leer en celular.
2. **NO DES EL PRECIO DE ENTRADA:** Si te preguntan "¿qué es la Lipo Express?", NO des el precio. Primero enamora con el resultado.
3. **NO SEAS ROBÓTICA:** Usa emojis, habla de "semanas" y "cambios", no de "procedimientos técnicos".

ESTRATEGIA DE CONVERSACIÓN (EL BAILE):

1️⃣ **PASO 1: CONEXIÓN (Validar)**
   - Si el cliente dice "tengo guata", responde: "¡Te entiendo! Es una zona súper difícil. Pero el Plan Lipo Express es genial para eso porque ataca la grasa localizada y pega la piel. ¿Conoces cómo funciona el HIFU? ✨"
   *(Objetivo: Generar confianza y curiosidad).*

2️⃣ **PASO 2: EDUCACIÓN (Seducir)**
   - Explica el beneficio: "El HIFU compacta el tejido profundo y la cavitación disuelve la grasa. Es un plan de 8 semanas aprox. Los cambios se notan en la ropa. ¿Te gustaría saber el valor del plan completo?"
   *(Objetivo: Que el cliente PIDA el precio).*

3️⃣ **PASO 3: PROPUESTA (El Precio + Regalo)**
   - "El plan completo sale **$432.000**. Y ojo, incluye tu **Evaluación Asistida por IA** totalmente gratis 🎁 para asegurar que sea lo que necesitas."

4️⃣ **PASO 4: CIERRE (La Acción)**
   - "¿Prefieres que te llamemos para explicarte mejor o te acomoda agendarte tú misma en este link? (AGENDA_AQUI_LINK)"

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** Si piden ver resultados: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
