// motor_clinico_v2.js
// Versión limpia y funcional

const clasificarPlan = (mensaje) => {
  const msg = mensaje.toLowerCase();

  const faciales = ["rostro", "cara", "arrugas", "manchas", "flacidez", "rejuvenecer", "ojeras", "papada"];
  const corporales = ["abdomen", "cintura", "glúteos", "piernas", "brazos", "espalda", "celulitis", "grasa", "trasero", "muslos"];

  const planes = {
    facial: {
      arrugas: "Face Elite",
      manchas: "Face Smart",
      flacidez: "Face Antiage",
      rejuvenecer: "Full Face",
      ojeras: "Face Light",
      papada: "Face Inicia",
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
  };

  let tipo = faciales.some(t => msg.includes(t)) ? "facial" :
             corporales.some(t => msg.includes(t)) ? "corporal" : "indefinido";

  let plan = "evaluación personalizada";

  if (tipo === "facial") {
    for (const key in planes.facial) {
      if (msg.includes(key)) plan = planes.facial[key];
    }
  } else if (tipo === "corporal") {
    for (const key in planes.corporal) {
      if (msg.includes(key)) plan = planes.corporal[key];
    }
  }

  let respuesta = "";

  if (tipo === "facial") {
    respuesta = `Para ese tipo de preocupación facial, el plan más indicado es *${plan}*.
Combinamos *HIFU 12D*, *Radiofrecuencia* y *Pink Glow* para mejorar firmeza, textura e hidratación de la piel.
Nuestros planes faciales parten desde **$128.800** e incluyen evaluación asistida por IA para ajustar el protocolo según tu piel.
Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  } else if (tipo === "corporal") {
    respuesta = `Para esa zona corporal, el plan más indicado es *${plan}*.
Trabajamos con *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor* para reducir grasa localizada, reafirmar y tonificar sin cirugía.
Nuestros tratamientos corporales parten desde **$232.000** y se ajustan según la evaluación asistida por IA.
Reserva tu diagnóstico sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  } else {
    respuesta = `Puedo ayudarte a definir el tratamiento ideal.
¿Tu objetivo principal es reducir grasa, reafirmar piel o rejuvenecer rostro?
Con esa información, la IA podrá recomendarte el plan exacto y personalizado.
Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  }

  return respuesta;
};

module.exports = { clasificarPlan };
