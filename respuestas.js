import fs from "fs";

const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf8"));
const frases = JSON.parse(fs.readFileSync("./frases.json", "utf8"));

const planes = conocimientos.planes;
const zonas = conocimientos.problema_zona;
const alias = conocimientos.alias_zonas;
const info = conocimientos.informacion_general;

export function generarRespuesta(texto) {
  const msg = texto.toLowerCase().trim();

  // --- 1. Bienvenida ---
  if (frases.bienvenida.some(t => msg.includes(t))) {
    return "👋 Hola, soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar y te recomendaré el tratamiento más adecuado según diagnóstico asistido por IA.";
  }

  // --- 2. Detectar zona (directa o por alias) ---
  let zona = Object.keys(zonas).find(z => msg.includes(z));
  if (!zona) {
    for (const [aliasTerm, zonaReal] of Object.entries(alias)) {
      if (msg.includes(aliasTerm)) {
        zona = zonaReal;
        break;
      }
    }
  }

  // --- 3. Si se identificó zona, buscar problema y planes ---
  if (zona) {
    const problemas = zonas[zona];
    for (const [clave, listaPlanes] of Object.entries(problemas)) {
      if (msg.includes(clave)) {
        const principal = planes[listaPlanes[0]];
        const alternativo = listaPlanes[1] ? planes[listaPlanes[1]] : null;

        let respuesta = `✨ Para ${zona} con ${clave}, te recomiendo el plan **${listaPlanes[0]}**.\n${principal.descripcion}\n`;
        if (alternativo) {
          respuesta += `También puedes considerar **${listaPlanes[1]}**, según diagnóstico asistido por IA.\n`;
        }
        respuesta += `📅 Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
        return respuesta;
      }
    }

    // --- Zona detectada pero sin palabra problema ---
    const primerPlan = Object.values(problemas)[0][0];
    const plan = planes[primerPlan];
    return `✨ Para ${zona}, te recomiendo el plan **${primerPlan}**.\n${plan.descripcion}\n📅 Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  }

  // --- 4. Preguntas frecuentes comerciales ---
  if (frases.precio.some(t => msg.includes(t))) {
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito asistido por IA.";
  }
  if (frases.ubicacion.some(t => msg.includes(t))) {
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  }
  if (frases.horarios.some(t => msg.includes(t))) {
    return `🕒 Horarios de atención: ${info.horarios}`;
  }
  if (frases.humano.some(t => msg.includes(t))) {
    return `📞 Puedes hablar con un especialista al ${info.telefono_humano}`;
  }

  // --- 5. Preguntas de tipo comercial general ---
  if (frases.faq_comercial.some(t => msg.includes(t))) {
    return "💆 En Body Elite utilizamos HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para resultados visibles desde la primera sesión, sin cirugía ni dolor.";
  }

  // --- 6. Mensaje genérico ---
  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, etc.) y te indicaré el tratamiento ideal con descripción clínica y valor.";
}
