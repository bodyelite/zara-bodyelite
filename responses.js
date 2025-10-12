import fs from "fs";

// Carga dinámica del conocimiento
let knowledge = {};
try {
  const data = fs.readFileSync("./knowledge.json", "utf8");
  knowledge = JSON.parse(data);
} catch (err) {
  console.error("Error cargando knowledge.json:", err);
}

// Respuestas adaptadas según intención
const responses = {
  saludo: () => knowledge.saludo,
  agendar: () => knowledge.agendar,
  precios: () => knowledge.precios,
  tratamientos: (msg) => {
    if (msg.includes("lipo") || msg.includes("grasa") || msg.includes("abdomen") || msg.includes("cintura"))
      return knowledge.lipo;
    if (msg.includes("flacidez") || msg.includes("celulitis"))
      return knowledge.body_tens;
    if (msg.includes("face") || msg.includes("facial") || msg.includes("piel"))
      return knowledge.face;
    return knowledge.tratamientos;
  },
  derivar: () => knowledge.derivar,
  tecnologias: () => knowledge.tecnologias,
  fallback: () => knowledge.fallback
};

export default responses;
