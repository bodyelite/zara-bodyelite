// comprension.js
// Analiza la intención del usuario para determinar tipo de respuesta

export function analizarComprension(texto) {
  const msg = texto.toLowerCase().trim();

  if (/(hola|buenas|qué tal|como estas)/.test(msg)) return "saludo";
  if (/(lipo|abdomen|guatita|cintura|reductor|body)/.test(msg)) return "interes_corporal";
  if (/(cara|facial|rostro|botox|arrugas|antiage|radiofrecuencia|face)/.test(msg)) return "interes_facial";

  if (/(duel|dolor|molesta|duele)/.test(msg)) return "pregunta_dolor";
  if (/(cuánto dura|duración|minutos|tiempo)/.test(msg)) return "pregunta_duracion";
  if (/(resultado|cuándo se nota|efecto|efectividad)/.test(msg)) return "pregunta_resultados";
  if (/(agendar|reserva|agenda|cita|diagnóstico)/.test(msg)) return "intencion_agendar";

  if (/(máquina|tecnología|equipos|cómo funciona)/.test(msg)) return "pregunta_maquinas";
  if (/(precio|valor|costo|cuánto sale)/.test(msg)) return "pregunta_precio";

  return "general";
}
