import readline from "readline";
import { responderZara } from "./core/zara_core.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "Tú: " });
console.log("💬 Chat de prueba Zara 2.0 IA (escribe 'salir' para terminar)\n");
rl.prompt();

rl.on("line", (input) => {
  if (input.toLowerCase().trim() === "salir") { rl.close(); return; }
  const respuesta = responderZara(input, "WSP");
  console.log("Zara:", respuesta, "\n");
  rl.prompt();
});
