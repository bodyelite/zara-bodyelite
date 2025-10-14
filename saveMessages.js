import fs from "fs";
import path from "path";

const logDir = path.resolve("./logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "mensajes_recibidos.json");

export function saveIncomingMessage(data) {
  try {
    const message = {
      timestamp: new Date().toISOString(),
      from: data.from || "desconocido",
      name: data.profile?.name || "",
      text: data.text?.body || "",
      id: data.id || "",
    };

    let log = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf-8");
      if (content) log = JSON.parse(content);
    }

    log.push(message);
    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error("Error guardando mensaje:", err);
  }
}
