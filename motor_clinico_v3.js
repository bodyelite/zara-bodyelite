// motor_clinico_v3.js
// Versión clínica integral Body Elite
// Reconoce síntomas, zonas, tecnologías y activos. Explica, recomienda y educa.

const clasificarPlan = (mensaje) => {
  const msg = mensaje.toLowerCase();

  const faciales = ["rostro", "cara", "arrugas", "manchas", "ojeras", "papada", "flacidez facial", "rejuvenecer", "botox", "toxina", "limpieza", "hidratación", "poros", "cuello"];
  const corporales = ["abdomen", "cintura", "piernas", "brazos", "glúteos", "espalda", "flacidez corporal", "celulitis", "grasa", "adiposidad", "tonificar", "reafirmar", "modelar"];

  const tecnologias = {
    hifu: "HIFU 12D trabaja con ultrasonido focalizado para tensar la fascia SMAS y eliminar grasa subcutánea.",
    cavitacion: "Cavitación rompe los adipocitos por presión alternante, ayudando a reducir volumen.",
    radiofrecuencia: "Radiofrecuencia genera calor endógeno que estimula colágeno tipo I y III, logrando piel más firme y lisa.",
    ems: "EMS Sculptor provoca 20.000 contracciones musculares en 30 minutos, tonificando y elevando músculo.",
    pinkglow: "Pink Glow aporta péptidos y antioxidantes para regenerar y dar luminosidad a la piel.",
    exosomas: "Los exosomas regeneran tejido y mejoran textura, ideales en protocolos faciales avanzados.",
    led: "LED Therapy usa luz azul, roja y ámbar para reparar, desinflamar y revitalizar la piel.",
    botox: "El botox forma parte de protocolos como Face Elite o Full Face, donde se combina con HIFU y RF para resultados más naturales y duraderos."
  }

  const planes = {
    facial: {
      arrugas: "Face Elite",
      manchas: "Face Smart",
      ojeras: "Face Light",
      papada: "Face Inicia",
      flacidez: "Face Antiage",
      botox: "Face Elite",
      toxina: "Face Elite",
      limpieza: "Limpieza Facial Full",
      rejuvenecer: "Full Face",
      cuello: "Full Face",
      default: "Face Smart"
    },
    corporal: {
      celulitis: "Lipo Body Elite",
      grasa: "Lipo Reductiva",
      cintura: "Lipo Express",
      glúteos: "Push Up",
      flacidez: "Body Tensor",
      tonificar: "Body Fitness",
      default: "Lipo Body Elite"
    }
  }

  let tipo = faciales.some(t => msg.includes(t)) ? "facial" :
             corporales.some(t => msg.includes(t)) ? "corporal" : "indefinido";

  let plan = "evaluación personalizada";
  if (tipo === "facial") {
    for (const key in planes.facial) if (msg.includes(key)) plan = planes.facial[key];
  } else if (tipo === "corporal") {
    for (const key in planes.corporal) if (msg.includes(key)) plan = planes.corporal[key];
  }

  let descripcion = "";
  if (tipo === "facial") {
    descripcion = `El plan *${plan}* combina ${msg.includes("botox") ? "botox, HIFU 12D y Radiofrecuencia" : "HIFU 12D, Radiofrecuencia y Pink Glow"} para rejuvenecer y reafirmar la piel de forma natural.`;
  } else if (tipo === "corporal") {
    descripcion = `El plan *${plan}* aplica HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para reducir grasa localizada y tonificar sin cirugía.`;
  } else {
    descripcion = "Cada plan se ajusta tras diagnóstico con IA y análisis corporal FitDays.";
  }

  let infoExtra = "";
  for (const key in tecnologias) if (msg.includes(key)) infoExtra += `\n💡 ${tecnologias[key]}`;

  let respuesta = "";
  if (tipo === "facial") {
    respuesta = `✨ ${descripcion}
Planes faciales desde **$120.000** con evaluación gratuita asistida por IA.
Reserva tu diagnóstico aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9${infoExtra}`;
  } else if (tipo === "corporal") {
    respuesta = `💪 ${descripcion}
Planes corporales desde **$232.000**, definidos tras evaluación IA.
Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9${infoExtra}`;
  } else {
    respuesta = `Puedo ayudarte a definir el tratamiento ideal.
¿Tu objetivo principal es reducir grasa, reafirmar piel o rejuvenecer rostro?
Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  }

  return respuesta;
}

export {  clasificarPlan }
