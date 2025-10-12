import fs from "fs";

// Cargar base de conocimiento
let knowledge = {};
try {
  const data = fs.readFileSync("./knowledge.json", "utf8");
  knowledge = JSON.parse(data);
} catch (err) {
  console.error("Error cargando knowledge.json:", err);
  knowledge = {
    saludo: "Hola, soy Zara 💬 asistente de Body Elite.",
    fallback: "No puedo responder por ahora."
  };
}

// Normalizador de texto (minúsculas + sin tildes)
function cleanText(msg) {
  return msg
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Respuestas según intención
const responses = {
  saludo: () => knowledge.saludo,
  agendar: () => knowledge.agendar,
  precios: () => knowledge.precios,
  tratamientos: (msg) => {
    const text = cleanText(msg);

    if (text.includes("grasa") || text.includes("abdomen") || text.includes("cintura"))
      return knowledge.lipo;

    if (text.includes("flacidez") || text.includes("celulitis") || text.includes("reafirmar") || text.includes("piel"))
      return knowledge.body_tens;

    if (text.includes("musculo") || text.includes("tonificar") || text.includes("gluteo"))
      return knowledge.body_fit;

    if (text.includes("cara") || text.includes("rostro") || text.includes("facial"))
      return knowledge.face;

    return knowledge.tratamientos;
  },
  tecnologias: () => knowledge.tecnologias,
  derivar: () => knowledge.derivar,
  fallback: () => knowledge.fallback
};

export default responses;
