// entrenador.js
// Entrenador y gestor de memoria contextual de Zara IA

import fs from "fs";
import path from "path";
import { clasificarIntencion } from "./comprension.js";
import { analizarSemantica } from "./contextoAvanzado.js";

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
    conversaciones[usuario] = { historial: [], ultimaIntencion: null, tipoPlan: null, tono: null };
  }

  const intencionBasica = clasificarIntencion(mensaje);
  const intencionSemantica = analizarSemantica(mensaje);
  const intencionFinal = intencionSemantica !== "desconocido" ? intencionSemantica : intencionBasica;

  conversaciones[usuario].historial.push({
    mensaje,
    intencion: intencionFinal,
    fecha: new Date().toISOString(),
  });

  conversaciones[usuario].ultimaIntencion = intencionFinal;

  const lower = mensaje.toLowerCase();
  if (lower.includes("facial") || lower.includes("rostro") || lower.includes("antiage")) {
    conversaciones[usuario].tipoPlan = "facial";
  } else if (lower.includes("cuerpo") || lower.includes("lipo") || lower.includes("sculptor")) {
    conversaciones[usuario].tipoPlan = "corporal";
  }

  // detección simple de tono
  if (lower.includes("no puedo") || lower.includes("error")) conversaciones[usuario].tono = "frustracion";
  else if (lower.includes("gracias") || lower.includes("excelente")) conversaciones[usuario].tono = "positivo";
  else conversaciones[usuario].tono = "neutral";

  guardarConversaciones(conversaciones);
  return conversaciones[usuario];
}
