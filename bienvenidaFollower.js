import fs from "fs";
import { registrarEvento } from "./monitorChat.js";

const LOG_FILE = "./logs_ig.json";
const RESERVO_FILE = "./reservo_status.json";

export function nuevoSeguidor(usuario) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));

  const nuevo = !logs.some(l => l.usuario === usuario);
  const mensaje =
    "🌸 ¡Hola! Soy Zara IA de Body Elite. Gracias por seguirnos 💙.\n" +
    "Estoy aquí para ayudarte a descubrir tu mejor versión con tecnología estética avanzada.\n" +
    "📅 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  if (nuevo) {
    logs.push({ usuario, mensaje: "Nuevo seguidor", respuesta: mensaje, timestamp: Date.now() });
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

    // Estado azul en monitor
    let estados = {};
    if (fs.existsSync(RESERVO_FILE)) estados = JSON.parse(fs.readFileSync(RESERVO_FILE, "utf8"));
    estados[usuario] = { estado: "nuevo" };
    fs.writeFileSync(RESERVO_FILE, JSON.stringify(estados, null, 2));

    registrarEvento("IG", usuario, "Nuevo seguidor confirmado", mensaje);
    console.log(`🟦 Bienvenida enviada a ${usuario}`);
  } else {
    console.log(`ℹ️ ${usuario} ya existe en los registros.`);
  }

  return mensaje;
}
