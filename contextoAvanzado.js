// contextoAvanzado.js
// Motor de comprensión semántica avanzada para Zara IA (local, sin conexión externa)

import { limpiarTexto, normalizar } from "./comprension.js";

const patrones = [
  { palabras: ["no puedo", "no funciona", "error", "ayuda"], intencion: "problema" },
  { palabras: ["agendar", "agenda", "reserva", "reservar"], intencion: "agendar" },
  { palabras: ["precio", "cuesta", "valor"], intencion: "precio" },
  { palabras: ["promocion", "oferta", "descuento"], intencion: "promocion" },
  { palabras: ["tratamiento", "servicio", "procedimiento"], intencion: "tratamientos" },
  { palabras: ["facial", "rostro", "cara", "antiage"], intencion: "facial" },
  { palabras: ["cuerpo", "corporal", "gluteos", "abdomen"], intencion: "corporal" },
  { palabras: ["hola", "buenas", "saludo"], intencion: "saludo" },
  { palabras: ["gracias", "ok", "bien"], intencion: "cierre" },
  { palabras: ["no se", "no entiendo", "explica"], intencion: "duda" },
];

export function analizarSemantica(texto) {
  const limpio = limpiarTexto(texto);
  const normal = normalizar(limpio);

  for (const p of patrones) {
    if (p.palabras.some((w) => normal.includes(w))) {
      return p.intencion;
    }
  }

  // fallback semántico básico
  if (normal.match(/(quiero|me interesa|podria|necesito)/)) return "interes";
  if (normal.match(/(no|nunca|tampoco)/)) return "negacion";
  return "desconocido";
}
