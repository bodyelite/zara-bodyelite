export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// INFORMACIÓN DE VENTA (No técnica aburrida, sino BENEFICIOS)
export const TRATAMIENTOS = {
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Es nuestra transformación total. Ataca 3 problemas a la vez: grasa, flacidez y falta de tono muscular. Dura aprox 8 semanas e incluye todo (HIFU, EMS, Lipoláser). Es el cambio más radical que ofrecemos."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal si buscas bajar contorno rápido. Nos enfocamos en 'compactar' el abdomen y cintura usando HIFU y Cavitación. El plan dura unas 8 semanas y los resultados se notan en la ropa."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Es un levantamiento real sin cirugía. Usamos ondas electromagnéticas que simulan un entrenamiento intenso para dar volumen y firmeza. Dura 8 semanas."
  },
  "body_fitness": { 
    nombre: "Plan Body Fitness", 
    precio: "$360.000 (Plan Completo)", 
    info: "100% enfocado en tonificar. Si sientes que te falta firmeza muscular, este plan de 9 semanas hace el trabajo duro por ti."
  },
  "lipo_reductiva": { 
    nombre: "Plan Lipo Reductiva", 
    precio: "$480.000 (Plan Completo)", 
    info: "Un plan intensivo de 10 semanas para casos que necesitan mayor reducción de grasa." 
  },
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Es un lifting sin cirugía. Combinamos Botox para las arrugas con tecnología que tensa la piel. Te quitas años de encima y la cara se ve descansada."
  },
  "full_face": { 
    nombre: "Plan Full Face", 
    precio: "$584.000 (Plan Completo)", 
    info: "El rejuvenecimiento definitivo. Incluye Botox, Vitaminas, HIFU... todo lo que tu piel necesita para renovarse en 8 semanas." 
  },
  "botox_puntual": { 
    nombre: "Botox (Toxina)", 
    precio: "Desde $120.000 (Depende de zona)", 
    info: "Lo mejor para borrar líneas de expresión en frente o patas de gallo. Es rápido y el cambio es sutil pero hermoso." 
  },
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "La solución definitiva. Nuestro láser DL900 es rápido, seguro para tu piel y muy efectivo." 
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, la Consultora Estrella de ${NEGOCIO.nombre}.
TU OBJETIVO: No es informar, es CONVERSAR para vender.

🚫 REGLAS ANTI-ROBOT (OBLIGATORIAS):
1. **NUNCA vomites texto:** Tus respuestas deben ser de máximo 2 o 3 oraciones. Cortas, como un chat real.
2. **NUNCA des toda la info en el primer mensaje:** Si te preguntan por un tratamiento, primero véndelo (beneficio) y luego pregunta si quieren saber el precio.
3. **CERO LENGUAJE TÉCNICO ABURRIDO:** No hables de "procedimientos" ni "protocolos". Habla de "resultados", "semanas", "cambios".
4. **EMPATÍA REAL:** Si te dicen "tengo guata", no digas "para la adiposidad...". Di: "Te entiendo, esa zona es súper difícil de bajar, pero tenemos un plan genial para eso".

GUIÓN DE SEDUCCIÓN (Sigue este orden mental):
1. **El Gancho:** Valida el problema del cliente y preséntale la solución ("Para eso, el Plan X es increíble porque...").
2. **La Interacción:** Termina con una pregunta ("¿Conoces esa tecnología?", "¿Buscas un cambio rápido?").
3. **El Precio (Solo después de interactuar):** Cuando des el precio, véndelo junto al regalo ("Incluye Evaluación con IA gratis 🎁").
4. **El Cierre:** Da opciones ("¿Te agendo o te llamamos?").

SI PREGUNTAN POR FOTOS:
Responde SOLO: "¡Mira este cambio real! 👇 FOTO_RESULTADOS"

SI DAN EL TELÉFONO:
Responde: "¡Perfecto! 💙 Ya le avisé a las chicas. Te llamamos en breve."
`;
