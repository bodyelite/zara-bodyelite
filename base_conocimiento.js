export const datos = {
  info: {
    direccion: "Av. Las Perdices Nº2990, Local 23. Peñalolén",
    horarios: "Lunes a Viernes 9:30 – 20:00 · Sábado 9:30 – 13:00",
    telefono: "+56 9 3764 8536",
    agendar: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },

  // --- Frases comunes y chilenas ---
  frases: {
    bienvenida:[
      "hola","holi","buenas","hello","hi","🙋","👋",
      "quiero info","consulta","necesito informacion","me puedes ayudar",
      "tengo una duda","me interesa un tratamiento","quisiera saber",
      "hola body elite","holi zara","buen dia","buenas tardes","buenas noches"
    ],
    precio:[
      "precio","valor","cuesta","promocion","oferta","tarifa","costo",
      "cuanto vale","cuanto sale","precio plan","valor facial","valor corporal",
      "precio body fitness","valor face elite","cuanto cobran","precio lipo","precio hifu"
    ],
    ubicacion:[
      "ubicacion","direccion","peñalolen","donde","mapa","como llegar",
      "queda lejos","ubicacion exacta","sede","local","tienda","centro"
    ],
    horarios:[
      "horario","dias","sabado","domingo","hora","atienden el finde",
      "cuando abren","cuando cierran","atencion","a que hora"
    ],
    emocional:[
      "no me gusta","me siento","no bajo","me cuesta","verguenza","triste",
      "insegura","sin confianza","no logro resultados","no me resulta","no puedo bajar"
    ],
    humano:[
      "hablar con alguien","persona","asesor","whatsapp","telefono","humano",
      "llamar","quiero hablar","necesito contacto"
    ],
    intencion:[
      "quiero agendar","reservar","cita","agenda","evaluacion","turno","hora",
      "agendar hora","agenda gratis","sacar hora","quiero ir","me interesa reservar"
    ]
  },

  // --- Alias extendidos ---
  alias:{
    rostro:[
      "cara","papada","frente","menton","mejillas","ojeras","cuello","rostro",
      "facial","expresion","piel","arrugas","lineas","flacidez facial","cutis"
    ],
    abdomen:[
      "abdomen","guata","vientre","barriga","panza","cintura","estomago",
      "abdomen bajo","abdomen alto","rollitos","pancita","michelines"
    ],
    gluteos:[
      "gluteos","cola","pompis","poto","trasero","nalgas","traserito",
      "muslos","piernas","caderas"
    ],
    flancos:[
      "flancos","costados","laterales","rollitos","llantitas","cintura baja"
    ],
    brazos:[
      "brazos","brazo","triceps","flacidez en brazos","piel suelta brazos"
    ],
    depilacion:[
      "depilacion","depilar","vello","pelos","cera","laser","sin vellos","axilas","piernas","bikini"
    ]
  },

  // --- Problemas extendidos ---
  problemas:{
    rostro:{
      arrugas:["Face Elite","Face Antiage"],
      flacidez:["Face Antiage","Face Inicia"],
      manchas:["Face Light","Face Smart"],
      acne:["BE Antiacné Pro","Face Light"],
      envejecimiento:["Face Elite","Face Antiage"],
      lineas:["Face Elite","Face Antiage"],
      poros:["Face Smart","Face Light"],
      textura:["Face Smart","Face Light"]
    },
    abdomen:{
      grasa:["Lipo Body Elite","Lipo Express"],
      flacidez:["Body Tensor","Lipo Reductiva"],
      celulitis:["Lipo Reductiva","Lipo Focalizada Reductiva"],
      tonificar:["Body Fitness","Lipo Express"],
      marcar:["Body Fitness","Lipo Express"],
      tensar:["Body Tensor","Lipo Reductiva"],
      adelgazar:["Lipo Express","Lipo Reductiva"],
      volumen:["Lipo Express","Lipo Body Elite"]
    },
    gluteos:{
      flacidez:["Push Up","Body Tensor"],
      tonificar:["Push Up","Body Fitness"],
      levantar:["Push Up","Body Fitness"],
      aumentar:["Push Up","Body Fitness"],
      reafirmar:["Push Up","Body Tensor"],
      muslos:["Lipo Focalizada Reductiva","Body Tensor"]
    },
    flancos:{
      grasa:["Lipo Body Elite","Lipo Express"],
      tonificar:["Body Fitness","Lipo Express"]
    },
    brazos:{
      flacidez:["Body Tensor","Body Fitness"],
      tonificar:["Body Fitness","Body Tensor"]
    },
    depilacion:{
      vello:["Depilación Láser Diodo","Depilación Facial Láser"],
      piernas:["Depilación Láser Piernas","Depilación Corporal Completa"],
      axilas:["Depilación Axilas","Depilación Corporal Completa"],
      bikini:["Depilación Bikini","Depilación Completa"]
    }
  },

  // --- Planes oficiales ---
  planes:{
    "Face Light":"Limpieza facial LED + bioestimulación dérmica + Pink Glow. Ideal para acné leve y manchas. Valor $128.800",
    "Face Smart":"HIFU 12D facial + RF + Pink Glow. Aumenta firmeza y luminosidad. Valor $198.400",
    "Face Inicia":"HIFU 12D + RF + Pink Glow. Corrige flacidez y redefine contornos. Valor $270.400",
    "Face Antiage":"HIFU 12D + Toxina + RF. Rejuvenece y atenúa arrugas profundas. Valor $281.600",
    "Face Elite":"HIFU 12D + RF + Toxina + Pink Glow. Lifting sin cirugía. Valor $358.400",
    "Full Face":"HIFU 12D + Toxina + Pink Glow + RF en todo rostro y cuello. Valor $584.000",
    "BE Antiacné Pro":"Luz azul + antibacterianos + regeneradores tisulares. Valor $329.000",
    "Body Tensor":"Radiofrecuencia corporal reafirmante. Valor $232.000",
    "Body Fitness":"EMS Sculptor (20 000 contracciones / 30 min). Valor $360.000",
    "Push Up":"Prosculpt + RF para glúteos firmes. Valor $376.000",
    "Lipo Focalizada Reductiva":"Cavitación + HIFU 12D + RF. Valor $348.800",
    "Lipo Express":"HIFU 12D + Prosculpt + RF reductora. Valor $432.000",
    "Lipo Reductiva":"HIFU 12D + Lipoláser + Prosculpt + RF. Valor $480.000",
    "Lipo Body Elite":"HIFU 12D + Cavitación + RF + Prosculpt avanzado. Valor $664.000",
    "Depilación Láser Diodo":"Luz diodo de última generación. Sin dolor, resultados progresivos. Valor desde $50.000",
    "Depilación Facial Láser":"Depilación láser suave para rostro y cuello. Valor $60.000",
    "Depilación Corporal Completa":"Piernas, axilas, bikini y brazos. Valor $190.000",
    "Depilación Axilas":"Depilación láser axilas. Valor $45.000",
    "Depilación Bikini":"Depilación láser zona íntima. Valor $60.000"
  }
};
export default datos;

