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
  if(f.emocional.some(x=>t.includes(x))) 
    return "💬 Entiendo lo que sientes. Muchos pacientes comienzan igual y logran excelentes resultados con un plan personalizado. ¿Te gustaría que te oriente?";

  let zonaDetectada = null;
  for(const [zona, lista] of Object.entries(alias)){
    if(lista.some(a => palabras.includes(a) || t.includes(a))){
      zonaDetectada = zona;
      break;
    }
  }

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

  if(zonaDetectada){
    const grupo = probs[zonaDetectada];
    const p1 = Object.values(grupo)[0][0];
    const d1 = planes[p1];
    return `💡 Para ${zonaDetectada}, te recomiendo **${p1}**.\n${d1}\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
  }

  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}

/* --- Extensiones empáticas y comprensión natural --- */
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

export function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("triste") || t.includes("insegura") || t.includes("mal"))
    return "💬 Entiendo cómo te sientes. Muchos comienzan así, pero logran grandes cambios con orientación adecuada. ¿Quieres que te recomiende un plan según tu zona?";
  if (t.includes("gracias") || t.includes("super"))
    return "💛 Me alegra leerte. Si deseas, puedo explicarte cómo agendar o qué plan seguir.";
  if (t.includes("no sé") || t.includes("no tengo idea"))
    return "✨ No te preocupes, puedo guiarte paso a paso según la zona o lo que quieras mejorar.";
  if (t.includes("dime") || t.includes("cuál") || t.includes("recomienda"))
    return "💡 Cuéntame si buscas trabajar rostro, abdomen, glúteos o brazos, y te diré la mejor opción clínica con valor.";
  return null;
}

export function responderExtendido(textoUsuario) {
  const base = responder(textoUsuario);
  const empatica = responderEmpatico(textoUsuario);
  if (empatica) return empatica;

  const t = textoUsuario.toLowerCase();

  if (base.includes("Soy Zara IA de Body Elite. Cuéntame")) {
    return "🤔 No logré entender tu pregunta, pero nuestras profesionales podrán aclarar todo durante tu evaluación gratuita. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

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

  if (base.includes("Para")) {
    const zona = base.match(/Para ([a-záéíóúñ]+)/i)?.[1];
    const problema = base.match(/con ([a-záéíóúñ]+)/i)?.[1];
    return ampliarRespuesta(base, zona, problema);
  }

  return base;
}

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
