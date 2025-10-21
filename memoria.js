import fs from "fs";

export default function procesarMensaje(texto, anterior, nombre) {
  const memoriaPath = "./contexto_memoria.json";
  let memoria = [];

  if (fs.existsSync(memoriaPath)) {
    try {
      memoria = JSON.parse(fs.readFileSync(memoriaPath, "utf8"));
    } catch (e) {
      console.error("⚠️ Error al leer contexto_memoria.json:", e);
    }
  }

  texto = texto.toLowerCase();

  // saludo inicial personalizado
  if (["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches"].some(p => texto.includes(p))) {
    const saludoNombre = nombre ? `Hola ${nombre} 🌸` : "Hola 🌸";
    return `${saludoNombre}, soy Zara, asistente IA de Body Elite. Estoy aquí para orientarte y ayudarte en tu evaluación estética ✨ ¿Qué zona de tu cuerpo te gustaría trabajar?\n\n✨ Recuerda que tu evaluación es gratuita y personalizada con IA.`;
  }

  // Buscar coincidencia en la base
  for (const item of memoria) {
    for (const patron of item.patrones) {
      if (texto.includes(patron)) {
        return item.respuesta;
      }
    }
  }

  // reglas contextuales simples
  if (anterior) {
    if (texto.includes("precio") || texto.includes("valor")) {
      if (anterior.includes("lipo") || anterior.includes("abdomen") || anterior.includes("grasa")) {
        return "💰 Los tratamientos corporales en Body Elite van desde $348.800 CLP según diagnóstico y zona trabajada. Incluyen tecnologías como HIFU 12D, Cavitación y EMS Sculptor.\n\n💬 Los valores se ajustan a tu evaluación gratuita personalizada asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      }
      if (anterior.includes("face") || anterior.includes("facial")) {
        return "💰 Los tratamientos faciales en Body Elite van desde $120.000 CLP según necesidades y tipo de piel. Incluyen Limpieza Facial, Face Light, Face Smart y Face Elite.\n\n💬 Los valores se ajustan a tu evaluación gratuita personalizada asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      }
    }
  }

  return "";
}
