// conversations.js
// Registro local + memoria conversacional de corto plazo para Zara IA

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { clasificarIntencion } from "./intents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "logs");
const logFile = path.join(logsDir, "conversaciones.log");

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Memoria conversacional en RAM (por número de usuario)
const contextoUsuarios = {};

// ------------------------------
// Actualizar y obtener contexto
// ------------------------------
export function actualizarContexto(usuario, texto) {
  const intencion = clasificarIntencion(texto);
  const fecha = new Date().toISOString();

  // Guardar contexto actual
  contextoUsuarios[usuario] = {
    ultimoTexto: texto,
    ultimaIntencion: intencion,
    ultimaCampaña: detectarCampañaLocal(texto),
    actualizado: fecha,
  };

  return contextoUsuarios[usuario];
}

// Detección básica para recordar campañas en contexto
function detectarCampañaLocal(t) {
  const text = t.toLowerCase();
  if (text.includes("push up") || text.includes("gluteo")) return "Push Up";
  if (text.includes("lipo")) return "Lipo";
  if (text.includes("hifu")) return "HIFU";
  if (text.includes("face") || text.includes("facial")) return "Face Elite";
  if (text.includes("acne") || text.includes("antiacne")) return "Face Antiacné";
  if (text.includes("depilacion")) return "Depilación Láser";
  return null;
}

// ------------------------------
// Registrar conversación en log
// ------------------------------
export function registrarConversacion(usuario, texto, respuesta) {
  const fecha = new Date().toISOString();
  const registro = `
[${fecha}]
Usuario: ${usuario}
Mensaje: ${texto}
Respuesta: ${respuesta}
---------------------------------------------\n`;
  fs.appendFileSync(logFile, registro, "utf8");
}

export function obtenerContexto(usuario) {
  return contextoUsuarios[usuario] || null;
}

export default {
  registrarConversacion,
  actualizarContexto,
  obtenerContexto,
};
