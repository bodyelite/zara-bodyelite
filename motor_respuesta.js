import fs from "fs";

let contextoUltimo = null;

export function procesarMensaje(usuario, texto) {
  const lower = texto.toLowerCase();

  // Base de precios simplificada
  const precios = {
    "pink glow": "$198.400 (parte de Face Smart, Face Inicia y Face Elite)",
    "toxina": "$281.600 (en Face Antiage y Full Face)",
    "exosoma": "$270.400 (según protocolo regenerativo)",
    "rf": "$60.000 (Radiofrecuencia facial)",
    "lipo": "$348.800 a $664.000 según plan",
    "face": "$120.000 a $584.000 según plan"
  };

  // Detectar tratamiento mencionado
  for (const clave of Object.keys(precios)) {
    if (lower.includes(clave)) {
      contextoUltimo = clave;
      return generarRespuesta(clave);
    }
  }

  // Si pregunta por precio
  if (lower.includes("cuánto") || lower.includes("vale") || lower.includes("precio")) {
    if (contextoUltimo && precios[contextoUltimo]) {
      return `💰 El valor de ${contextoUltimo} es ${precios[contextoUltimo]}. Incluye diagnóstico gratuito con IA y profesional clínico.`;
    }
    return "💰 Los planes faciales comienzan desde $120.000 y los corporales desde $348.800. Incluyen diagnóstico gratuito con IA y profesional clínico.";
  }

  // Respuesta genérica si no se detecta contexto
  return "✨ Soy Zara de Body Elite. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.";
}

function generarRespuesta(clave) {
  switch (clave) {
    case "pink glow":
      return "💖 *Pink Glow* es un bioestimulante con péptidos y antioxidantes que mejora luminosidad y regeneración. Forma parte de *Face Smart*, *Face Inicia* y *Face Elite*. 👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "toxina":
      return "💉 Aplicamos *Toxina Botulínica (Botox)* de forma clínica y segura. Se usa en *Face Antiage*, *Face Elite* y *Full Face*. 👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "exosoma":
      return "🌿 Usamos *Exosomas*, regeneradores celulares que estimulan fibroblastos y colágeno IV. Se aplican junto a *Pink Glow* en protocolos regenerativos. 👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "rf":
      return "📡 La *Radiofrecuencia* estimula colágeno y elastina para reafirmar piel y mejorar textura. Está en *Body Tensor*, *Face Antiage* y *Face Elite*. 👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "lipo":
      return "🔥 Nuestros planes *Lipo* van desde *Lipo Focalizada Reductiva* ($348.800) hasta *Lipo Body Elite* ($664.000). Incluyen tecnologías HIFU, Cavitación y RF. 👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    default:
      return "✨ Soy Zara de Body Elite. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.";
  }
}
