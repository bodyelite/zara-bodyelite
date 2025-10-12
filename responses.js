// responses.js — versión mejorada con lógica de IA, Body Elite y agendamiento

export function getResponse(intent, msg) {
  msg = msg.toLowerCase();

  // --- PLANES FACIALES ---
  if (/face elite|arrugas|rejuvenecer|rostro|cara|facial|toxina|radiofrecuencia/.test(msg)) {
    return `✨ Face Elite combina HIFU focal, Radiofrecuencia y Toxina cosmética para rejuvenecer rostro sin cirugía. 
Efecto lifting visible desde la primera sesión. 
💰 Valor: $358.400 CLP (plan completo 6 sesiones).
🤖 Incluye evaluación y seguimiento con IA que ajusta parámetros según tu evolución.`;
  }

  // --- PLANES CORPORALES ---
  if (/gluteo|glúteo|gluteos|push up|levantar|tonificar/.test(msg)) {
    return `🍑 El plan Push Up Body Elite trabaja glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. 
Resultados visibles desde la 2ª sesión. 
💰 Valor: $376.000 CLP (plan completo 6 sesiones). 
🤖 Nuestra IA evalúa tus progresos y ajusta intensidad para resultados más rápidos y seguros.`;
  }

  if (/abdomen|guatita|panza|barriga|reducir|grasa|cintura|lipo/.test(msg)) {
    return `🔥 Para abdomen o guatita recomendamos Lipo Reductiva 12D o Lipo Body Elite. 
Ayudan a disolver grasa localizada y reafirmar el área con Cavitación, HIFU y Radiofrecuencia.
💰 Lipo Reductiva 12D: $480.000 CLP / Lipo Body Elite: $664.000 CLP.
🤖 Incluyen diagnóstico y seguimiento IA para personalizar cada sesión.`;
  }

  if (/papada|cuello/.test(msg)) {
    return `💎 Para papada o cuello usamos HIFU 12D y principios lipolíticos focalizados. 
Redefine contorno facial y estimula colágeno desde la 1ª sesión. 
🤖 Nuestra IA analiza tus características y ajusta energía y profundidad en cada sesión.`;
  }

  // --- TRATAMIENTOS ESPECÍFICOS ---
  if (/pink ?glow|luminosidad|hidratación|hidratacion/.test(msg)) {
    return `🌸 PinkGlow ilumina, hidrata y mejora el tono de la piel. 
Puede aplicarse solo o combinarse con Face Elite para potenciar resultados. 
💰 Valor: $128.800 CLP (plan facial completo de 6 sesiones).`;
  }

  if (/exosomas/.test(msg)) {
    return `🧬 Los Exosomas son nanopartículas regeneradoras que estimulan colágeno y reparan tejidos. 
Se aplican con Dermapen para bioestimulación avanzada y rejuvenecimiento visible desde las primeras sesiones.`;
  }

  if (/lipolitic|lipolítico|lipoliticos|lipolitico/.test(msg)) {
    return `🔥 Los Lipolíticos son principios activos que ayudan a disolver grasa localizada. 
Se aplican en zonas específicas (papada, abdomen, brazos o muslos) y potencian tratamientos reductivos como Cavitación o HIFU.`;
  }

  // --- AGENDAMIENTO / EVALUACIÓN IA ---
  if (/agendar|reserva|hora|cita|agenda|evaluaci|diagnóstico|diagnostico|agenda gratis|quiero agendar|como agendo/.test(msg)) {
    return `📅 Puedes **agendar tu evaluación gratuita con IA** aquí:  
🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9  
🕒 Horarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00  

🤖 Nuestra evaluación con Inteligencia Artificial analiza tus medidas y parámetros estéticos en segundos.  
Detecta grasa, firmeza y nivel de tonicidad para crear un plan personalizado que evoluciona contigo.  

💡 A diferencia de otras clínicas, **Body Elite** integra IA y tecnología estética avanzada para asegurar resultados reales, sin adivinar.`;
  }

  // --- SALUDOS / INTRODUCCIÓN ---
  if (/hola|buenas|hi|holi|cómo estás|como estas|qué tal|que tal/.test(msg)) {
    return `✨ ¡Hola! Estoy muy feliz de acompañarte. 
En **Body Elite Estética Avanzada** usamos Inteligencia Artificial para diseñar tu plan ideal. 
¿Te gustaría conocer tratamientos, precios o agendar tu diagnóstico gratuito?`;
  }

  // --- FALLBACK GENERAL ---
  return `🤔 No estoy segura de lo que quisiste decir, pero puedo ayudarte con tratamientos, precios, tecnologías o agendamiento. 
¿Sobre qué quieres saber?`;
}
