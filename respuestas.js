import fs from "fs";

const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf-8"));
const alias = conocimientos.alias_zonas || {};
const planes = conocimientos.planes || {};
const zonas = conocimientos.problema_zona || {};

export function generarRespuesta(texto, base) {
  const msg = texto.toLowerCase().trim();

  // --- Buscar zona o alias ---
  let zona = Object.keys(zonas).find(z => msg.includes(z));
  if (!zona) {
    for (const [aliasTerm, zonaReal] of Object.entries(alias)) {
      if (msg.includes(aliasTerm)) {
        zona = zonaReal;
        break;
      }
    }
  }

  // --- Si se identificó zona ---
  if (zona && zonas[zona]) {
    const problemas = zonas[zona];
    for (const [clave, planesRelacionados] of Object.entries(problemas)) {
      if (msg.includes(clave)) {
        const plan = planes[planesRelacionados[0]];
        if (plan) {
          return `💡 ${plan.descripcion}\n💰 ${plan.precio}\n📅 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
        }
      }
    }
  }

  // --- Coincidencias generales ---
  if (msg.includes("hola") || msg.includes("buenas")) {
    return "👋 Hola, soy Zara IA de Body Elite. Cuéntame qué zona te gustaría mejorar y te recomendaré el plan ideal.";
  }
  if (msg.includes("precio") || msg.includes("valor")) {
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito asistido con IA.";
  }
  if (msg.includes("ubicacion") || msg.includes("direccion") || msg.includes("peñalolén")) {
    return "📍 Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Lunes a Viernes 9:30–20:00 | Sábado 9:30–13:00";
  }

  // --- Por defecto ---
  return base;
}
