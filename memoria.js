import fs from "fs";
import { obtenerRespuesta } from "./inteligencia.js";

const contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export async function procesarMensaje(texto, anterior, nombre) {
  try {
    const respuesta = await obtenerRespuesta(texto, contexto, anterior, nombre);
    return respuesta || "";
  } catch (err) {
    console.error("Error en procesarMensaje:", err);
    return "";
  }
}
