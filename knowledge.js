// knowledge.js
export const knowledge = {
  diagnostico: {
    nombre: "Diagnóstico Body Elite",
    descripcion:
      "Evaluación corporal y facial asistida por inteligencia artificial con tecnología FitDays y análisis fotográfico Janus. Permite determinar composición corporal, grasa visceral, masa muscular, hidratación y estado cutáneo para definir el plan más adecuado.",
    incluye: [
      "Medición FitDays",
      "Análisis facial Janus",
      "Asesoría profesional",
      "Plan personalizado según objetivos"
    ],
    experiencia:
      "El diagnóstico es rápido, sin dolor y sin exposición. Se realiza en menos de 20 minutos con informe digital.",
    precio: "Gratuito",
    derivar: true
  },

  tratamientos: [
    {
      nombre: "Lipo Focalizada Reductiva",
      categoria: "Corporal",
      objetivos: ["reducir grasa localizada", "mejorar firmeza", "definir contorno"],
      aparatologia: ["Cavitación", "Radiofrecuencia", "EMS Sculptor"],
      sesiones: 6,
      duracion: "45–60 minutos por sesión",
      experiencia:
        "Sensación de calor controlado y contracciones leves sin dolor. No requiere tiempo de recuperación.",
      resultados:
        "Reducción promedio de 3–6 cm desde la 3ª sesión, con mejora visible de contorno y firmeza.",
      precio: 480000,
      derivar: true
    },
    {
      nombre: "Lipo Body Elite",
      categoria: "Corporal",
      objetivos: ["reducir grasa resistente", "reafirmar piel", "tonificar musculatura"],
      aparatologia: ["HIFU 12D", "Cavitación", "Radiofrecuencia", "EMS Sculptor"],
      sesiones: 10,
      duracion: "60–75 minutos",
      experiencia:
        "Sesiones progresivas con sensación térmica moderada y contracciones musculares profundas.",
      resultados:
        "Reducción de hasta 8 cm en zonas localizadas, mayor definición corporal y mejora de textura cutánea.",
      precio: 664000,
      derivar: true
    },
    {
      nombre: "Lipo Express",
      categoria: "Corporal",
      objetivos: ["reducir grasa localizada rápido", "mejorar tonicidad"],
      aparatologia: ["Cavitación", "Radiofrecuencia", "EMS Sculptor"],
      sesiones: 6,
      duracion: "45 minutos",
      experiencia: "Tratamiento intensivo con resultados visibles en 3 semanas.",
      resultados: "Reduce entre 3–5 cm promedio en abdomen o muslos.",
      precio: 432000,
      derivar: true
    },
    {
      nombre: "Body Fitness",
      categoria: "Corporal",
      objetivos: ["fortalecer y definir musculatura", "aumentar masa magra"],
      aparatologia: ["EMS Sculptor", "Radiofrecuencia"],
      sesiones: 6,
      duracion: "45 minutos",
      experiencia:
        "Contracciones musculares profundas equivalentes a 20.000 ejercicios en una sesión.",
      resultados: "Tonificación visible y mejora del rendimiento muscular.",
      precio: 360000,
      derivar: true
    },
    {
      nombre: "Body Tensor",
      categoria: "Corporal",
      objetivos: ["tratar flacidez corporal", "reafirmar piel"],
      aparatologia: ["Radiofrecuencia", "HIFU corporal"],
      sesiones: 6,
      duracion: "40–50 minutos",
      experiencia:
        "Calor superficial progresivo y sensación de lifting inmediato sin dolor.",
      resultados: "Piel más firme y tonificada desde la 2ª sesión.",
      precio: 232000,
      derivar: true
    },
    {
      nombre: "Push Up",
      categoria: "Corporal",
      objetivos: ["levantar glúteos", "reafirmar y tonificar"],
      aparatologia: ["HIFU corporal", "EMS Sculptor", "Radiofrecuencia"],
      sesiones: 6,
      duracion: "60 minutos",
      experiencia:
        "Sensación de contracción y calor profundo, sin molestias posteriores.",
      resultados:
        "Elevación y firmeza visibles desde la 3ª sesión, con mejora en textura y tono.",
      precio: 376000,
      derivar: true
    },
    {
      nombre: "Face Elite",
      categoria: "Facial",
      objetivos: ["rejuvenecer", "elevar contornos", "mejorar textura y firmeza"],
      aparatologia: ["HIFU facial", "Radiofrecuencia", "Toxina Botulínica"],
      sesiones: 6,
      duracion: "45 minutos",
      experiencia:
        "Sensación térmica leve y hormigueo. Procedimiento cómodo y no invasivo.",
      resultados:
        "Mejora la firmeza, redefine contornos y reduce líneas desde la 2ª sesión.",
      precio: 358400,
      derivar: true
    },
    {
      nombre: "Face Antiage",
      categoria: "Facial",
      objetivos: ["reducir arrugas", "mejorar luminosidad y textura"],
      aparatologia: ["Radiofrecuencia", "Toxina Botulínica", "Pink Glow"],
      sesiones: 6,
      duracion: "45 minutos",
      experiencia: "Tratamiento relajante con sensación de calor suave.",
      resultados:
        "Piel más firme, luminosa y con reducción visible de líneas finas en 3–4 sesiones.",
      precio: 281600,
      derivar: true
    },
    {
      nombre: "Pink Glow",
      categoria: "Facial",
      objetivos: ["hidratar", "unificar tono", "mejorar brillo y textura"],
      aparatologia: ["Mesoterapia", "LED Facial"],
      sesiones: 3,
      duracion: "30 minutos",
      experiencia:
        "Sensación fresca y relajante, sin molestias ni tiempo de recuperación.",
      resultados:
        "Efecto glow inmediato, piel más suave y luminosa desde la primera sesión.",
      precio: 120000,
      derivar: true
    },
    {
      nombre: "Toxina Botulínica",
      categoria: "Facial",
      objetivos: ["relajar músculos faciales", "suavizar líneas de expresión"],
      aparatologia: ["Aplicación profesional"],
      sesiones: 1,
      duracion: "30 minutos",
      experiencia: "Procedimiento rápido y preciso, sin tiempo de recuperación.",
      resultados: "Efecto visible a los 3–5 días, duración aproximada 4–6 meses.",
      precio: 180000,
      derivar: true
    },
    {
      nombre: "RF Facial y Corporal",
      categoria: "Ambos",
      objetivos: ["reafirmar piel", "estimular colágeno", "mejorar circulación"],
      aparatologia: ["Radiofrecuencia multipolar"],
      sesiones: 3,
      duracion: "30–45 minutos",
      experiencia: "Sensación de calor agradable sin dolor.",
      resultados: "Efecto tensor inmediato y progresivo a corto plazo.",
      precio: 60000,
      derivar: true
    }
  ],

  mensajes: {
    bienvenida:
      "Hola 👋, soy Zara, asistente de Body Elite. Puedo ayudarte a conocer tratamientos, precios o agendar tu diagnóstico gratuito. ¿Qué zona te gustaría mejorar?",
    agendar:
      "📅 Puedes agendar fácilmente tu evaluación gratuita con nuestros especialistas. Incluye diagnóstico FitDays y asesoría personalizada.",
    link: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
    aviso:
      "🔔 Nuevo interesado en agendar evaluación. Revisa Reservo o contacta por seguimiento."
  }
};
