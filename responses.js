import knowledge from "./knowledge.json" assert { type: "json" };

const responses = {
  saludo: () => knowledge.saludo,
  agendar: () => knowledge.agendar,
  precios: () => knowledge.precios,
  tratamientos: (msg) => {
    if (msg.includes("lipo") || msg.includes("grasa"))
      return knowledge.lipo;
    if (msg.includes("face"))
      return knowledge.face;
    return knowledge.tratamientos;
  },
  derivar: () => knowledge.derivar,
  tecnologias: () => knowledge.tecnologias,
  fallback: () => knowledge.fallback
};

export default responses;
