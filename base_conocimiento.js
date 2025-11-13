// ======================================================
// BASE DE CONOCIMIENTO - BODY ELITE (versión local sin JSON externo)
// ======================================================

export const planes = [
  { nombre: "Lipo Focalizada Reductiva", precio: 348800 },
  { nombre: "Lipo Express", precio: 432000 },
  { nombre: "Lipo Reductiva", precio: 480000 },
  { nombre: "Lipo Body Elite", precio: 664000 },
  { nombre: "Body Tensor", precio: 232000 },
  { nombre: "Body Fitness", precio: 360000 },
  { nombre: "Push Up", precio: 376000 },
  { nombre: "Limpieza Facial Full", precio: 120000 },
  { nombre: "RF Facial", precio: 60000 },
  { nombre: "Face Light", precio: 128800 },
  { nombre: "Face Smart", precio: 198400 },
  { nombre: "Face Inicia", precio: 270400 },
  { nombre: "Face Antiage", precio: 281600 },
  { nombre: "Face Elite", precio: 358400 },
  { nombre: "Full Face", precio: 584000 }
];

// ======================================================
// RESPUESTAS CLÍNICAS Y COMERCIALES
// ======================================================

export const conocimientos = {
  saludo: `✨ Soy *Zara de Body Elite*. Qué gusto saludarte. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.`,

  fallback: `💛 Disculpa, no logré entender tu pregunta, pero estoy segura de que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.  
Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  faciales: `✨ Trabajamos tratamientos faciales como *Face Light, Face Smart, Face Elite* y *Full Face*.  
Estos planes usan tecnología *HIFU 12D, Radiofrecuencia, Pink Glow* y *LED Therapy*, que estimulan colágeno y mejoran la firmeza.  
💰 Valores desde $128.800 según el plan.  
Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  corporales: `🔥 Nuestros planes *Lipo* van desde *Lipo Focalizada Reductiva ($348.800)* hasta *Lipo Body Elite ($664.000)*.  
Incluyen tecnologías *HIFU 12D, Cavitación y Radiofrecuencia*, que reducen grasa localizada y tensan la piel sin dolor ni reposo.  
Agenda tu valoración gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  depilacion: `💫 *Depilación Láser Diodo* con tecnología *Alexandrita Triple Onda*.  
Elimina el vello desde la raíz sin dolor y es apta para todo tipo de piel.  
💰 Desde $35.000 por zona/sesión, con descuentos en planes combinados.  
Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  dolor: `🩵 Todos nuestros tratamientos son *no invasivos y sin dolor*.  
Solo puedes sentir una leve sensación térmica o contracción según la tecnología aplicada.  
Agenda tu evaluación gratuita para conocer cuál se adapta mejor a ti 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  precios: `💰 Los planes faciales comienzan desde *$120.000* y los corporales desde *$348.800*,  
incluyen diagnóstico gratuito con IA y orientación clínica personalizada.  
Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`,

  direccion: `📍 *Av. Las Perdices Nº2990, Local 23 – Peñalolén* (cerca de Av. Tobalaba).  
🕓 Horario: Lun–Vie 9:30 a 20:00 / Sáb 9:30 a 13:00  
Agenda tu cita gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`
};

// ======================================================
// EXPORTACIÓN FINAL
// ======================================================
export default { planes, conocimientos };

// --- Diccionario conversacional Zara (seguro, lectura-only) ---
export const diccionario = {
  zonas: {
    muslos: ["muslo","muslos","piernas","pierna"],
    gluteos: ["gluteo","glúteo","gluteos","glúteos","trasero","cola"],
    abdomen: ["abdomen","guata","barriga","panza","estómago"],
    papada: ["papada"],
    patas_de_gallo: ["patas de gallo","arrugas ojos"]
  },
  intents: {
    precio: ["precio","cuánto vale","cuanto vale","valor","caro","cuánto cuesta","cuanto cuesta"],
    ubicacion: ["dónde están","donde estan","dirección","direccion","horarios","ubicación"],
    consiste: ["qué es","que es","en qué consiste","en que consiste","qué incluye","que incluye"],
    resultados: ["resultados","cuando se ven","garantía","efecto"]
  },
  objetivos: {
    reducir: ["reducir","bajar","rebajar","disminuir","contorno"],
    tonificar: ["tonificar","levantar","tensar","reafirmar","firmeza"],
    antiage: ["antiage","arrugas","rejuvenecer","líneas finas"]
  }
};
