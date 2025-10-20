const intents = [
  {
    "tag": "saludo",
    "patterns": [
      "hola",
      "buenas",
      "hey",
      "holaa",
      "holis",
      "buen día",
      "buenas tardes"
    ],
    "response": "saludo"
  },
  {
    "tag": "facial",
    "patterns": [],
    "response": "facial"
  },
  {
    "tag": "corporal",
    "patterns": [],
    "response": "lipo"
  },
  {
    "tag": "flacidez",
    "patterns": [],
    "response": "flacidez"
  },
  {
    "tag": "lipo",
    "patterns": [],
    "response": "lipo"
  },
  {
    "tag": "sesiones",
    "patterns": [
      "sesión",
      "sesiones",
      "cuántas",
      "duración",
      "cuanto dura"
    ],
    "response": "sesiones"
  },
  {
    "tag": "agendar",
    "patterns": [
      "agendar",
      "reserva",
      "agenda",
      "evaluación",
      "cita",
      "hora"
    ],
    "response": "agendar"
  }
]\nexport default intents;