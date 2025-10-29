import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
const LOGS_FILE = path.join(__dirname, "logs_wsp.json");

// --- CLICK EN LINK (AMARILLO) ---
app.post("/api/reservo-click", (req, res) => {
  try {
    const { telefono } = req.body;
    if (!telefono) return res.status(400).json({ error: "Falta teléfono" });

    const logs = fs.existsSync(LOGS_FILE)
      ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"))
      : [];
    const idx = logs.findIndex(l => l.from && l.from.includes(telefono));
    if (idx !== -1) {
      logs[idx].status = "amarillo";
      logs[idx].fecha_click = new Date().toISOString();
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
      return res.json({ status: "click detectado" });
    }
    res.json({ status: "no encontrado" });
  } catch (err) {
    console.error("Error en /api/reservo-click:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// --- CONFIRMACIÓN RESERVA (VERDE) ---
app.post("/api/reservo", (req, res) => {
  try {
    const { telefono, nombre, fecha, servicio } = req.body;
    if (!telefono) return res.status(400).json({ error: "Falta teléfono" });

    const logs = fs.existsSync(LOGS_FILE)
      ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"))
      : [];
    const idx = logs.findIndex(l => l.from && l.from.includes(telefono));
    if (idx !== -1) {
      logs[idx].status = "verde";
      logs[idx].reserva = { nombre, fecha, servicio };
    } else {
      logs.unshift({
        from: telefono,
        status: "verde",
        reserva: { nombre, fecha, servicio },
        fecha: new Date().toISOString(),
      });
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 400), null, 2));
    res.json({ status: "reserva confirmada" });
  } catch (err) {
    console.error("Error en /api/reservo:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// --- EXPORTACIÓN ---
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log("✅ Monitor eventos (click/reserva) activo en puerto", PORT)
);
app.post("/webhook", async (req, res) => {
  const { telefono } = req.body;
  if (telefono) {
    try {
      await fetch("https://zara-monitor-2-1.onrender.com/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono })
      });
      console.log("Reserva confirmada y enviada al monitor:", telefono);
    } catch (e) {
      console.error("Error al enviar confirmación al monitor:", e);
    }
  }
  res.status(200).json({ status: "ok" });
});
