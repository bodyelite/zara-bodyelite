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

  // --- MODO EMPÁTICO GENERAL ---
  const respuestasEmpaticas = [
    { palabras: ["grasa", "abdomen", "muslos", "piernas", "brazos", "poto", "glúteos"], 
      respuesta: `💛 Entiendo, muchas personas también notan esa acumulación en esas zonas y suele deberse a grasa localizada que cuesta eliminar solo con ejercicio.  
✨ En esos casos trabajamos con tecnologías como *HIFU 12D, Cavitación y Radiofrecuencia*, que reducen volumen y tensan la piel sin dolor.  
Si me comentas tu objetivo (reducir, tonificar o definir), puedo orientarte con el plan corporal más indicado.` },
    { palabras: ["cara", "rostro", "papada", "facial"], 
      respuesta: `💆‍♀️ La zona del rostro responde muy bien a tratamientos como *HIFU 12D, Radiofrecuencia y Pink Glow*, que estimulan colágeno y mejoran la firmeza sin cirugía.  
Puedo ayudarte a identificar si te conviene un *Face Smart* o un *Face Elite* según tu objetivo (luminosidad, lifting o antiage).` },
    { palabras: ["botox", "toxina", "relleno"], 
      respuesta: `💉 *Toxina Botulínica Facial* relaja los músculos responsables de las arrugas de expresión, logrando un aspecto natural y fresco.  
Se aplica en frente, entrecejo o patas de gallo, y los resultados se aprecian desde los primeros días.  
¿Quieres que te cuente cómo personalizamos el tratamiento según tus zonas de interés?` },
    { palabras: ["depil", "pelos", "axila", "pierna completa"], 
      respuesta: `💫 Nuestra *Depilación Láser Diodo con triple onda Alexandrita* elimina el vello desde la raíz sin dolor, incluso en pieles sensibles.  
Si me indicas las zonas que deseas tratar, puedo orientarte sobre la cantidad de sesiones y descuentos combinados.` }
  ];

  for (const tema of respuestasEmpaticas) {
    if (tema.palabras.some(p => texto.includes(p))) {
      memoria.guardarContexto(usuario, tema.palabras[0]);
      return `${tema.respuesta}\n\n📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
    }
  }

  // --- DOLOR Y PRECIOS ---
  if (texto.includes("duele") || texto.includes("dolor")) return conocimientos.dolor;
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) return conocimientos.precios;
  if (texto.includes("dónde están") || texto.includes("ubicación") || texto.includes("dirección")) return conocimientos.direccion;

  // --- SALUDO ---
  if (texto === "hola" || texto.startsWith("buen")) {
    memoria.guardarContexto(usuario, "inicio");
    return `✨ Soy *Zara de Body Elite*. Qué gusto saludarte.  
Cuéntame qué zona o tratamiento te gustaría mejorar, y te orientaré con total honestidad clínica.`;
  }

  // --- CONTEXTO PREVIO ---
  if (contextoPrevio && texto.includes("quiero") && texto.includes("reafirmar")) {
    return `✨ Perfecto. Para reafirmar piel en zonas difíciles trabajamos con *Body Tensor* (HIFU + RF tensora).  
Ideal postparto o pérdida de peso. Valor desde $232.000.`;
  }

  // --- FALLBACK EMPÁTICO ---
  return `💛 Disculpa, no logré entender tu pregunta, pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.  
Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}
