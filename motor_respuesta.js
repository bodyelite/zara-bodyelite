import { datos } from "./base_conocimiento.js";

function limpiar(t){
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

export function responder(texto){
  const t = limpiar(texto);
  const palabras = t.split(" ");
  const f = datos.frases;
  const info = datos.info;
  const alias = datos.alias;
  const probs = datos.problemas;
  const planes = datos.planes;

  // 1. intenciones básicas
  if(f.bienvenida.some(x=>t.includes(x))) 
    return "🌸 Hola, soy Zara IA de Body Elite. Cuéntame qué zona te gustaría mejorar.";
  if(f.precio.some(x=>t.includes(x))) 
    return "💰 Nuestros planes parten desde $120 000 (faciales) y $348 800 (corporales). Incluyen diagnóstico gratuito asistido por IA.";
  if(f.ubicacion.some(x=>t.includes(x))) 
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  if(f.horarios.some(x=>t.includes(x))) 
    return `🕒 Horarios de atención: ${info.horarios}`;
  if(f.humano.some(x=>t.includes(x))) 
    return `📞 Puedes hablar con un especialista al ${info.telefono}`;
  if(f.intencion.some(x=>t.includes(x))) 
    return `📅 Agenda tu evaluación gratuita aquí 👉 ${info.agendar}`;

  // 2. emociones
  if(f.emocional.some(x=>t.includes(x))) 
    return "💬 Entiendo lo que sientes. Muchos pacientes comienzan igual y logran excelentes resultados con un plan personalizado. ¿Te gustaría que te oriente?";

  // 3. detección de zona (usa alias o palabra aislada)
  let zonaDetectada = null;
  for(const [zona, lista] of Object.entries(alias)){
    if(lista.some(a => palabras.includes(a) || t.includes(a))){
      zonaDetectada = zona;
      break;
    }
  }

  // 4. detección de problema (usa coincidencia flexible)
  let problemaDetectado = null;
  for(const [zona, grupo] of Object.entries(probs)){
    for(const [clave] of Object.entries(grupo)){
      const tokens = clave.split(" ");
      if(tokens.some(tok => t.includes(tok))){
        problemaDetectado = clave;
        if(!zonaDetectada) zonaDetectada = zona;
        break;
      }
    }
    if(problemaDetectado) break;
  }

  // 5. generación de respuesta
  if(zonaDetectada && problemaDetectado){
    const arr = probs[zonaDetectada][problemaDetectado];
    if(arr){
      const [p1,p2] = arr;
      const d1 = planes[p1] || "", d2 = planes[p2] || "";
      let r = `✨ Para ${zonaDetectada} con ${problemaDetectado}, te recomiendo **${p1}**.\n${d1}`;
      if(p2) r += `\nTambién puedes considerar **${p2}**.\n${d2}`;
      r += `\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
      return r;
    }
  }

  // 6. si detecta zona sin problema (ej. “muslos”)
  if(zonaDetectada){
    const grupo = probs[zonaDetectada];
    const p1 = Object.values(grupo)[0][0];
    const d1 = planes[p1];
    return `💡 Para ${zonaDetectada}, te recomiendo **${p1}**.\n${d1}\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
  }

  // 7. respuesta genérica
  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}

/* --- Extensión Zara 2.1: respuesta clínica avanzada y fallback --- */
function ampliarRespuesta(textoOriginal, zona, problema) {
  const techInfo = "🧠 HIFU 12D actúa sobre fascia SMAS y grasa subcutánea. Cavitación rompe adipocitos. Radiofrecuencia estimula colágeno. EMS Sculptor tonifica músculo. Pink Glow regenera células. LED reduce inflamación.";
  let texto = textoOriginal;
  if (zona && problema) texto += "\n\n" + techInfo;
  return texto;
}

function planMasBarato(grupoPlanes, planes) {
  let menor = null, menorValor = Infinity;
  for (const p of grupoPlanes) {
    const match = planes[p]?.match(/\$([\d\.]+)/);
    if (match) {
      const val = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
      if (val < menorValor) { menorValor = val; menor = p; }
    }
  }
  return menor;
}

export function responderExtendido(textoUsuario) {
  const base = responder(textoUsuario);
  const t = textoUsuario.toLowerCase();

  // Detectar si no entendió
  if (base.includes("Soy Zara IA de Body Elite. Cuéntame")) {
    return "🤔 No logré entender tu pregunta, pero nuestras profesionales podrán aclarar todas tus dudas durante la evaluación gratuita. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Comparar precios
  if (t.includes("barato") || t.includes("económico") || t.includes("alternativa")) {
    try {
      const zona = base.match(/Para ([a-záéíóúñ]+) con/gi)?.[0]?.replace(/Para | con/gi,"").trim() || "";
      const problema = base.match(/con ([a-záéíóúñ]+)/gi)?.[0]?.replace(/con /gi,"").trim() || "";
      import("./base_conocimiento.js").then(({datos})=>{
        const grupo = datos.problemas[zona]?.[problema];
        if (grupo) {
          const barato = planMasBarato(grupo, datos.planes);
          if (barato) {
            const d = datos.planes[barato];
            return `💡 Si buscas una opción más económica, considera **${barato}**. ${d}\n📅 Agenda tu evaluación gratuita 👉 ${datos.info.agendar}`;
          }
        }
      });
    } catch {}
  }

  // Agregar información clínica si corresponde
  if (base.includes("Para")) {
    const zona = base.match(/Para ([a-záéíóúñ]+)/i)?.[1];
    const problema = base.match(/con ([a-záéíóúñ]+)/i)?.[1];
    return ampliarRespuesta(base, zona, problema);
  }

  return base;
}

/* --- Bloque de prueba local --- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const casos = [
    "tengo grasa en abdomen",
    "hay algo más barato para abdomen",
    "tengo flacidez en brazos",
    "no entiendo nada"
  ];
  console.log("=== PRUEBAS ZARA 2.1 EXTENDIDA ===");
  for (const c of casos) {
    const r = responderExtendido(c);
    console.log(`\n🗣️ Usuario: ${c}\n🤖 Zara: ${r}\n`);
  }
}


/* === Capa empática añadida Zara 2.1 === */
  const saludo = "Hola 😊 ";
  const pie = "\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  const enlace = "\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // Si ya es una respuesta técnica ("Para ... te recomiendo"), se reescribe con cercanía
  if (respuestaBase.includes("Para")) {
    return (
      saludo +
      "Esa grasita o flacidez se puede tratar sin cirugía ✨\n" +
      respuestaBase
        .replace("✨ Para", "Con nuestros planes")
        .replace("💡 Para", "Con nuestros planes") +
      enlace +
      pie
    );
  }

  // Si es mensaje genérico
  return saludo + respuestaBase + enlace + pie;
}


/* === Capa de curiosidad y comparación === */
export async function responderCuriosidad(textoUsuario, respuestaBase) {
  const t = textoUsuario.toLowerCase();
  const { frases, planes } = (await import("./base_conocimiento.js")).datos;

  if (frases.curiosidad.some(f => t.includes(f))) {
    const match = respuestaBase.match(/\*\*(.*?)\*\*/);
    if (match) {
      const plan = match[1].trim();
      const detalle = planes[plan] || "";
      if (t.includes("barato") || t.includes("econ")) {
        return `💡 Si buscas algo más económico, también tenemos planes de menor valor con resultados progresivos. Puedo ayudarte a ver cuál se ajusta mejor a tu presupuesto. ¿Te gustaría que te oriente?`;
      }
      if (t.includes("caro")) {
        return `💬 Entiendo tu duda 😊 Nuestros precios reflejan la tecnología y resultados reales que ofrecemos. El plan **${plan}** incluye equipos de última generación (HIFU 12D, RF, EMS) y un diagnóstico profesional.`;
      }
      if (t.includes("sesion")) {
        return `📆 El plan **${plan}** incluye entre 6 y 12 sesiones según tu evaluación inicial. Cada sesión combina distintas tecnologías para resultados visibles desde la primera.`;
      }
      return `💬 El plan **${plan}** consiste en ${detalle.toLowerCase()}. Logra resultados visibles en pocas sesiones y sin tiempo de recuperación.`;
    }
  }
  return respuestaBase;
}


/* === Capa interna Body Elite: consultas que comienzan con "zara" === */
export async function responderInterno(textoUsuario) {
  const t = textoUsuario.toLowerCase().trim();
  if (!t.startsWith("zara")) return null; // solo si inicia con "zara"

  const { planes } = (await import("./base_conocimiento.js")).datos;
  const nombresPlanes = Object.keys(planes).map(p => p.toLowerCase());
  const encontrado = nombresPlanes.find(p => t.includes(p));
  if (encontrado) {
    const nombre = Object.keys(planes).find(p => p.toLowerCase() === encontrado);
    const detalle = planes[nombre] || "";
    return `🧠 Consulta interna detectada.\nTratamiento **${nombre}**:\n${detalle}\n\nEsta descripción es de uso clínico interno. No se incluye CTA ni enlace.`;
  }

  return "🧠 Consulta interna detectada, pero no encontré un tratamiento coincidente. Revisa la ortografía del nombre.";
}


// --- Fallback temporal si responderDetalle no existe ---
export async function responderDetalle(textoUsuario, respuestaBase) {
  return respuestaBase;
}


/* === Extensiones estables añadidas Zara 2.1 === */

// Capa empática: humaniza la respuesta base sin alterar estructura
  const saludo = "Hola 😊 ";
  const pie = "\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  const enlace = "\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  if (respuestaBase.includes("Para")) {
    return (
      saludo +
      "Esa grasita o flacidez se puede tratar sin cirugía ✨\n" +
      respuestaBase.replace("✨ Para", "Con nuestros planes").replace("💡 Para", "Con nuestros planes") +
      enlace +
      pie
    );
  }
  return saludo + respuestaBase + enlace + pie;
}

// Capa de curiosidad: responde a "en qué consiste", "cómo funciona", etc.
export async function responderCuriosidad(textoUsuario, respuestaBase) {
  const t = textoUsuario.toLowerCase();
  const { datos } = await import("./base_conocimiento.js");
  if (!datos.frases?.curiosidad) return respuestaBase;

  if (datos.frases.curiosidad.some(f => t.includes(f))) {
    const match = respuestaBase.match(/\*\*(.*?)\*\*/);
    if (match) {
      const plan = match[1].trim();
      const detalle = datos.planes[plan] || "";
      if (t.includes("barato") || t.includes("econ")) {
        return "💡 También existen planes más accesibles con resultados progresivos. Podemos orientarte según tu presupuesto.";
      }
      if (t.includes("caro")) {
        return `💬 El plan **${plan}** usa tecnología premium (HIFU 12D, RF, EMS) y diagnóstico personalizado. Refleja resultados reales y duraderos.`;
      }
      if (t.includes("sesion")) {
        return `📆 El plan **${plan}** considera entre 6 y 12 sesiones según evaluación clínica. Resultados visibles desde la primera.`;
      }
      return `💬 El plan **${plan}** consiste en ${detalle.toLowerCase()}. Combina tecnología avanzada con enfoque clínico seguro.`;
    }
  }
  return respuestaBase;
}

// Capa interna: consultas del equipo que comienzan con "zara"
export async function responderInterno(textoUsuario) {
  const t = textoUsuario.toLowerCase().trim();
  if (!t.startsWith("zara")) return null;
  const { datos } = await import("./base_conocimiento.js");
  const nombres = Object.keys(datos.planes).map(p => p.toLowerCase());
  const encontrado = nombres.find(p => t.includes(p));
  if (encontrado) {
    const nombre = Object.keys(datos.planes).find(p => p.toLowerCase() === encontrado);
    const detalle = datos.planes[nombre] || "";
    return `🧠 [MODO INTERNO]\nTratamiento **${nombre}**:\n${detalle}\n\nUso clínico interno — sin CTA ni enlace.`;
  }
  return "🧠 [MODO INTERNO] No encontré un tratamiento con ese nombre. Verifica la escritura.";
}


/* === Extensiones estables sin duplicados Zara 2.1 === */

// --- Capa empática ---
export function capaEmpatica(textoUsuario, respuestaBase) {
  const saludo = "Hola 😊 ";
  const pie = "\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  const enlace = "\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  if (respuestaBase.includes("Para")) {
    return (
      saludo +
      "Esa grasita o flacidez se puede tratar sin cirugía ✨\n" +
      respuestaBase.replace("✨ Para", "Con nuestros planes").replace("💡 Para", "Con nuestros planes") +
      enlace + pie
    );
  }
  return saludo + respuestaBase + enlace + pie;
}

// --- Capa de curiosidad ---
export async function capaCuriosidad(textoUsuario, respuestaBase) {
  const t = textoUsuario.toLowerCase();
  const { datos } = await import("./base_conocimiento.js");
  if (!datos.frases?.curiosidad) return respuestaBase;

  if (datos.frases.curiosidad.some(f => t.includes(f))) {
    const match = respuestaBase.match(/\*\*(.*?)\*\*/);
    if (match) {
      const plan = match[1].trim();
      const detalle = datos.planes[plan] || "";
      if (t.includes("barato") || t.includes("econ")) {
        return "💡 También existen planes más accesibles con resultados progresivos. Podemos orientarte según tu presupuesto.";
      }
      if (t.includes("caro")) {
        return `💬 El plan **${plan}** utiliza tecnología premium (HIFU 12D, RF, EMS) y diagnóstico personalizado. Refleja resultados reales y duraderos.`;
      }
      if (t.includes("sesion")) {
        return `📆 El plan **${plan}** incluye entre 6 y 12 sesiones según evaluación clínica. Resultados visibles desde la primera.`;
      }
      return `💬 El plan **${plan}** consiste en ${detalle.toLowerCase()}. Combina tecnología avanzada con enfoque clínico seguro.`;
    }
  }
  return respuestaBase;
}

// --- Capa interna ---
export async function capaInterna(textoUsuario) {
  const t = textoUsuario.toLowerCase().trim();
  if (!t.startsWith("zara")) return null;
  const { datos } = await import("./base_conocimiento.js");
  const nombres = Object.keys(datos.planes).map(p => p.toLowerCase());
  const encontrado = nombres.find(p => t.includes(p));
  if (encontrado) {
    const nombre = Object.keys(datos.planes).find(p => p.toLowerCase() === encontrado);
    const detalle = datos.planes[nombre] || "";
    return `🧠 [MODO INTERNO]\nTratamiento **${nombre}**:\n${detalle}\n\nUso clínico interno — sin CTA ni enlace.`;
  }
  return "🧠 [MODO INTERNO] No encontré un tratamiento con ese nombre. Verifica la escritura.";
}
