// responses.js
// Versión completa con comprensión avanzada, derivación automática y aviso interno garantizado

import fetch from "node-fetch";
import { detectarIntencion } from "./comprension.js";

const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Números internos que reciben aviso
const NUMEROS_INTERNOS = ["56983300262", "56937648536", "56931720760"];

// Memoria corta por usuario (última intención mencionada)
const memoriaUsuarios = new Map();

// ---- Aviso interno (simultáneo) ----
async function avisarInternamente(token, telefono) {
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const texto = `🧭 Nuevo interesado en agendar evaluación.\n📅 ${fecha}\n📱 ${telefono}`;
  const tareas = NUMEROS_INTERNOS.map(numero =>
    fetch("https://graph.facebook.com/v17.0/105596959260801/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: texto }
      })
    }).catch(err => console.error("Aviso interno error:", err))
  );
  await Promise.all(tareas);
}

// ---- Descripciones clínicas ----
const tratamientos = {
  lipo: {
    nombre: "Lipo Focalizada Reductiva",
    descripcion:
      "Combina *Cavitación*, *Radiofrecuencia* y *EMS Sculptor* para eliminar grasa localizada, reafirmar y reducir contornos. Resultados visibles desde la 3ª sesión.",
    precio: "$480.000 CLP | 6 sesiones",
    aparatologia:
      "Cavitador ultrasónico, radiofrecuencia corporal avanzada y tecnología Sculptor (electroestimulación profunda).",
    experiencia:
      "Durante la sesión se siente calor y contracciones leves. Es indolora y se puede retomar la rutina inmediatamente."
  },
  haifu: {
    nombre: "HIFU 12D",
    descripcion:
      "Ultrasonido focalizado de alta intensidad que estimula colágeno y tensa tejidos. Ideal para flacidez facial o corporal sin cirugía.",
    precio: "$664.000 CLP | 6 sesiones",
    aparatologia:
      "HIFU 12D con cartuchos multiprofundidad que trabajan dermis y SMAS.",
    experiencia:
      "Sensación de calor profundo y leve presión. Sin tiempo de recuperación, resultados progresivos en 3 a 6 semanas."
  },
  toxina: {
    nombre: "Toxina Botulínica Profesional",
    descripcion:
      "Relaja músculos faciales responsables de líneas de expresión, logrando un rostro descansado y natural.",
    precio: "$180.000 CLP | 1 sesión",
    aparatologia: "Aplicación inyectable por especialistas certificados.",
    experiencia:
      "El efecto inicia a los 3-5 días y dura entre 4 y 6 meses. Sin tiempo de recuperación."
  },
  "pink glow": {
    nombre: "Pink Glow Facial",
    descripcion:
      "Tratamiento bioestimulante que aporta vitaminas, aminoácidos y péptidos. Mejora luminosidad y textura de la piel.",
    precio: "$198.400 CLP | 4 sesiones",
    aparatologia: "Microneedling con cóctel vitamínico europeo.",
    experiencia:
      "Se siente un leve cosquilleo, sin dolor. Resultados visibles desde la segunda sesión."
  },
  sculptor: {
    nombre: "Body Fitness Sculptor",
    descripcion:
      "Tonifica y define músculos mediante contracciones profundas equivalentes a 20.000 abdominales por sesión.",
    precio: "$360.000 CLP | 6 sesiones",
    aparatologia: "Equipo EMSculptor Pro con doble aplicador simultáneo.",
    experiencia:
      "Sensación de contracciones intensas pero tolerables. Sin dolor, resultados desde la 3ª sesión."
  },
  antiage: {
    nombre: "Face Antiage Premium",
    descripcion:
      "Combinación de *HIFU, Radiofrecuencia y Toxina Botulínica* para rejuvenecer, mejorar textura y firmeza facial.",
    precio: "$281.600 CLP | 6 sesiones",
    aparatologia: "HIFU 12D facial + RF + aplicación de toxina controlada.",
    experiencia:
      "Se percibe calor suave y sensación tensora inmediata. Resultados visibles en 10 a 15 días."
  }
};

// ---- Derivación automática por intención difusa ----
function inferirTratamientoPorContexto(texto) {
  if (/(bajar|reducir|adelgazar|cintura|abdomen|celulitis|flacidez|rollito|piernas|gluteo)/i.test(texto))
    return "lipo";
  if (/(tonificar|definir|firmeza|musculo|abdominales|sculptor|electro)/i.test(texto))
    return "sculptor";
  if (/(arrugas|rostro|cara|rejuvenecer|piel|manchas|luminosidad|antiage)/i.test(texto))
    return "antiage";
  if (/(toxina|botox|expresion)/i.test(texto))
    return "toxina";
  if (/(hifu|lifting|tensar)/i.test(texto))
    return "haifu";
  if (/(glow|vitaminas|luminoso)/i.test(texto))
    return "pink glow";
  return null;
}

// ---- Generar respuesta principal ----
export async function generarRespuesta(mensaje, token, telefono) {
  const texto = mensaje.toLowerCase();
  const ultimaIntencion = memoriaUsuarios.get(telefono);
  const intencionDetectada = detectarIntencion(texto);
  const inferida = inferirTratamientoPorContexto(texto);
  const intencion = intencionDetectada !== "general" ? intencionDetectada : inferida;
  const encabezado = "✨ Agenda tu evaluación gratuita con nuestros especialistas ✨";
  let respuesta = "";

  const consultaDetalle = [
    "que maquinas", "me explicas", "duele", "como funciona", "resultados", "cuanto dura", "en que consiste"
  ].some(frase => texto.includes(frase));

  // --- Si el usuario pide detalle sobre su última intención ---
  if (consultaDetalle && ultimaIntencion && tratamientos[ultimaIntencion]) {
    const t = tratamientos[ultimaIntencion];
    respuesta =
      `💬 ${t.nombre}\n${t.descripcion}\n\n⚙️ *Aparatología:* ${t.aparatologia}\n🧘 *Experiencia del paciente:* ${t.experiencia}\n💰 *Valor:* ${t.precio}\n\n📍 Agenda acá: ${LINK_RESERVO}\n${encabezado}`;
    await avisarInternamente(token, telefono);
  }

  // --- Si detecta un tratamiento o lo infiere ---
  else if (intencion && tratamientos[intencion]) {
    const t = tratamientos[intencion];
    respuesta =
      `🔥 ${t.nombre}\n${t.descripcion}\n💰 *${t.precio}*\n\n📍 Parte desde acá 👉 ${LINK_RESERVO}\n${encabezado}`;
    memoriaUsuarios.set(telefono, intencion);
    await avisarInternamente(token, telefono);
  }

  // --- Si solo pide agendar ---
  else if (intencion === "agenda") {
    respuesta =
      `📅 Puedes agendar tu diagnóstico gratuito con tecnología *FitDays*.\nIncluye evaluación corporal y facial completa.\n\nReserva directamente aquí:\n${LINK_RESERVO}`;
    await avisarInternamente(token, telefono);
  }

  // --- Default ---
  else {
    respuesta =
      "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.\nEscribe *“quiero agendar”* o menciona el tratamiento que te interesa.";
  }

  // Enviar aviso si incluye link
  if (respuesta.includes(LINK_RESERVO)) {
    await avisarInternamente(token, telefono);
  }

  return respuesta;
}
