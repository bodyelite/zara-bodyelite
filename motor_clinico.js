export function generarRespuestaClinica(zona, objetivo) {
  zona = (zona || '').toLowerCase();
  objetivo = (objetivo || '').toLowerCase();

  const planes = {
    abdomen: { nombre: "Lipo Body Elite", sesiones: 12, precio: 664000, tecnologias: "HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor", descripcion: "reduce grasa localizada, reafirma y modela la cintura sin cirugía." },
    gluteos: { nombre: "Push Up Glúteos", sesiones: 8, precio: 376000, tecnologias: "HIFU 12D + EMS Sculptor", descripcion: "tonifica y levanta los glúteos mediante contracciones musculares intensas." },
    piernas: { nombre: "Body Fitness", sesiones: 8, precio: 360000, tecnologias: "Cavitación + Radiofrecuencia + EMS", descripcion: "reduce celulitis y mejora la firmeza de piernas y muslos." },
    brazos: { nombre: "Body Tensor", sesiones: 8, precio: 232000, tecnologias: "Radiofrecuencia + HIFU Focalizado", descripcion: "reafirma la piel flácida y define brazos." },
    rostro: { nombre: "Face Elite", sesiones: 10, precio: 358400, tecnologias: "HIFU Focalizado + Radiofrecuencia + LED Terapia + Pink Glow", descripcion: "rejuvenece piel, reduce arrugas y mejora luminosidad." },
  };

  const link = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  let plan;

  if (zona.includes("abdomen") || zona.includes("barriga") || zona.includes("cintura")) plan = planes.abdomen;
  else if (zona.includes("glute") || zona.includes("trasero") || zona.includes("pompis")) plan = planes.gluteos;
  else if (zona.includes("pierna") || zona.includes("muslo")) plan = planes.piernas;
  else if (zona.includes("brazo")) plan = planes.brazos;
  else if (zona.includes("cara") || zona.includes("rostro") || zona.includes("facial")) plan = planes.rostro;
  else plan = planes.abdomen;

  return `Para ${zona || "esa zona"}, el tratamiento más indicado es nuestro *${plan.nombre}*. 
Usa ${plan.tecnologias} y ${plan.descripcion}
El valor parte desde *$${plan.precio.toLocaleString("es-CL")}* e incluye *${plan.sesiones} sesiones*.
Durante tu evaluación gratuita asistida por IA definiremos si este u otro protocolo se ajusta mejor.
Agenda aquí 👉 ${link}`;
}

console.log("✅ motor_clinico.js activo");
