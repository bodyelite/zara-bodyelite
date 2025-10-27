import fs from "fs";

const frases = JSON.parse(fs.readFileSync("./frases.json", "utf-8"));
const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf-8"));

export function generarRespuesta(texto, base) {
  const msg = texto.toLowerCase().trim();

  // Coincidencias directas
  if (msg.includes("abdomen") || msg.includes("flanco") || msg.includes("cintura")) {
    return "🔥 Tratamiento corporal Body Elite, ideal para abdomen y flancos. Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (msg.includes("gluteo") || msg.includes("trasero") || msg.includes("cola")) {
    return "🍑 El plan Push Up de Body Elite trabaja glúteos con HIFU 12D + EMS Sculptor. Resultados visibles desde la primera sesión 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (msg.includes("facial") || msg.includes("cara") || msg.includes("rostro")) {
    return "✨ Tratamiento facial Face Elite para lifting sin cirugía con HIFU 12D + radiofrecuencia. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Aprendizaje de frases
  for (const f of frases) {
    if (msg.includes(f.patron)) return f.respuesta;
  }

  // Coincidencias por conocimiento
  for (const c of conocimientos) {
    if (msg.includes(c.zona)) return c.mensaje;
  }

  // Por defecto
  return base;
}
