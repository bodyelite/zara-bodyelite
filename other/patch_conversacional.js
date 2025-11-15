import fs from "fs";

let file = fs.readFileSync("motor_respuesta.js", "utf8");

// reemplaza todo el bloque responderExtendido
file = file.replace(
/export function responderExtendido[\s\S]*$/,
`export function responderExtendido(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // 1. Módulos especializados
  const emp = responderEmpatico(textoUsuario);
  if (emp) return emp + "\\n📅 ¿Quieres que te agende una evaluación gratuita para orientarte mejor? " + datos.info.agendar;

  const obj = responderObjecion(textoUsuario);
  if (obj) return obj + "\\n💬 Puedo ofrecerte una evaluación sin costo para mostrarte resultados reales. Agenda aquí 👉 " + datos.info.agendar;

  const cur = responderCurioso(textoUsuario);
  if (cur) {
    // Respuesta con seguimiento natural
    if (t.includes("botox") || t.includes("toxina") || t.includes("relleno"))
      return cur + "\\n💉 Podemos evaluar rostro o cuello según tu objetivo. ¿Te gustaría agendar una valoración gratuita para ver dosis y zonas? 👉 " + datos.info.agendar;
    if (t.includes("exosoma") || t.includes("plasma") || t.includes("pink"))
      return cur + "\\n✨ Son procedimientos regenerativos que se aplican en consulta. Puedo reservarte una evaluación sin costo. 👉 " + datos.info.agendar;
    if (t.includes("certificado") || t.includes("médico") || t.includes("doctor"))
      return cur + "\\n⚕️ Si deseas, puedo agendarte una evaluación con nuestro equipo clínico. 👉 " + datos.info.agendar;
    return cur + "\\n📅 ¿Te gustaría que te ayude a agendar tu evaluación gratuita para personalizar tu tratamiento? 👉 " + datos.info.agendar;
  }

  // 2. Si no hubo coincidencia directa, revisa la intención general
  if (t.includes("grasa") || t.includes("abdomen") || t.includes("gluteo") || t.includes("pierna"))
    return "💪 Puedo ayudarte con planes reductivos y tonificantes como Lipo Reductiva o Body Fitness. Incluyen HIFU 12D, RF y EMS Sculptor.\\n📅 Agenda tu evaluación gratuita aquí 👉 " + datos.info.agendar;

  if (t.includes("rostro") || t.includes("arruga") || t.includes("flacidez") || t.includes("papada"))
    return "🌸 Para rejuvenecimiento facial tenemos Face Elite y Face Antiage, con HIFU + Toxina + Pink Glow. Resultados visibles sin cirugía.\\n📅 Agenda tu diagnóstico gratuito aquí 👉 " + datos.info.agendar;

  // 3. Respuesta base
  const base = responder(textoUsuario);
  if (!base.includes("Soy Zara IA de Body Elite")) {
    // refuerzo conversacional
    return base + "\\n💬 Si deseas, puedo coordinar una evaluación sin costo para definir tu plan ideal. 👉 " + datos.info.agendar;
  }

  // 4. Fallback amable
  return "🤔 No logré entender del todo tu pregunta, pero puedo ayudarte a definirlo en tu evaluación gratuita.\\n📅 Agenda aquí 👉 " + datos.info.agendar;
}`
);

fs.writeFileSync("motor_respuesta.js", file);
