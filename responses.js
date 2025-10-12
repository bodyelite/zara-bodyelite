// responses.js — versión completa con manejo seguro de msg + IA + agendamiento

export function getResponse(intent, msg) {
  msg = (msg && msg.toString().toLowerCase()) || "";

  // --- PLANES FACIALES ---
  if (/face elite/.test(msg) || /facial/.test(msg) || /rostro/.test(msg)) {
    return `✨ Face Elite combina HIFU focal, Radiofrecuencia y toxina cosmética para rejuvenecer sin cirugía. 
💰 Valor: $358.400 CLP (6 sesiones)
📊 Incluye evaluación y seguimiento con IA para ajustar cada sesión según tus resultados. 
¿Quieres agendar tu diagnóstico facial gratuito con nuestro sistema IA?`;
  }

  if (/pinkglow|glow/.test(msg)) {
    return `🌸 PinkGlow ilumina, hidrata y mejora el tono de la piel. 
Puede usarse solo o junto a Face Elite para potenciar resultados. 
💰 Valor: $128.800 CLP (plan facial completo, 6 sesiones)
📊 Incluye diagnóstico facial con IA para adaptar la hidratación y resultados. 
¿Quieres agendar tu evaluación sin costo?`;
  }

  // --- PLANES CORPORALES ---
  if (/abdomen|guatita|panz|barriga|estómago/.test(msg)) {
    return `🔥 Para la guatita o abdomen recomiendo Lipo Reductiva 12D o Body Fitness. 
Ayudan a reducir grasa y reafirmar el área. 
💰 Lipo Reductiva 12D: $480.000 CLP
💰 Body Fitness: $360.000 CLP
📊 Incluyen evaluación corporal con IA para ajustar parámetros y lograr resultados más rápidos.`;
  }

  if (/gluteo|glúteo|gluteos|glúteos|cola|pompa/.test(msg)) {
    return `🍑 Tonifica y eleva glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. 
Resultados visibles desde la 2ª sesión. 
💰 $376.000 CLP (6 sesiones)
📊 Nuestra IA analiza tu progreso y ajusta intensidad en cada sesión.`;
  }

  if (/papada/.test(msg)) {
    return `💎 Para la papada recomendamos Lipo Focalizada o HIFU facial. 
Disuelve grasa localizada y redefine contorno facial. 
💰 Desde $348.800 CLP
📊 Incluye control IA para asegurar simetría y firmeza.`;
  }

  // --- COMPONENTES TECNOLÓGICOS ---
  if (/exosoma|exosomas/.test(msg)) {
    return `🧬 Los Exosomas son nanopartículas regeneradoras que reparan tejidos y estimulan colágeno. 
En Body Elite se aplican con Dermapen para bioestimulación avanzada y rejuvenecimiento visible.`;
  }

  if (/lipolitico|lipolítico|lipoliticos|lipolíticos/.test(msg)) {
    return `🔥 Los Lipolíticos son principios activos que disuelven grasa localizada. 
Se aplican en zonas específicas (abdomen, brazos, muslos o papada) y potencian tratamientos como Cavitación o HIFU.`;
  }

  if (/radiofrecuencia|rf/.test(msg)) {
    return `🌐 La Radiofrecuencia estimula colágeno y elastina mediante calor controlado. 
Mejora la firmeza, reduce flacidez y complementa tratamientos como Face Elite o Body Fitness.`;
  }

  // --- AGENDAMIENTO / CONTACTO ---
  if (/agenda|reservar|cita|hora|evaluacion|evaluación|diagnostico|diagnóstico/.test(msg)) {
    return `📅 Puedes agendar tu evaluación gratuita con IA en el siguiente enlace:
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9
O si prefieres hablar con un profesional, escribe al WhatsApp directo: +56 9 8330 0262.`;
  }

  if (/hablar|humano|asesor|persona/.test(msg)) {
    return `👩‍💼 Te puedo derivar con una profesional. 
Envía tu nombre, zona que deseas trabajar y te contacto enseguida al WhatsApp: +56 9 8330 0262.`;
  }

  // --- CONSULTAS GENERALES ---
  if (/como estas|hola|buenas|hi|saludo/.test(msg)) {
    return `✨ ¡Hola! Estoy muy bien y feliz de acompañarte. 
En Body Elite creemos que cada paso que das para cuidarte te acerca a tu mejor versión. 
¿Quieres que te guíe con una evaluación gratuita asistida por IA?`;
  }

  if (/gracias|ok|dale|perfecto|super|bacan|bien/.test(msg)) {
    return `💫 Me alegra mucho. 
¿Quieres que te ayude a agendar tu diagnóstico gratuito con IA para personalizar tu plan?`;
  }

  if (/cuanto vale|valor|precio|cuesta|vale/.test(msg)) {
    return `💰 Los valores varían según el plan: 
- Lipo Body Elite $664.000  
- Face Elite $358.400  
- Body Fitness $360.000  
- Push Up $376.000  
- PinkGlow $128.800  
📊 Incluyen diagnóstico y seguimiento con inteligencia artificial. 
¿Quieres que te recomiende el ideal según tus objetivos?`;
  }

  // --- FALLBACK ---
  return `🤔 No logré entenderte bien. 
Cuéntame si quieres trabajar papada, guatita, potito o rostro y te recomendaré el plan ideal ✨`;
}
