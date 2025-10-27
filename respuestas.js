import fs from "fs";

const conocimientos = JSON.parse(fs.readFileSync("./conocimientos.json", "utf8"));
const frases = JSON.parse(fs.readFileSync("./frases.json", "utf8"));

const planes = conocimientos.planes;
const zonas = conocimientos.problema_zona;
const alias = conocimientos.alias_zonas;
const info = conocimientos.informacion_general;

// --- Función principal ---
export function generarRespuesta(texto) {
  const msg = texto.toLowerCase().trim();

  // --- 1. Bienvenida ---
  if (frases.bienvenida.some(t => msg.includes(t))) {
    return "👋 Hola, soy Zara IA de Body Elite. Cuéntame qué zona quieres mejorar y te orientaré con el tratamiento ideal según diagnóstico clínico y tecnología aplicada.";
  }

  // --- 2. Detección de zona ---
  let zona = Object.keys(zonas).find(z => msg.includes(z));
  if (!zona) {
    for (const [aliasTerm, zonaReal] of Object.entries(alias)) {
      if (msg.includes(aliasTerm)) {
        zona = zonaReal;
        break;
      }
    }
  }

  // --- 3. Si se identificó zona, buscar problema y plan ---
  if (zona) {
    const problemas = zonas[zona];
    for (const [clave, listaPlanes] of Object.entries(problemas)) {
      if (msg.includes(clave)) {
        const plan = planes[listaPlanes[0]];
        if (plan) {
          return `💡 *Tratamiento recomendado: ${listaPlanes[0]}*\n${plan.descripcion}\n💰 Valor: ${plan.precio}\n📅 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
        }
      }
    }

    // sin problema explícito, responder genérico por zona
    const primerPlan = Object.values(problemas)[0][0];
    const plan = planes[primerPlan];
    if (plan) {
      return `✨ Para ${zona}, recomendamos *${primerPlan}*.\n${plan.descripcion}\n💰 Valor: ${plan.precio}\n📅 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
    }
  }

  // --- 4. Preguntas comerciales ---
  if (frases.precio.some(t => msg.includes(t))) {
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito asistido con IA.";
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

  // --- 5. Consultas generales de funcionamiento ---
  if (frases.faq_comercial.some(t => msg.includes(t))) {
    return "💆 En Body Elite usamos HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para lograr resultados clínicos reales sin cirugía ni dolor.";
  }

  // --- 6. Mensaje genérico ---
  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}
