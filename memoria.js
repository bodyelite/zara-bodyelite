import fs from "fs";

// Carga del contexto de memoria
let contexto = [];
try {
  const rawData = fs.readFileSync("./contexto_memoria.json", "utf8");
  contexto = JSON.parse(rawData);
  console.log(`✅ Memoria cargada correctamente (${contexto.length} patrones)`);
} catch (err) {
  console.error("❌ Error cargando contexto_memoria.json:", err.message);
}

// Procesamiento principal del mensaje
export async function procesarMensaje(texto, anterior, nombre) {
  try {
    if (!texto || typeof texto !== "string") return "";

    const normalizado = texto.toLowerCase().trim();

    // Buscar coincidencia inclusiva en los patrones
    const coincidencia = contexto.find(item =>
      item.patrones.some(p => normalizado.includes(p.toLowerCase()))
    );

    if (coincidencia) {
      return coincidencia.respuesta;
    }

    // Sin coincidencia clara → respuesta genérica
    return "No logré entenderte bien, pero nuestras profesionales podrán orientarte en una evaluación gratuita asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  } catch (err) {
    console.error("Error en procesarMensaje:", err);
    return "";
  }
}
