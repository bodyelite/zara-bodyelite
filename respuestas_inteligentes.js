import fs from "fs";
import fs from "fs";

const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf8"));
let extendidos = {};
try { extendidos = JSON.parse(fs.readFileSync("./conocimientos_extendidos.json", "utf8")).planes_extendidos; } catch (e) { extendidos = {}; }
Object.assign(conocimientos.planes, extendidos);
const frases = JSON.parse(fs.readFileSync("./frases.json", "utf8"));

const planes = conocimientos.planes;
const zonas = conocimientos.problema_zona;
const alias = conocimientos.alias_zonas;
const info = conocimientos.informacion_general;

const match = (texto, lista) => lista.some(p => texto.includes(p));

export function generarRespuestaAvanzada(texto) {
  const msg = texto.toLowerCase().trim();

  if (frases.emocional.some(p => msg.includes(p))) {
    return "💬 Entiendo lo que sientes. Muchos pacientes llegan con la misma sensación y logran excelentes resultados con un plan personalizado. ¿Te gustaría que te guíe hacia el más indicado?";
  }

  if (frases.bienvenida.some(p => msg.includes(p))) {
    return "🌸 ¡Hola! Soy Zara IA de Body Elite. Te ayudo a identificar el tratamiento ideal según tu zona, tipo de piel y objetivo corporal o facial.";
  }

  if (frases.intencion_agendar.some(p => msg.includes(p))) {
    return "📅 Perfecto. Agenda tu evaluación gratuita asistida por IA en el siguiente enlace 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (frases.ubicacion.some(p => msg.includes(p))) {
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  }

  if (frases.horarios.some(p => msg.includes(p))) {
    return `🕒 Horarios de atención: ${info.horarios}`;
  }

  let zona = Object.keys(zonas).find(z => msg.includes(z));
  if (!zona) {
    for (const [aliasTerm, zonaReal] of Object.entries(alias)) {
      if (msg.includes(aliasTerm)) {
        zona = zonaReal;
        break;
      }
    }
  }

  if (zona) {
    const problemas = zonas[zona];
    for (const [clave, listaPlanes] of Object.entries(problemas)) {
      if (msg.includes(clave)) {
        const planPrincipal = planes[listaPlanes[0]];
        const planAlt = listaPlanes[1] ? planes[listaPlanes[1]] : null;

        let respuesta = `✨ Para ${zona} con ${clave}, te recomiendo el plan **${listaPlanes[0]}**.\n${planPrincipal.descripcion}\n`;
        if (planAlt) respuesta += `También puedes considerar **${listaPlanes[1]}**, según diagnóstico asistido por IA.\n`;
        respuesta += `📅 Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
        return respuesta;
      }
    }

    const primerPlan = Object.values(problemas)[0][0];
    const plan = planes[primerPlan];
    return `💡 Para ${zona}, te recomiendo el plan **${primerPlan}**.\n${plan.descripcion}\n📅 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  }

  if (frases.precio.some(p => msg.includes(p))) {
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Todos incluyen diagnóstico inicial gratuito asistido por IA.";
  }

  if (frases.faq_comercial.some(p => msg.includes(p))) {
    return "💆 En Body Elite usamos HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para moldear y rejuvenecer sin dolor ni cirugía.";
  }

  if (frases.agradecimientos.some(p => msg.includes(p))) {
    return "💛 Gracias a ti. Recuerda que puedes agendar tu evaluación gratuita cuando quieras.";
  }

  if (frases.cierres.some(p => msg.includes(p))) {
    return "🌷 Me alegra ayudarte. Te espero en Body Elite para tu evaluación personalizada.";
  }

  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, etc.) y te indicaré el tratamiento más adecuado con descripción y valor.";
}
