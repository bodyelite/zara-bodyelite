export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// AQUÍ ESTÁ EL SECRETO: Descripciones que venden el RESULTADO, no la máquina.
export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Es nuestra **remodelación total** sin cirugía. Atacamos los 3 enemigos: grasa, flacidez y falta de tono. Imagina reducir centímetros mientras tu piel se pega y tus músculos se marcan. Es un cambio radical en 8 semanas. 🔥",
    tech_list: ["HIFU 12D", "EMS Sculptor", "Lipoláser", "Radiofrecuencia"]
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Perfecto para bajar esa grasita que no se va con dieta. Usamos tecnología que 'derrite' el tejido adiposo y otra que 'plancha' la piel para que no quede suelta. En 8 semanas bajas contorno visiblemente. ⚡️",
    tech_list: ["HIFU 12D", "Cavitación", "Radiofrecuencia"]
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Es el secreto para un glúteo levantado y redondo. Usamos ondas electromagnéticas que equivalen a **20.000 sentadillas** por sesión. El resultado es volumen y firmeza real, como si vivieras en el gym. 🍑",
    tech_list: ["EMS Sculptor", "HIFU 12D", "Radiofrecuencia"]
  },
  "body_tensor": { 
    nombre: "Plan Body Tensor", 
    precio: "$232.000 (Plan Completo)", 
    info: "Olvídate de la piel suelta al saludar. Este plan regenera tu colágeno para devolverle la firmeza y tensión a tus brazos o piernas. La piel se siente más joven y compacta.", 
    tech_list: ["Radiofrecuencia", "HIFU 12D"] 
  },
  "lipo_focalizada": { 
    nombre: "Plan Lipo Focalizada", 
    precio: "$348.800 (Plan Completo)", 
    info: "Un ataque directo a esos rollitos difíciles. Usamos lipolíticos potentes para disolver la grasa localizada en tiempo récord (4 semanas).", 
    tech_list: ["Lipolíticos", "RF"] 
  },
  
  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Es un **lifting sin bisturí**. Borramos las arrugas con Botox y tensamos todo el óvalo facial con HIFU. Te quitas años de encima y la cara se ve descansada y luminosa al instante. 💎",
    tech_list: ["Botox", "HIFU", "Pink Glow"]
  },
  "face_antiage": { 
    nombre: "Plan Face Antiage", 
    precio: "$281.600", 
    info: "Ideal para detener el tiempo. Suavizamos las líneas de expresión profundas y revitalizamos la piel para que luzcas fresca y natural.", 
    tech_list: ["Botox", "HIFU"] 
  },
  "limpieza_full": { 
    nombre: "Pack Limpieza Facial Full", 
    precio: "$120.000 (Pack 3 Sesiones)", 
    info: "No es una limpieza normal, es un **tratamiento de choque**. En 3 sesiones logramos limpiar, hidratar y tensar la piel con aparatología. Tu cara queda con un brillo espectacular. ✨", 
    tech_list: ["RF", "Limpieza profunda"] 
  },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "La libertad de no depilarte más. Nuestro láser elimina el vello de raíz sin dolor y deja la piel suavecita. Es una inversión en comodidad para siempre.", 
    tech_list: ["Láser DL900"] 
  }
};

export const SYSTEM_PROMPT = `
Eres Zara, la Asesora Estrella de ${NEGOCIO.nombre}.
TU MISIÓN: Enamorar al cliente con la transformación posible. NO leas fichas técnicas.

CÓMO HABLAR PARA ENCANTAR:
1. **Usa Analogías:** "Como un planchado", "Como ir al gym", "Lifting invisible".
2. **Vende el Sueño:** Habla de cómo se sentirá ("piel suave", "cambio radical", "te quitas años").
3. **Sé Cómplice:** "Esa grasita es terrible, pero esto la elimina".

ESTRUCTURA DE RESPUESTA:
1. **Validación:** "¡Te entiendo full!"
2. **Seducción (Info Emocional):** Usa la descripción de arriba.
3. **Pregunta:** "¿Te imaginas con ese resultado? ¿Te gustaría ver el valor?"

REGLAS DE NEGOCIO:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Cierre:** Doble opción (Agenda vs Llamada).
`;
