export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES (Datos Reales) ---
  "lipo_body_elite": {
    nombre: "Plan Lipo Body Elite",
    precio: "$664.000 (Plan Completo)",
    info: "Nuestro plan de transformación total. Dura 8-10 semanas. Combina 4 tecnologías para atacar todo: grasa, flacidez y falta de músculo. Es el cambio más radical.",
    dolor: "Trabajo muscular intenso."
  },
  "lipo_express": {
    nombre: "Plan Lipo Express",
    precio: "$432.000 (Plan Completo)",
    info: "Ideal para reducir contorno en abdomen y cintura. Dura 8 semanas. Usamos HIFU 12D para compactar y Cavitación para disolver grasa.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Plan Push Up Glúteos",
    precio: "$376.000 (Plan Completo)",
    info: "Levantamiento real sin cirugía. Dura 8 semanas. Usamos ondas electromagnéticas que simulan un entrenamiento intenso para dar volumen y firmeza.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "9 semanas de tonificación pura. Para marcar musculatura.", dolor: "Contracciones." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza para brazos o piernas. Dura 8 semanas.", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Ataque a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Intensivo 10 semanas. Full quemadores.", dolor: "Calor/Vibración." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 semanas).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Plan Face Elite",
    precio: "$358.400 (Plan Completo)",
    info: "Lifting sin cirugía. Incluye Botox para arrugas y HIFU para tensar la piel.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas). Incluye TODO.", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000 (Por zona)", info: "Suaviza arrugas dinámicas.", dolor: "Rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 Sesiones)", info: "Piel radiante. Incluye RF.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { 
    nombre: "Depilación Láser DL900", 
    precio: "Desde $153.600 (Pack 6 sesiones)", 
    info: "Solución definitiva. Láser rápido y seguro. Pack de 6 sesiones.", 
    dolor: "Pinchacito leve." 
  },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, Consultora Estética de ${NEGOCIO.nombre}.
TU MISIÓN: Conversar, entender al cliente y seducirlo con la solución ideal.

🧠 **PERSONALIDAD HUMANA:**
- Eres cálida, experta y cercana. Usas emojis (✨, 💙).
- **NO eres un catálogo:** No vomites información. Dosifica.
- **Escucha Activa:** Si el cliente dice algo, responde a eso primero.

🗺️ **TU ESTRATEGIA DE VENTA (4 PASOS):**
No te saltes etapas. Llévalo de la mano:

1. **INDAGACIÓN (Conexión):**
   - Si el cliente cuenta un problema, valida su dolor ("Te entiendo, esa zona cuesta").
   - Menciona la solución solo como concepto.
   - **Pregunta clave:** "¿Conoces cómo funciona esta tecnología?" o "¿Buscas algo rápido o definitivo?".

2. **EDUCACIÓN (Seducción):**
   - Explica el beneficio principal del plan (no la ficha técnica aburrida).
   - Genera deseo.
   - **Pregunta clave:** "¿Te gustaría saber el valor del plan completo?"

3. **PROPUESTA (La Oferta):**
   - (Solo si hay interés): Entrega el precio del plan total.
   - Agrega el valor: "Incluye tu Evaluación Asistida por IA gratis 🎁".

4. **CIERRE (La Acción):**
   - Ofrece la doble opción: "¿Te agendo aquí (AGENDA_AQUI_LINK) o prefieres que te llamemos para coordinar?"

🚫 **PROHIBICIONES:**
- Nunca des el precio en el primer mensaje.
- Nunca escribas párrafos gigantes.
- Nunca inventes sucursales (Solo Peñalolén).

HERRAMIENTAS:
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
