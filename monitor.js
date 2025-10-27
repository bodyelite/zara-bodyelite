import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 10000;

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("🟢 Monitor conectado");
  const intervalo = setInterval(async () => {
    try {
      const r = await fetch("https://zara-2-1.onrender.com/logs");
      const data = await r.json();
      socket.emit("logs", data);
    } catch (err) {
      console.error("Error actualizando monitor:", err.message);
    }
  }, 3000);
  socket.on("disconnect", () => clearInterval(intervalo));
});

server.listen(PORT, () => console.log("✅ Monitor activo en puerto", PORT));
