import fs from "fs";

// === CARGA DE BASES ===
let baseConocimiento = {};
try {
  baseConocimiento = JSON.parse(
    fs.readFileSync("./base_conocimiento.json", "utf8")
  );
} catch {
  console.log("⚠️ No se encontró base_conocimiento.json, usando fallback local");
}

// === RESPUESTAS ===
export const responses = {
  saludo: () =>
    "👋 ¡Hola! Soy *Zara*, asistente IA de *Body Elite Estética Avanzada*. Puedo ayudarte con tratamientos, precios o agendar tu evaluación gratuita. ¿Qué te gustaría revisar hoy?",

  grasa: () =>
    "💎 *Lipo Body Elite* combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para moldear abdomen, cintura y muslos. Los resultados se notan desde la 2ª sesión. ¿Quieres que te recomiende el plan ideal según tus objetivos?",

  celulitis: () =>
    "✨ Para celulitis trabajamos con *Lipo Reductiva 12D* y *Body Fitness Pro*, que mejoran la textura de la piel y tonifican con EMS + Radiofrecuencia. ¿Prefieres saber precios o agendar evaluación gratuita?",

  flacidez: () =>
    "💠 Para flacidez recomendamos *Body Tensor* o *ProSculpt RF*, que estimulan colágeno y firmeza muscular sin bisturí. ¿Quieres que te explique cómo funcionan o sus valores?",

  push_up: () =>
    "🍑 *Push Up Body Elite* trabaja glúteos con *ProSculpt EMS + Radiofrecuencia Focalizada*. Tonifica y eleva sin dolor ni bisturí, con resultados visibles desde la 2ª sesión. ¿Te gustaría agendar una evaluación gratuita?",

  hifu: () =>
    "🔹 *HIFU 12D* es una tecnología de ultrasonido focalizado que actúa sobre las capas profundas de la piel y grasa localizada. Se usa para rostro o cuerpo y ayuda a tensar y redefinir contornos. ¿Quieres que te recomiende dónde aplicarlo según tu caso?",

  precios: () =>
    "📋 *Planes más solicitados:*\n" +
    "💎 Lipo Body Elite $664.000\n" +
    "🌸 Face Elite $358.400\n" +
    "💪 Body Fitness $360.000\n" +
    "🍑 Push Up $376.000\n" +
    "¿Deseas que te recomiende el ideal según tus objetivos?",

  agenda: () =>
    "📅 Puedes agendar tu evaluación gratuita aquí:\n" +
    "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n" +
    "🕒 Horarios: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00\n" +
    "¿Quieres que te deje un cupo esta semana?",

  evaluacion: () =>
    "🧬 La evaluación incluye diagnóstico corporal con análisis FitDays y asesoría personalizada para definir tu plan ideal. Es sin costo ni compromiso. ¿Quieres agendarla ahora?",

  tratamiento: () =>
    "💆‍♀️ Contamos con tratamientos corporales y faciales no invasivos: Lipo, Body Fitness, Push Up, HIFU, y más. Todos combinan tecnología avanzada y protocolos personalizados. ¿Qué zona te gustaría tratar?",

  otro: () =>
    "🤔 No estoy segura de lo que quisiste decir, pero puedo ayudarte con *tratamientos, precios, tecnologías* o *agendamiento*. ¿Qué te gustaría saber?",

  fallback: () =>
    "❓ No logré entenderte bien. ¿Podrías decirme si buscas información sobre tratamientos, precios o agendar tu evaluación gratuita?",
};

// === MOTOR LOCAL DE INTENCIONES ===
export function interpretarIntencion(text) {
  text = text.toLowerCase();

  if (/hola|buenas|hi|holi/.test(text)) return "saludo";
  if (/grasa|abdomen|bajar|reducir|vientre|cintura/.test(text)) return "grasa";
  if (/celulitis|piel de naranja/.test(text)) return "celulitis";
  if (/flacidez|firmeza|colageno/.test(text)) return "flacidez";
  if (/push ?up|gluteo|trasero/.test(text)) return "push_up";
  if (/hifu/.test(text)) return "hifu";
  if (/precio|vale|cuesta|valor|oferta/.test(text)) return "precios";
  if (/agenda|reservar|hora|cita|agendar/.test(text)) return "agenda";
  if (/evaluaci|diagnostico/.test(text)) return "evaluacion";
  if (/tratamiento|sesion|tecnolog/.test(text)) return "tratamiento";
  return "fallback";
}
