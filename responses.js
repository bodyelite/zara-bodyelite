import fs from "fs";

// Cargar knowledge.json de forma compatible con Node 22
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

// Definición de respuestas según intención
const responses = {
  saludo: () => knowledge.saludo,
  agendar: () => knowledge.agendar,
  precios: () => knowledge.precios,
  tratamientos: (msg) => {
    if (msg.includes("lipo") || msg.includes("grasa")) return knowledge.lipo;
    if (msg.includes("face")) return knowledge.face;
    return knowledge.tratamientos;
  },
  derivar: () => knowledge.derivar,
  tecnologias: () => knowledge.tecnologias,
  fallback: () => knowledge.fallback
};

export default responses;
