import datos from "./base_conocimiento.js";
const planes = datos.planes;
const planes = datos.planes;
import { guardarContexto, obtenerContexto } from "./memoria.js";

/* =========================================================
   MOTOR EMPÁTICO ZARA 3.1
   Amplía subintención "consiste" y refuerza tono empático
   ========================================================= */
export function procesarMensaje(usuario, texto) {
  if (!texto) return "✨ Soy Zara de Body Elite. Cuéntame qué zona o tratamiento te gustaría mejorar.";

  const lower = texto.toLowerCase().trim();

  // --- MODO INTERNO ---
  if (lower.startsWith("zara")) {
    const contenido = lower.replace(/^zara\s*/i, "");
    return generarModoInterno(contenido);
  }

  // --- DETECCIÓN DE INTENCIÓN ---
  const categoria = detectarCategoria(lower);
  const subintencion = detectarSubintencion(lower);

  // --- MEMORIA CONTEXTUAL ---
  let contexto = obtenerContexto(usuario);
  if (categoria) {
    guardarContexto(usuario, categoria);
    contexto = categoria;
  }

  // --- RESPUESTAS EMPÁTICAS ---
  if (categoria) return generarEmpatia(contexto);
  if (subintencion && contexto) return generarDetalle(contexto, subintencion);

  // --- UBICACIÓN / HORARIO ---
  if (lower.includes("donde") || lower.includes("direccion") || lower.includes("ubicacion") || lower.includes("horario"))
    return "📍 Estamos en *Av. Las Perdices Nº2990, Local 23, Peñalolén*.\n🕒 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00.\nAgenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";

  // --- SALUDO ---
  if (["hola", "buenas", "saludos", "hey"].some(p => lower.startsWith(p)))
    return "✨ ¡Hola! Soy Zara de Body Elite. Qué gusto saludarte. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.";

  // --- FALLBACK EMPÁTICO ---
  return "💛 Puedo orientarte según lo que quieras mejorar: grasa, piel, acné, vello o flacidez. Cuéntame un poco más y te ayudo a definir el mejor tratamiento.";
}

/* =========================================================
   DETECTORES
   ========================================================= */
function detectarCategoria(t) {
  if (/grasa|abdomen|cintura|rollito|muslo/.test(t)) return "lipo";
  if (/gluteo|glúteo|poto|trasero|push/.test(t)) return "pushup";
  if (/flacidez|reafirmar|tensor/.test(t)) return "bodytensor";
  if (/facial|face|rostro/.test(t)) return "face";
  if (/acne|manchas|espinillas/.test(t)) return "acne";
  if (/limpieza/.test(t)) return "limpieza";
  if (/vello|pelos|depil/.test(t)) return "depilacion";
  return null;
}

function detectarSubintencion(t) {
  if (/precio|vale|valor|cuánto/.test(t)) return "precio";
  if (/sesion|sesiones|cada cuanto/.test(t)) return "sesiones";
  if (/dura|minuto|tiempo/.test(t)) return "duracion";
  if (/tecnolog|maquina/.test(t)) return "tecnologia";
  if (/resultado/.test(t)) return "resultados";
  if (/duele|dolor|seguro/.test(t)) return "dolor";
  if (/consiste|funciona|trata|actua|mecanismo/.test(t)) return "consiste";
  return null;
}

/* =========================================================
   RESPUESTAS EMPÁTICAS Y DETALLE
   ========================================================= */
function generarEmpatia(categoria) {
  const p = planes[categoria];
  if (!p) return "✨ Cuéntame qué zona o tratamiento te gustaría mejorar.";

  return `Entiendo perfectamente, ${p.descripcion}\nAgenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9`;
}

function generarDetalle(categoria, tipo) {
  const p = planes[categoria];
  if (!p) return "Puedo orientarte si me indicas qué zona o plan te interesa.";

  const d = p.detalle;
  switch (tipo) {
    case "precio":
      return `💰 El valor de ${p.nombre} es ${p.precio}.`;
    case "sesiones":
      return `📅 ${d.sesiones}`;
    case "duracion":
      return `⏱️ Cada sesión dura aproximadamente ${d.duracion}.`;
    case "tecnologia":
      return `🔬 Utilizamos tecnologías como ${p.tecnologias.join(", ")}. ${d.tecnologia}`;
    case "resultados":
      return `✨ ${d.resultados}`;
    case "dolor":
      return "💆‍♀️ Son tratamientos cómodos y no invasivos. Solo podrías sentir calor o contracciones suaves. Lo ideal es que vengas a conocernos y resolver todas tus dudas.";
    case "consiste":
      return generarConsiste(categoria);
    default:
      return "Puedo darte más detalles si me indicas qué te gustaría saber: sesiones, duración, tecnología o resultados.";
  }
}

/* =========================================================
   BLOQUES DETALLADOS "EN QUÉ CONSISTE"
   ========================================================= */
function generarConsiste(categoria) {
  switch (categoria) {
    case "lipo":
      return "💫 Nuestros protocolos Lipo combinan *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor*. Actúan sobre la grasa subcutánea, destruyen los adipocitos y tonifican el músculo sin dolor. Es ideal para abdomen, cintura o muslos. Los resultados se aprecian desde la tercera semana.";
    case "pushup":
      return "🍑 El tratamiento *Push Up Glúteos* combina *EMS Sculptor* y *Radiofrecuencia profunda*. El primero genera 20.000 contracciones musculares en 30 minutos, mientras la RF reafirma la piel y mejora la textura. Logra levantamiento y firmeza visibles sin cirugía.";
    case "face":
      return "💆‍♀️ Los planes *Face* utilizan *Pink Glow*, *Radiofrecuencia 12D* y *Toxina Botulínica clínica*. Estas tecnologías estimulan colágeno, mejoran luminosidad y suavizan arrugas dinámicas. Se adaptan según cada rostro y objetivo, buscando resultados naturales y progresivos.";
    case "depilacion":
      return "🌿 La *Depilación Láser Diodo Alexandrita* elimina el vello desde la raíz usando triple longitud de onda. El sistema de enfriamiento *Sapphire* evita molestias y protege la piel. Es segura, apta para todo tipo de piel y deja la zona suave desde la primera sesión.";
    case "limpieza":
      return "✨ La *Limpieza Facial Full* incluye vapor ozono, extracción profunda, alta frecuencia y máscara LED regeneradora. Limpia poros, controla grasa y revitaliza la piel sin irritar. Se recomienda cada 15 días en su primer ciclo.";
    default:
      return "Puedo contarte exactamente cómo funciona ese procedimiento en tu caso si me dices la zona que te interesa tratar.";
  }
}

/* =========================================================
   MODO INTERNO
   ========================================================= */
function generarModoInterno(contenido) {
  const categoria = detectarCategoria(contenido);
  const p = categoria ? planes[categoria] : null;
  if (!p)
    return `🧠 MODO INTERNO – ANÁLISIS CLÍNICO Y COMERCIAL\n\nNo se detectó plan asociado a: ${contenido}\n\n— Fin del modo interno —`;

  const d = p.detalle;
  return `🧠 MODO INTERNO – ANÁLISIS CLÍNICO Y COMERCIAL\n\n• Plan: ${p.nombre}\n• Precio: ${p.precio}\n• Tecnologías: ${p.tecnologias.join(", ")}\n• Sesiones: ${d.sesiones}\n• Duración: ${d.duracion}\n• Resultados: ${d.resultados}\n\n— Fin del modo interno —`;
}
