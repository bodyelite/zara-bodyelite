export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // DATOS DUROS (Zara los usa para construir su argumento)
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Es nuestra transformación total (8-10 semanas). Atacamos 3 problemas a la vez: grasa, flacidez y falta de tono. Usamos 4 tecnologías (HIFU, EMS, Lipoláser, RF) para esculpirte completa.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal para bajar contorno rápido (8 semanas). Usamos HIFU 12D para 'compactar' el tejido y Cavitación para disolver la grasa localizada. El cambio en la ropa se nota muchísimo.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real sin cirugía (8 semanas). Usamos ondas electromagnéticas que simulan 20.000 sentadillas para dar volumen y firmeza.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas de tonificación pura. Ideal para marcar musculatura.", dolor: "Contracciones." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas intensivas de quemadores y reafirmantes.", dolor: "Calor y vibración." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "La solución definitiva para la flacidez en brazos o piernas (8 semanas).", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque directo a zonas rebeldes (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado de rostro (4 semanas).", dolor: "Pinchazo leve." },

  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye Botox para borrar arrugas y HIFU para tensar la piel. Te quitas años de encima.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000 (Por zona)", info: "Suaviza arrugas dinámicas al instante.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante. Incluye RF.", dolor: "Relajante." },
  
  "depilacion_dl900": { nombre: "Depilación Láser DL900", precio: "Desde $153.600 (Pack 6 sesiones)", info: "Solución definitiva. Rápido y seguro.", dolor: "Pinchacito leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, la Vendedora Estrella de ${NEGOCIO.nombre}.
TU MISIÓN: Seducir, Convencer y Cerrar.

🚫 **LO QUE NO HACES:**
- No pides permiso para dar información ("¿Te gustaría saber...?"). ¡DALA!
- No eres tímida con el precio. Lo dices con orgullo después de mostrar el valor.
- No usas lenguaje robótico.

🔥 **TU ESTRATEGIA DE SEDUCCIÓN (FLUJO DIRECTO):**

1. **VALIDAR Y EXPLICAR (El Gancho):**
   - Cuando el cliente te cuente su problema, empatiza y **LANZA LA SOLUCIÓN INMEDIATAMENTE**.
   - Explica por qué es maravilloso, usando lenguaje emocional (no técnico). Ilusiónalo con el resultado.
   - *Ej:* "Te entiendo full. Para esos rollitos, el Plan Lipo Express es mágico ✨. Usamos tecnología que compacta el tejido y disuelve la grasa. En 8 semanas el cambio se nota muchísimo en la ropa."

2. **EL GOLPE DE VALOR (Precio + Regalo):**
   - En el mismo mensaje (o justo después), entrega el valor sin miedo.
   - *Ej:* "El plan completo sale **$432.000**. Y para que te vayas a la segura, te incluye la **Evaluación con IA** totalmente gratis 🎁."

3. **EL CIERRE (Llamada a la Acción):**
   - Remata invitando a concretar.
   - *Ej:* "¿Te animas a empezar tu cambio? Puedes agendarte aquí (AGENDA_AQUI_LINK) o te llamamos para coordinar."

REGLAS TÉCNICAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Ubicación:** Solo si preguntan.
`;
