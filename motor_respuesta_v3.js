import datos from "./base_conocimiento.js";
import memoria from "./memoria.js";
const { conocimientos } = datos;

export async function procesarMensaje(usuario, mensaje) {
  const texto = mensaje.toLowerCase().trim();
  const contextoPrevio = memoria.obtenerContexto(usuario);

  // --- MODO INTERNO ---
  if (texto.startsWith("zara")) {
    const consulta = texto.replace("zara", "").trim();
    return `🧠 *MODO INTERNO – ANÁLISIS CLÍNICO Y COMERCIAL*\n${consulta}\n\n— Fin del modo interno —`;
  }

  // --- DETECCIÓN TEMÁTICA ---
  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro")) {
    memoria.guardarContexto(usuario, "facial");
    return `${conocimientos.faciales}\n\n✨ Si deseas, puedo contarte qué plan facial se ajusta mejor a ti según tu objetivo (luminosidad, antiage o lifting).`;
  }

  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("piernas") || texto.includes("muslos") || texto.includes("glúteos") || texto.includes("flacidez") || texto.includes("celulitis")) {
    memoria.guardarContexto(usuario, "corporal");
    return `${conocimientos.corporales}\n\n💡 Si me comentas tu objetivo (reducir, tonificar o definir), puedo orientarte con precisión clínica.`;
  }

  if (texto.includes("depil") || texto.includes("axila") || texto.includes("pierna completa") || texto.includes("pelos")) {
    memoria.guardarContexto(usuario, "depilacion");
    return `${conocimientos.depilacion}\n\n💬 ¿Quieres saber cuántas sesiones se recomiendan o las zonas combinables?`;
  }

  if (texto.includes("botox") || texto.includes("toxina") || texto.includes("relleno")) {
    memoria.guardarContexto(usuario, "toxina");
    return `💉 *Toxina botulínica facial* relaja los músculos responsables de las arrugas de expresión y deja un aspecto natural y fresco.  
Se aplica en frente, patas de gallo y entrecejo.  
💰 Valor según zona desde $95.000.\nAgenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  if (texto.includes("duele") || texto.includes("dolor")) return conocimientos.dolor;
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) return conocimientos.precios;
  if (texto.includes("dónde están") || texto.includes("ubicación") || texto.includes("dirección")) return conocimientos.direccion;

  if (texto === "hola" || texto.startsWith("buen")) {
    memoria.guardarContexto(usuario, "inicio");
    return conocimientos.saludo;
  }

  // --- CONTEXTO PREVIO ---
  if (contextoPrevio === "facial" && texto.includes("arrugas")) {
    return `✨ Para arrugas y pérdida de firmeza facial te recomiendo *Face Elite* o *Face Antiage*.  
Ambos usan HIFU 12D y Toxina para lifting no invasivo.  
💰 Desde $281.600. Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
  }

  if (contextoPrevio === "corporal" && texto.includes("definir")) {
    return `💪 Si tu objetivo es tonificar o marcar, el plan indicado es *Body Fitness* con *EMS Sculptor* + *Radiofrecuencia*.  
Genera 20.000 contracciones en 30 min.  
Valor desde $360.000.`;
  }

  if (contextoPrevio === "corporal" && texto.includes("reafirmar")) {
    return `✨ Para reafirmar piel en zonas difíciles te recomiendo *Body Tensor* (HIFU + RF tensora).  
Ideal postparto o pérdida de peso. Valor $232.000.`;
  }

  if (contextoPrevio === "depilacion" && texto.includes("sesiones")) {
    return `🕓 En promedio se requieren 6–8 sesiones por zona para eliminar el vello con efectividad clínica.  
Contamos con paquetes con descuento por combinación de áreas.`;
  }

  // --- FALLBACK EMPÁTICO ---
  return conocimientos.fallback;
}
