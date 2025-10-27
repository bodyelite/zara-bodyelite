import { datos } from "./base_conocimiento.js";

export function responder(texto){
  const t = texto.toLowerCase().trim();
  const f = datos.frases;
  const info = datos.info;
  const alias = datos.alias;
  const probs = datos.problemas;
  const planes = datos.planes;

  // 1. intenciones básicas
  if(f.bienvenida.some(x=>t.includes(x))) return "🌸 Hola, soy Zara IA de Body Elite. Cuéntame qué zona te gustaría mejorar.";
  if(f.precio.some(x=>t.includes(x))) return "💰 Nuestros planes parten desde $120 000 (faciales) y $348 800 (corporales). Incluyen diagnóstico gratuito asistido por IA.";
  if(f.ubicacion.some(x=>t.includes(x))) return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  if(f.horarios.some(x=>t.includes(x))) return `🕒 Horarios de atención: ${info.horarios}`;
  if(f.humano.some(x=>t.includes(x))) return `📞 Puedes hablar con un especialista al ${info.telefono}`;
  if(f.intencion.some(x=>t.includes(x))) return `📅 Agenda tu evaluación gratuita aquí 👉 ${info.agendar}`;

  // 2. emociones
  if(f.emocional.some(x=>t.includes(x))) 
    return "💬 Entiendo lo que sientes. Muchos pacientes comienzan igual y logran excelentes resultados con un plan personalizado. ¿Te gustaría que te oriente?";

  // 3. detección zona-problema
  let zonaDetectada=null;
  for(const [zona,lista] of Object.entries(alias)){
    if(lista.some(a=>t.includes(a))) zonaDetectada=zona;
  }
  if(!zonaDetectada) zonaDetectada = Object.keys(probs).find(z=>t.includes(z));
  if(zonaDetectada){
    const grupo = probs[zonaDetectada];
    for(const [clave,arr] of Object.entries(grupo)){
      if(t.includes(clave)){
        const p1=arr[0], p2=arr[1];
        const d1=planes[p1]||"", d2=planes[p2]||"";
        let r=`✨ Para ${zonaDetectada} con ${clave}, te recomiendo **${p1}**.\n${d1}`;
        if(p2) r+=`\nTambién puedes considerar **${p2}**.\n${d2}`;
        r+=`\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
        return r;
      }
    }
    // sin palabra de problema
    const p1=Object.values(grupo)[0][0];
    return `💡 Para ${zonaDetectada}, te recomiendo **${p1}**.\n${planes[p1]}\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
  }

  // 4. genérico
  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}
