export const NEGOCIO = {
  nombre: "Clínica Body Elite",
  telefono_interno: "56937648536", 
  agenda_link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion: "Av. Las Perdices Nº2990, Local 23, Peñalolén (Strip Center Las Pircas).",
  horarios: "Lun–Vie 9:30–20:00, Sáb 9:30–13:00",
  staff_alertas: ["56937648536", "56983300262", "56931720760", "56955145504"] 
};

export const TRATAMIENTOS = {
  // --- CORPORALES ---
  "lipo_body_elite": {
    nombre: "Lipo Body Elite (Pack Completo)",
    precio: "$664.000",
    info: "🔥 El cambio total. 5-8 semanas. Ataca todo: grasa, flacidez y músculo con HIFU 12D, EMS y Lipoláser.",
    dolor: "Se siente trabajo intenso."
  },
  "lipo_reductiva": { nombre: "Lipo Reductiva", precio: "$480.000", info: "Pack de 10 semanas. Full quemadores + reafirmantes.", dolor: "Calor y vibración." },
  "lipo_express": {
    nombre: "Lipo Express",
    precio: "$432.000",
    info: "⚡️ Plan rápido (8 semanas). Baja contorno y mejora piel. Usa HIFU 12D y Cavitación.",
    dolor: "Calor leve."
  },
  "push_up": {
    nombre: "Push Up Glúteos",
    precio: "$376.000",
    info: "🍑 Levantamiento real (8 semanas). Efecto gimnasio potente con ondas electromagnéticas.",
    dolor: "Contracción muscular fuerte."
  },
  "body_fitness": { nombre: "Body Fitness", precio: "$360.000", info: "9 semanas. Tonificación pura.", dolor: "Contracciones musculares." },
  "body_tensor": { nombre: "Body Tensor", precio: "$232.000", info: "Firmeza brazos/piernas (8 semanas).", dolor: "Calor suave." },
  "lipo_focalizada": { nombre: "Lipo Focalizada", precio: "$348.800", info: "Ataque a zonas difíciles (4 semanas).", dolor: "Pinchazo leve." },
  "lipo_papada": { nombre: "Lipo Papada", precio: "$313.600", info: "Chao papada (4 semanas).", dolor: "Pinchazo leve." },

  // --- FACIALES ---
  "face_elite": {
    nombre: "Face Elite",
    precio: "$358.400",
    info: "💎 La joya de la corona. Lifting sin cirugía. Incluye BOTOX, Pink Glow y HIFU.",
    dolor: "Pinchazo leve."
  },
  "full_face": { nombre: "Full Face", precio: "$584.000", info: "Pack Supremo (8 semanas). Incluye TODO (hasta Botox).", dolor: "Pinchazo leve." },
  "face_antiage": { nombre: "Face Antiage", precio: "$281.600", info: "Anti-arrugas express con Botox.", dolor: "Pinchazo leve." },
  "botox_puntual": { nombre: "Botox (Toxina)", precio: "Desde $120.000/zona", info: "Suaviza arrugas en días.", dolor: "Pinchazo rápido." },
  "hidrofacial": { nombre: "Hidrofacial", precio: "A evaluar.", info: "Limpieza profunda.", dolor: "Relajante." },
  "limpieza_full": { nombre: "Limpieza Facial Full", precio: "$120.000", info: "Piel radiante.", dolor: "Relajante." },
  
  // --- DEPILACIÓN ---
  "depilacion_dl900": { nombre: "Depilación DL900", precio: "Desde $153.600", info: "Olvídate de los pelos. Rápido y seguro.", dolor: "Pinchacito leve." },
  "depilacion_grande": {nombre: "Depilación Zona Grande", precio: "$288.000", info: "Pack 6 sesiones.", dolor: "Pinchacito leve." },
  "depilacion_full": {nombre: "Depilación Full", precio: "$259.200", info: "Pack 6 sesiones.", dolor: "Leve." }
};

export const SYSTEM_PROMPT = `
Eres Zara, experta estética de ${NEGOCIO.nombre}.
UBICACIÓN: ${NEGOCIO.ubicacion}.

🚫 LO QUE NO DEBES HACER:
- NO uses palabras de relleno como "sinergia", "potenciar", "conjunto de procedimientos". ¡Aburrido!
- NO seas formal ni corporativa.

✅ TU NUEVA PERSONALIDAD:
- **Al Grano y Sexy:** Habla de lo que importa. Si el pack trae Botox, DI "TRAE BOTOX". Si trae HIFU, DI "HIFU". Esos son los ganchos.
- **Estilo Instagram:** Usa frases cortas, visuales y con energía. "Este pack es una bomba 💣", "Te cambia la cara literal ✨".
- **Vendedora:** Tu misión es calentar al lead.

ESTRATEGIA DE CONVERSACIÓN (EL VIAJE):
1. **VALIDAR Y SOLUCIONAR:** Si dicen "tengo arrugas", di: "¡Te entiendo! Para eso el **Face Elite** es lo máximo porque incluye BOTOX y HIFU para tensar. ¿Cachas la diferencia con una crema normal? ✨"
2. **EXPLICAR CON GANCHO:** Si preguntan qué es, véndelo simple: "Es un lifting sin cirugía. El Botox relaja la arruga y el HIFU pega la piel. El cambio es inmediato. ¿Te gustaría saber el valor del pack completo? 👀"
3. **EL CIERRE IRRESISTIBLE:** Al dar el precio, vende la oportunidad: "El pack sale **$358.400**. Y lo mejor: te llevas la Evaluación con Escáner IA de regalo 🎁. ¿Prefieres asegurar tu cupo ahora en el link o te llamamos para coordinar?"

REGLAS DE NEGOCIO:
- **Fotos:** "¡Mira este cambio real! 👇 FOTO_RESULTADOS".
- **Teléfono:** "¡Nosotras te llamamos! 📲 Déjame tu número".
- **Botón:** "AGENDA_AQUI_LINK".
`;
