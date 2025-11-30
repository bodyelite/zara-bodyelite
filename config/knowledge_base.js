export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // Datos Reales (Zara los usará para crear sus propias frases)
  "lipo_body_elite": { nombre: "Plan Lipo Body Elite", precio: "$664.000 (Plan Completo)", info: "El cambio total (8-10 semanas). Ataca grasa, flacidez y músculo. (HIFU 12D + EMS + Lipoláser)." },
  "lipo_express": { nombre: "Plan Lipo Express", precio: "$432.000 (Plan Completo)", info: "Reductivo rápido (8 semanas). Baja contorno y 'pega' la piel. (HIFU 12D + Cavitación)." },
  "push_up": { nombre: "Plan Push Up Glúteos", precio: "$376.000 (Plan Completo)", info: "Levantamiento real (8 semanas). Efecto gimnasio potente." },
  "body_fitness": { nombre: "Plan Body Fitness", precio: "$360.000", info: "Tonificación pura (9 semanas)." },
  "body_tensor": { nombre: "Plan Body Tensor", precio: "$232.000", info: "Firmeza piel (8 semanas)." },
  "lipo_focalizada": { nombre: "Plan Lipo Focalizada", precio: "$348.800", info: "Zonas difíciles (4 semanas)." },
  "lipo_reductiva": { nombre: "Plan Lipo Reductiva", precio: "$480.000", info: "Intensivo 10 semanas." },
  "lipo_papada": { nombre: "Plan Lipo Papada", precio: "$313.600", info: "Perfilado rostro (4 semanas)." },
  "face_elite": { nombre: "Plan Face Elite", precio: "$358.400", info: "Lifting sin cirugía (Botox + HIFU)." },
  "full_face": { nombre: "Plan Full Face", precio: "$584.000", info: "Rejuvenecimiento total (8 semanas)." },
  "face_antiage": { nombre: "Plan Face Antiage", precio: "$281.600", info: "Anti-arrugas express (Botox)." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar", info: "Limpieza profunda + hidratación." },
  "limpieza_full": { nombre: "Pack Limpieza Facial Full", precio: "$120.000 (Pack 3 sesiones)", info: "Piel radiante." },
  "depilacion_dl900": { nombre: "Depilación Láser", precio: "Desde $153.600 (6 sesiones)", info: "Definitiva y segura." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones." },
  "depilacion_mediana": {nombre: "Depilación Zona Mediana", precio: "$240.000", info: "Pack 6 sesiones." }
};

export const SYSTEM_PROMPT = `
Eres Zara, la Consultora Experta de ${NEGOCIO.nombre}.
TU META: Conversar para Vender. No informar por informar.

🧠 **TU CEREBRO DE VENTAS (4 PASOS):**
1. **Escucha:** Si el cliente dice "tengo rollitos", valida ese dolor ("Te entiendo, es difícil").
2. **Seduce:** Presenta la solución como un beneficio ("El Lipo Express es genial para eso"). NO des el precio aún.
3. **Propón:** Cuando haya interés, da el precio del plan completo + el regalo (Evaluación IA).
4. **Cierra:** Ofrece siempre dos caminos ("¿Te agendo aquí o te llamamos?").

🚫 **REGLAS DE ORO:**
- **JAMÁS uses textos largos.** Máximo 2 líneas. Estilo chat.
- **JAMÁS des el precio de entrada.** Genera valor primero.
- **SIEMPRE termina con pregunta.** Mantén el chat vivo.
`;
