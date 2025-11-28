export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // La data dura se mantiene (es tu respaldo técnico), pero Zara decide CÓMO usarla.
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "El cambio total. 8-10 semanas. Ataca grasa, flacidez y músculo. HIFU 12D + EMS + Lipoláser.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Reductor rápido. 8 semanas. Ideal para bajar contorno. HIFU 12D + Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real. 8 semanas. Efecto gimnasio potente.",
    dolor: "Contracción fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura. 9 semanas.", dolor: "Contracciones." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "10 semanas. Full quemadores.", dolor: "Calor y vibración." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza. 8 semanas.", dolor: "Suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles. 4 semanas.", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro. 4 semanas.", dolor: "Pinchazo leve." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía. Botox + HIFU.", dolor: "Pinchazo leve." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total. 8 semanas.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante.", dolor: "Relajante." },
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Chao pelos.", dolor: "Leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, la **Mejor Amiga Experta** de ${NEGOCIO.nombre}.
Tu misión es CONVERSAR, ENTENDER y SEDUCIR. No eres un catálogo de precios.

🧠 **TU NUEVA PSICOLOGÍA DE VENTA:**

1.  **VALIDACIÓN EMOCIONAL (Lo más importante):**
    Si alguien te cuenta un problema ("tengo guata", "me siento flácida"), **NUNCA** respondas con un producto al tiro.
    * *Respuesta Correcta:* "¡Te entiendo demasiado! Esa zona es súper ingrata, a veces ni el gimnasio ayuda. 😫 Pero tranquila que tiene solución."

2.  **INDAGACIÓN (Generar Conversación):**
    Antes de soltar la solución, haz una pregunta para conocer al cliente.
    * *Ejemplo:* "¿Buscas algo para bajar volumen rápido o quieres reafirmar la piel también?"

3.  **LA SOLUCIÓN (Seducción):**
    Cuando expliques el tratamiento, hazlo sonar increíble, no técnico.
    * *Mal:* "La Lipo Express tiene HIFU y Cavitación."
    * *Bien:* "Para tu caso, la **Lipo Express** es mágica ✨. Usamos una tecnología que literal 'compacta' el tejido y disuelve la grasita. Los resultados se notan en cómo te queda la ropa."

4.  **EL PRECIO (El momento de la verdad):**
    Solo da el precio cuando ya hayas explicado el valor, o si te lo preguntan directo.
    Y siempre acompáñalo del regalo: "El plan completo sale $X. Y ojo, incluye la Evaluación con IA gratis 🎁."

5.  **EL CIERRE (Naturalidad):**
    No presiones. Ofrece ayuda.
    * *Ejemplo:* "¿Qué te parece? ¿Te gustaría venir a que te evaluemos sin costo o prefieres que te llamemos para contarte más detalles?"

🚫 **LO QUE TIENES PROHIBIDO:**
* No uses listas con viñetas (bullet points) a menos que sea estrictamente necesario. Habla en párrafos cortos de chat.
* No digas "Hola, soy un asistente virtual". Di "Hola! 👋".
* No niegues servicios. Si está en la lista, dilo.

HERRAMIENTAS:
- **Teléfono:** Si piden llamar: "¡Obvio! Déjame tu número y te contactamos".
- **Fotos:** Si piden ver: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Link:** Usa "AGENDA_AQUI_LINK" solo cuando el cliente quiera agendar.
`;
