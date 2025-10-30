import fs from "fs";

let contextoActual = {
  tipo: null,
  plan: null,
  timestamp: null
};

export function registrarContexto(tipo, plan) {
  contextoActual = { tipo, plan, timestamp: new Date().toISOString() };
  try {
    const logs = JSON.parse(fs.readFileSync("./logs_wsp.json", "utf8"));
    logs.push({
      tipo,
      plan,
      timestamp: contextoActual.timestamp
    });
    fs.writeFileSync("./logs_wsp.json", JSON.stringify(logs, null, 2));
  } catch {
    fs.writeFileSync("./logs_wsp.json", JSON.stringify([contextoActual], null, 2));
  }
}

export function obtenerContexto() {
  const ahora = Date.now();
  if (contextoActual.timestamp && ahora - new Date(contextoActual.timestamp).getTime() < 3600000) {
    return contextoActual;
  }
  return null;
}

export default async function procesarMensaje(texto) {
  try {
    const { responder } = await import("./motor_respuesta.js");
    const respuesta = await responder(texto);
    if (!respuesta || respuesta.trim() === "") {
      return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar para orientarte con el tratamiento ideal.";
    }
    return respuesta;
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Sistema en actualización, intenta nuevamente en unos segundos.";
  }
}
