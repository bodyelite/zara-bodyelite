import fs from "fs";
import path from "path";

const logPath = path.resolve("logs_wsp.json");

// Registrar cada interacción usuario–IA
export function registrarEvento(canal, usuario, mensaje, respuesta) {
  try {
    const nuevoEvento = {
      canal,
      usuario,
      mensaje,
      respuesta,
      fecha: new Date().toISOString()
    };

    let registros = [];
    if (fs.existsSync(logPath)) {
      registros = JSON.parse(fs.readFileSync(logPath, "utf8"));
    }
    registros.push(nuevoEvento);
    fs.writeFileSync(logPath, JSON.stringify(registros, null, 2));
    console.log("📩 Evento registrado:", mensaje);
  } catch (err) {
    console.error("❌ Error registrando evento:", err);
  }
}

// Inicia el monitor de registro
export function iniciarMonitor() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "[]");
  }
  console.log("📊 Monitor de chat activo. Los registros se guardan en logs_wsp.json");
}
