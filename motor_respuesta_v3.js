// ======================================================
// ZARA BODY ELITE – MOTOR COMPLETO (IG + WHATSAPP)
// ======================================================

const AGENDA = "https://bodyelite.cl/agendar";

// ======================================================
// MOTOR PRINCIPAL
// ======================================================

function motorZara(mensaje) {
  const m = mensaje.toLowerCase().trim();

  // ======================================================
  // PRIORIDAD MÁXIMA → PRECIOS / VALORES / CARO
  // ======================================================

  if (
    m.includes("precio") ||
    m.includes("vale") ||
    m.includes("cuánto sale") ||
    m.includes("cuanto sale") ||
    m.includes("valor") ||
    m.includes("caro") ||
    m.includes("carísimo") ||
    m.includes("carisimo")
  ) {
    return `
Los valores parten desde el **menor precio disponible por categoría**, porque todo se adapta a tu cuerpo y a tu meta.

• **Planes corporales desde $19.900**
• **Depilación láser desde $5.900**
• **Faciales desde $14.900**

Cada persona necesita algo distinto, por eso la evaluación gratuita es clave. Ahí medimos grasa, flacidez, retención, arrugas, calidad de piel o lo facial que quieras mejorar.

Agenda aquí y te damos tu valor exacto según tu meta:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – ARRUGAS
  // ======================================================

  if (
    m.includes("arruga") ||
    m.includes("línea de expresión") ||
    m.includes("linea de expresion") ||
    m.includes("patas de gallo") ||
    m.includes("frente")
  ) {
    return `
Para arrugas trabajamos con **Radiofrecuencia facial**, **HIFU** (si corresponde), y **toxina autolítica** para suavizar líneas sin invasión.

Te ayuda a:
• Suavizar arrugas marcadas  
• Mejorar firmeza  
• Rejuvenecer la mirada  
• Prevenir profundización

Lo ideal es verte en la **evaluación gratuita** para definir qué tecnología necesitas.

Agenda aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – TOXINA / RELLENO NO INVASIVO
  // ======================================================
  if (m.includes("toxina") || m.includes("botox") || m.includes("relleno")) {
    return `
La toxina autolítica ayuda a suavizar arrugas dinámicas en frente, entrecejo y patas de gallo, sin volumen artificial.

La evaluación gratuita nos permite ver:
• Zona a tratar  
• Nivel de movilidad  
• Profundidad de arruga  
• Cantidad exacta necesaria  

Agenda aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – PAPADA
  // ======================================================
  if (m.includes("papada")) {
    return `
Para papada usamos **Pro Sculpt**, **radiofrecuencia facial**, drenaje y tecnologías de reducción localizada según el caso.

Reduce:
• Grasa submentoniana  
• Pesadez  
• Flacidez leve  
• Contorno difuso

Para saber exactamente qué necesitas, agenda tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – FLACIDEZ
  // ======================================================
  if (m.includes("flacidez facial") || (m.includes("flacidez") && m.includes("cara"))) {
    return `
Para flacidez facial trabajamos con **radiofrecuencia**, **HIFU** (si corresponde), y **Pro Sculpt Facial** para reafirmar y tensar.

Ayuda a:
• Levantar  
• Dar contorno  
• Mejorar firmeza  
• Reducir aspecto cansado  

Agenda tu evaluación gratuita aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – HIDROFACIAL
  // ======================================================
  if (m.includes("hidrofacial") || m.includes("limpieza facial")) {
    return `
El Hidrofacial limpia, exfolia, hidrata, mejora poros, textura y luminosidad en una sola sesión.

Perfecto para:
• Poros abiertos  
• Piel apagada  
• Piel deshidratada  
• Textura irregular  

Agenda tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – MANCHAS
  // ======================================================
  if (m.includes("mancha") || m.includes("hiperpig")) {
    return `
Para manchas trabajamos con exfoliación profunda, hidrofacial, despigmentantes no invasivos y radiofrecuencia según tipo de mancha.

La evaluación gratuita nos permite ver la profundidad y definir plan exacto.

Agenda aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // FACIAL – POROS
  // ======================================================
  if (m.includes("poro")) {
    return `
Para poros usamos **hidrofacial**, exfoliación profunda y radiofrecuencia para tensar y mejorar textura.

Agenda tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // CORPORAL – LIPO EXPRESS
  // ======================================================
  if (
    m.includes("lipo express") ||
    (m.includes("lipo") && (m.includes("abdomen") || m.includes("espalda")))
  ) {
    return `
La Lipo Express reduce grasa rápido en abdomen o espalda completa con cavitación, radiofrecuencia, láser y drenaje.

Sesiones: 4 a 8 según evaluación.

Agenda tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // CORPORAL – PUSH UP
  // ======================================================
  if (m.includes("push") || m.includes("glute") || m.includes("glúteo")) {
    return `
El Plan Push Up levanta, afirma y da contorno al glúteo.  
Importante: **no aumenta el volumen**, solo da forma.

Agenda tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // CORPORAL – FIBROSIS
  // ======================================================
  if (m.includes("fibro")) {
    return `
Sí tratamos fibrosis post lipo con radiofrecuencia profunda, cavitación controlada y drenaje.

Agenda tu evaluación aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // CORPORAL – GRASA GENERAL
  // ======================================================
  if (
    m.includes("grasa") ||
    m.includes("abdomen") ||
    m.includes("espalda") ||
    m.includes("pierna") ||
    m.includes("muslo") ||
    m.includes("brazos")
  ) {
    return `
Sí podemos ayudarte con reducción de grasa.  
Usamos cavitación, radiofrecuencia, drenaje, láser y Pro Sculpt según el caso.

Agenda tu evaluación gratuita aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // DEPILACIÓN
  // ======================================================
  if (m.includes("depil")) {
    return `
Planes de depilación láser desde **$5.900**, dependiendo de zona.

Lo ideal es evaluación gratuita para ver qué zonas necesitas.

Agenda aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // HORARIOS
  // ======================================================
  if (m.includes("horario") || m.includes("hora")) {
    return `
Atendemos de lunes a sábado.

Puedes reservar aquí:
${AGENDA}

¿Quieres que te llamemos?
    `.trim();
  }

  // ======================================================
  // RESPUESTA GENÉRICA
  // ======================================================
  return `
Cuéntame un poquito más para ayudarte.  
Mientras, aquí puedes agendar tu evaluación gratuita:
${AGENDA}

¿Quieres que te llamemos?
  `.trim();
}

// ======================================================
// EXPORTACIÓN
// ======================================================
function procesarMensaje(m) {
  return motorZara(m);
}
module.exports = { procesarMensaje };
