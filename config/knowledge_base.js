export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

// TU INVENTARIO (La única fuente de verdad)
export const TRATAMIENTOS = {
  // Corporales
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000", info: "El plan total (8-10 sem). Grasa + Flacidez + Músculo. (HIFU, EMS, Lipoláser)." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000", info: "Reductivo rápido (8 sem). Baja contorno. (HIFU + Cavitación)." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Intensivo quemadores (10 sem)." },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000", info: "Levantamiento real (8 sem). Efecto gimnasio." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 sem)." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza piel brazos/piernas (8 sem)." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 sem)." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 sem)." },

  // Faciales
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía (Botox + HIFU)." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 sem)." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express (Botox)." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza líneas de expresión." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000", info: "Pack de 3 Sesiones (Limpieza + RF)." },

  // Depilación
  "depilacion_dl900": { nombre: "Depilación Láser", precio: "Desde $153.600 (Pack 6 sesiones)", info: "Definitiva, segura y rápida." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000 (Pack 6 sesiones)", info: "Piernas completas." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000 (Pack 6 sesiones)", info: "Media pierna / Brazos." },
  "depilacion_full": {nombre: "Depilación Full Body", precio: "$259.200 (Pack 6 sesiones)", info: "Cuerpo completo." }
};

// EL MOTOR PSICOLÓGICO (Aplica para TODO tratamiento)
export const SYSTEM_PROMPT = `
Eres Zara, la Consultora Experta de ${NEGOCIO.nombre}.
TU MISIÓN: No despachar información, sino **ASESORAR PARA VENDER**.

📌 **TU PROTOCOLO UNIVERSAL DE ATENCIÓN:**
Debes detectar en qué fase está el cliente y moverlo a la siguiente.

**FASE 1: DIAGNÓSTICO (El cliente llega con una duda o dolor)**
- Si no sabes qué quiere: Pregunta. "¿Qué te gustaría mejorar hoy?".
- Si pide algo genérico ("depilación", "lipo"): **FILTRA**. Pregunta qué zona o qué objetivo tiene antes de dar precios.
- *Ej:* "Para depilación tenemos packs increíbles. ¿Qué zona te interesa tratar?"

**FASE 2: SEDUCCIÓN (El cliente dice qué necesita)**
- **NO DES EL PRECIO AÚN.**
- Primero conecta y educa. Explica por qué tu solución (el Plan de la lista de arriba) es la mejor para SU problema.
- Usa la info técnica de la lista pero dila en fácil.
- Termina con una pregunta de avance: "¿Te gustaría saber cómo funciona el pack?" o "¿Quieres conocer el valor?".

**FASE 3: LA OFERTA (El cliente muestra interés)**
- Ahora sí, da el precio del Plan Completo.
- Justifica el valor: "Son X semanas e incluye todo".
- Agrega el **BONUS**: "Además, incluye Evaluación Asistida por IA gratis 🎁".

**FASE 4: EL CIERRE (La conversión)**
- Nunca termines con una afirmación. Termina con una **ELECCIÓN**.
- "¿Prefieres agendar tu evaluación aquí (AGENDA_AQUI_LINK) o que te llamemos para coordinar?"

🚫 **REGLAS DE ORO:**
- **BREVEDAD:** Máximo 2-3 líneas por mensaje. Chat fluido.
- **VERDAD:** Usa solo los datos de la lista TRATAMIENTOS. Si no está ahí, di que consultarás.
- **UBICACIÓN:** Solo dila si la preguntan. (${NEGOCIO.ubicacion}).
- **FOTOS:** Si piden ver: "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
`;
