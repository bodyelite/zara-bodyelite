export const responses = {
  generar: (dominio, intencion, ultima) => {
    dominio = dominio || "general";
    intencion = intencion || "fallback";

    const grupo = {
      facial: {
        saludo:
          "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame si buscas rejuvenecer, lifting o mejorar firmeza facial.",
        descripcion:
          "✨ *Face Elite* combina HIFU focal, Radiofrecuencia y toxina cosmética para rejuvenecer rostro sin cirugía. Efecto lifting visible desde la primera sesión.",
        precio:
          "💰 El plan *Face Elite* tiene un valor de *$358.400 CLP*. Incluye 3 tecnologías faciales avanzadas y resultados desde la primera sesión.",
        sensacion:
          "😊 No duele. Es un tratamiento no invasivo y cómodo, puedes retomar tus actividades de inmediato.",
        resultados:
          "📸 Los resultados del *Face Elite* incluyen piel más firme, contorno definido y reducción de arrugas finas desde la primera sesión.",
        rechazo:
          "✅ Perfecto, si cambias de idea puedo contarte más sobre nuestros tratamientos faciales o corporales.",
        fallback:
          "¿Quieres que te cuente los resultados, precios o cómo funciona el tratamiento facial?",
      },
      corporal: {
        saludo:
          "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame qué zona deseas mejorar: abdomen, glúteos o piernas.",
        descripcion:
          "💎 Los tratamientos corporales combinan *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor* para reducir grasa, reafirmar y tonificar.",
        precio:
          "💰 Planes corporales más solicitados:\n- Lipo Body Elite $664.000\n- Push Up $376.000\n- Body Fitness $360.000",
        sensacion:
          "✨ No genera dolor, solo calor leve o contracciones musculares tolerables. Son procedimientos no invasivos.",
        resultados:
          "🏆 Desde la segunda sesión ya se observa reducción de grasa localizada, firmeza y mejor tono muscular.",
        rechazo:
          "Perfecto, puedo contarte más adelante o ayudarte con otra zona si lo prefieres.",
        fallback:
          "¿Quieres conocer precios, resultados o cómo funciona el tratamiento corporal?",
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
        resultados:
          "Los resultados son progresivos y visibles desde las primeras sesiones, tanto en rostro como cuerpo.",
        rechazo: "De acuerdo, puedo ayudarte más adelante o enviarte información general.",
        fallback:
          "¿Deseas que te recomiende un plan facial o corporal según tu objetivo?",
      },
    };

    return grupo[dominio]?.[intencion] || grupo[dominio]?.fallback || grupo.general.fallback;
  },
};

// === INTERPRETACIÓN ===
export function interpretarIntencion(text) {
  const t = text.toLowerCase();
  if (/hola|buenas|hey/.test(t)) return "saludo";
  if (/precio|vale|cu[aá]nto/.test(t)) return "precio";
  if (/duele|dolor|molesta|seguro/.test(t)) return "sensacion";
  if (/qué hace|consiste|funciona/.test(t)) return "descripcion";
  if (/resultad/.test(t)) return "resultados";
  if (/no|ninguno/.test(t)) return "rechazo";
  return "fallback";
}

export function obtenerDominio(text) {
  const t = text.toLowerCase();
  if (/face|facial|cara|hifu|arrugas|antiage|lifting/.test(t)) return "facial";
  if (/lipo|abdomen|grasa|cintura|gluteos|piernas|fitness|push/.test(t)) return "corporal";
  if (/agenda|evaluaci|cita|hora/.test(t)) return "general";
  return null;
}
