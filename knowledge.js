// knowledge.js
export const knowledge = {
  mensajes: {
    bienvenida:
      "Hola 👋, soy Zara, asistente de Body Elite. Puedo ayudarte a conocer tratamientos, precios o agendar tu diagnóstico gratuito. ¿Qué zona te gustaría mejorar?",
    agendar:
      "Puedes agendar tu diagnóstico gratuito con tecnología FitDays. Incluye evaluación corporal y facial completa con nuestros especialistas 💆‍♀️.",
    link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
    aviso:
      "🔔 Nuevo interesado en agendar evaluación. Verifica agenda en Reservo o confirma contacto por WhatsApp interno."
  },

  respuestas: {
    dolor:
      "Nuestros tratamientos son no invasivos, sin dolor ni tiempo de recuperación. Solo puedes sentir calor moderado o contracciones musculares suaves según la tecnología utilizada.",
    resultados:
      "Los resultados comienzan a notarse desde la 3ª sesión y se consolidan al completar el plan. Incluye seguimiento con FitDays y asesoría de hábitos.",
    equipos:
      "Trabajamos con tecnología HIFU 12D, Cavitación 3D, Radiofrecuencia Multipolar, EMS Sculptor, Pink Glow, y Exosomas. Todas certificadas para uso estético profesional."
  },

  tratamientos: [
    {
      nombre: "Lipo Focalizada Reductiva",
      precio: 480000,
      sesiones: 6,
      duracion: "60 min",
      aparatologia: ["Cavitación 3D", "Radiofrecuencia Multipolar", "EMS Sculptor"],
      objetivos: [
        "reducir grasa localizada",
        "definir cintura",
        "afinar abdomen",
        "mejorar firmeza corporal"
      ],
      resultados:
        "Resultados visibles desde la 3ª sesión: reducción de centímetros, mayor firmeza y contorno definido.",
      experiencia:
        "Cada sesión combina tecnología reductiva y tensora. No genera dolor, solo sensación de calor y contracciones leves.",
      zonas: ["abdomen", "cintura", "guatita", "panza", "espalda baja"]
    },
    {
      nombre: "Lipo Body Elite",
      precio: 664000,
      sesiones: 8,
      duracion: "75 min",
      aparatologia: ["HIFU 12D", "EMS Sculptor Pro", "Cavitación", "Radiofrecuencia"],
      objetivos: ["reducción avanzada", "reafirmar piel", "definir contornos", "modelar abdomen completo"],
      resultados:
        "Reducción significativa de grasa y flacidez en abdomen y cintura. Cambios visibles desde la 2ª sesión.",
      experiencia:
        "Tratamiento integral que combina tres tecnologías en una misma sesión. Sensación cálida y confortable, sin dolor.",
      zonas: ["abdomen", "cintura", "espalda", "flancos", "glúteos"]
    },
    {
      nombre: "Body Fitness",
      precio: 360000,
      sesiones: 6,
      duracion: "45 min",
      aparatologia: ["EMS Sculptor Pro", "Radiofrecuencia Focal"],
      objetivos: ["tonificar", "reafirmar", "aumentar masa muscular"],
      resultados:
        "Tonificación visible y mejora del volumen muscular desde las primeras sesiones. Ideal para glúteos, piernas y abdomen.",
      experiencia:
        "Produce contracciones musculares controladas equivalentes a miles de ejercicios. Sin dolor ni esfuerzo físico.",
      zonas: ["glúteos", "piernas", "brazos", "abdomen"]
    },
    {
      nombre: "Body Tensor",
      precio: 232000,
      sesiones: 4,
      duracion: "45 min",
      aparatologia: ["Radiofrecuencia Multipolar", "Láser Frío"],
      objetivos: ["reafirmar", "mejorar elasticidad", "disminuir flacidez"],
      resultados:
        "Piel más firme y tonificada desde la primera sesión. Ideal para postparto o pérdida de peso.",
      experiencia:
        "Tratamiento confortable y relajante. Sensación de calor suave que estimula colágeno y elastina.",
      zonas: ["brazos", "muslos", "abdomen", "glúteos"]
    },
    {
      nombre: "Face Elite",
      precio: 358400,
      sesiones: 6,
      duracion: "50 min",
      aparatologia: ["HIFU 12D Facial", "Radiofrecuencia Bipolar", "Pink Glow"],
      objetivos: ["mejorar firmeza", "elevar óvalo facial", "reducir papada"],
      resultados:
        "Rejuvenecimiento facial visible: piel más firme y definida, mejora de la papada y contorno del rostro.",
      experiencia:
        "Aplicación indolora con sensación de calor leve y microestimulación. No requiere tiempo de recuperación.",
      zonas: ["rostro", "papada", "mejillas", "cuello", "frente"]
    },
    {
      nombre: "Face Antiage",
      precio: 281600,
      sesiones: 6,
      duracion: "45 min",
      aparatologia: ["Radiofrecuencia Facial", "Toxina Botulínica Pro", "Pink Glow"],
      objetivos: ["reducir líneas de expresión", "mejorar luminosidad", "rejuvenecer rostro"],
      resultados:
        "Rostro descansado y luminoso. Disminución visible de líneas finas y textura uniforme desde la primera sesión.",
      experiencia:
        "Sensación suave y sin dolor. El protocolo combina estimulación y principios activos antiedad.",
      zonas: ["rostro", "frente", "ojeras", "mejillas"]
    },
    {
      nombre: "Toxina Botulínica Pro",
      precio: 180000,
      sesiones: 1,
      duracion: "40 min",
      aparatologia: ["Aplicación Médica"],
      objetivos: ["relajar músculos faciales", "suavizar líneas de expresión"],
      resultados:
        "Efecto lifting y rostro descansado por 4-6 meses. Aplicado por profesionales certificados.",
      experiencia:
        "Procedimiento rápido, mínimamente molesto, sin tiempo de recuperación.",
      zonas: ["frente", "entrecejo", "patas de gallo"]
    },
    {
      nombre: "Exosomas Faciales",
      precio: 420000,
      sesiones: 4,
      duracion: "50 min",
      aparatologia: ["Nano-microneedling", "Plataforma Regen"],
      objetivos: ["estimular regeneración celular", "mejorar textura y luminosidad"],
      resultados:
        "Regeneración profunda y piel más uniforme. Ideal para manchas o envejecimiento prematuro.",
      experiencia:
        "Sensible y controlado; puede generar enrojecimiento leve durante 24 h.",
      zonas: ["rostro", "cuello", "escote"]
    }
  ]
};
