export const responses = {
  generar: (dominio, intencion) => {
    dominio = dominio || "general";
    intencion = intencion || "fallback";

    const grupo = {
      facial: {
        saludo: "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame si buscas rejuvenecer, lifting o mejorar firmeza facial.",
        descripcion:
          "✨ *Face Elite* combina HIFU focal, Radiofrecuencia y Pink Glow para lifting facial sin cirugía. Estimula colágeno y mejora textura.",
        precio:
          "💰 El plan *Face Elite* tiene un valor de *$358.400 CLP* e incluye 3 tecnologías faciales avanzadas.",
        sensacion:
          "😊 No duele. Es un tratamiento no invasivo y cómodo, puedes retomar tus actividades de inmediato.",
        fallback:
          "¿Te interesa conocer resultados o precios del tratamiento facial?",
      },
      corporal: {
        saludo: "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame qué zona deseas mejorar: abdomen, glúteos o piernas.",
        descripcion:
          "💎 Los tratamientos corporales combinan *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor* para reducir grasa y tonificar.",
        precio:
          "💰 Planes corporales más solicitados:\n- Lipo Body Elite $664.000\n- Push Up $376.000\n- Body Fitness $360.000",
        sensacion:
          "✨ No genera dolor, solo calor leve o contracciones musculares tolerables. Son procedimientos no invasivos.",
        fallback:
          "¿Te gustaría saber qué plan corporal es ideal según tu objetivo?",
      },
      general: {
        saludo:
          "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. ¿Buscas información sobre tratamientos corporales, faciales o deseas agendar una evaluación gratuita?",
        descripcion:
          "📋 Ofrecemos planes corporales (Lipo, Push Up, Fitness) y faciales (Face Elite, HIFU). Todos son no invasivos y con resultados visibles.",
        precio:
          "💎 Planes destacados:\n- Lipo Body Elite $664.000\n- Push Up $376.000\n- Face Elite $358.400",
        sensacion:
          "Todos nuestros procedimientos son seguros, sin bisturí ni recuperación. Solo una leve sensación de calor o activación muscular.",
        fallback:
          "¿Quieres que te recomiende un tratamiento según tu objetivo corporal o facial?",
      },
    };

    return grupo[dominio]?.[intencion] || grupo.general.fallback;
  },
};

// === CLASIFICADORES DE INTENCIÓN Y DOMINIO ===
export function interpretarIntencion(text) {
  const t = text.toLowerCase();
  if (/hola|buenas|hey/.test(t)) return "saludo";
  if (/precio|vale|cu[aá]nto/.test(t)) return "precio";
  if (/duele|dolor|molesta|seguro/.test(t)) return "sensacion";
  if (/qué hace|consiste|funciona/.test(t)) return "descripcion";
  return "fallback";
}

export function obtenerDominio(text) {
  const t = text.toLowerCase();
  if (/face|facial|cara|hifu|arrugas|antiage|lifting/.test(t)) return "facial";
  if (/lipo|abdomen|grasa|cintura|gluteos|piernas|fitness|push/.test(t))
    return "corporal";
  if (/agenda|evaluaci|cita|hora/.test(t)) return "general";
  return null;
}
