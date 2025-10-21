import fs from "fs";

export default function procesarMensaje(texto, anterior) {
  const memoriaPath = "./contexto_memoria.json";
  let memoria = [];

  if (fs.existsSync(memoriaPath)) {
    try {
      memoria = JSON.parse(fs.readFileSync(memoriaPath, "utf8"));
    } catch (e) {
      console.error("⚠️ Error al leer contexto_memoria.json:", e);
    }
  }

  texto = texto.toLowerCase();

  for (const item of memoria) {
    for (const patron of item.patrones) {
      if (texto.includes(patron)) {
        return item.respuesta;
      }
    }
  }

  // Si el mensaje se relaciona con el anterior, mantener contexto simple
  if (anterior && texto.includes("vale") && anterior.includes("pink glow")) {
    return "💗 El tratamiento Pink Glow tiene un valor aproximado de $120.000 dependiendo de la zona y el protocolo. Incluye diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return "";
}
