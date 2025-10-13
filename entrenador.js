// entrenador.js
// Motor de entrenamiento y contexto conversacional de Zara IA

import fs from "fs";
import path from "path";
import { clasificarIntencion } from "./comprension.js";

const ruta = path.resolve("conversations.json");

export function cargarConversaciones() {
  try {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify({}));
    const data = fs.readFileSync(ruta, "utf8");
    return JSON.parse(data || "{}");
  } catch {
    return {};
  }
}

export function guardarConversaciones(conversaciones) {
  fs.writeFileSync(ruta, JSON.stringify(conversaciones, null, 2));
}

export function actualizarContexto(usuario, mensaje) {
  const conversaciones = cargarConversaciones();
  if (!conversaciones[usuario]) {
    conversaciones[usuario] = { historial: [], ultimaIntencion: null, tipoPlan: null };
  }

  const intencion = clasificarIntencion(mensaje);
  conversaciones[usuario].historial.push({ mensaje, intencion, fecha: new Date().toISOString() });
  conversaciones[usuario].ultimaIntencion = intencion;

  // memoria básica de tipo de plan
  const lower = mensaje.toLowerCase();
  if (lower.includes("facial") || lower.includes("rostro") || lower.includes("antiage")) {
    conversaciones[usuario].tipoPlan = "facial";
  } else if (lower.includes("cuerpo") || lower.includes("lipo") || lower.includes("sculptor")) {
    conversaciones[usuario].tipoPlan = "corporal";
  }

  guardarConversaciones(conversaciones);
  return conversaciones[usuario];
}
