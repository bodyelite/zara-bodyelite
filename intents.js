const intents = [
  {
    tag: "saludo",
    patterns: [
      "hola",
      "buen día",
      "buenas tardes",
      "buenas noches",
      "hey",
      "holis",
      "qué tal",
      "como estás",
      "buenas"
    ]
  },
  {
    tag: "facial",
    patterns: [
      "facial",
      "cara",
      "rostro",
      "piel",
      "arrugas",
      "poros",
      "manchas",
      "rejuvenecer",
      "tratamiento facial",
      "antiage",
      "face",
      "face elite",
      "face smart",
      "face inicia",
      "face light",
      "limpieza facial"
    ]
  },
  {
    tag: "corporal",
    patterns: [
      "cuerpo",
      "grasa",
      "abdomen",
      "espalda",
      "piernas",
      "brazos",
      "celulitis",
      "flacidez corporal",
      "moldear",
      "reductor",
      "lipo",
      "lipo sin cirugía",
      "cavitación",
      "radiofrecuencia",
      "ems sculptor",
      "prosculpt",
      "body elite"
    ]
  },
  {
    tag: "flacidez",
    patterns: [
      "flacidez",
      "piel suelta",
      "firmeza",
      "tonificar",
      "reafirmar",
      "colágeno",
      "elasticidad",
      "rejuvenecer piel"
    ]
  },
  {
    tag: "botox",
    patterns: [
      "botox",
      "relleno",
      "hilos",
      "toxina",
      "ácido hialurónico",
      "sin agujas"
    ]
  },
  {
    tag: "dolor",
    patterns: [
      "duele",
      "duele mucho",
      "incomodo",
      "molesta",
      "seguro",
      "postoperatorio",
      "efectos secundarios"
    ]
  },
  {
    tag: "precios",
    patterns: [
      "cuánto cuesta",
      "precio",
      "valor",
      "tarifa",
      "cuánto vale",
      "promoción",
      "oferta",
      "descuento",
      "plan"
    ]
  },
  {
    tag: "sesiones",
    patterns: [
      "cuántas sesiones",
      "sesión",
      "sesiones",
      "duración",
      "tiempo del tratamiento",
      "cuánto dura"
    ]
  },
  {
    tag: "agendar",
    patterns: [
      "agendar",
      "reserva",
      "reservar",
      "evaluación",
      "cita",
      "hora",
      "agenda",
      "quiero agendar",
      "quiero hora",
      "quiero reservar"
    ]
  },
  {
    tag: "agradecimiento",
    patterns: [
      "gracias",
      "muchas gracias",
      "te agradezco",
      "muy amable",
      "ok gracias",
      "genial gracias"
    ]
  }
];

export default intents;
