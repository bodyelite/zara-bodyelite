import { registrarEvento, iniciarMonitor } from "../monitorChat.js";
import fs from "fs";

function cargarJSON(path) {
  try { return JSON.parse(fs.readFileSync(path, "utf8")); }
  catch { return {}; }
}

const conocimientos = cargarJSON("./core/conocimientos.json");
const frases = cargarJSON("./core/frases.json");
const datos = cargarJSON("./core/config.json");

function normalizar(txt) {
  return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").trim();
}
function coincide(texto, lista) {
  if (!Array.isArray(lista)) return false;
  return lista.some(p => texto.includes(p));
}

function respuestaClinica(zona, problema, planes, incluirPrecio = false) {
  const [principal, alternativa] = planes;
  const infoPrincipal = conocimientos.planes[principal];
  const infoAlternativa = conocimientos.planes[alternativa];
  
  let texto = `✨ Para ${zona} con ${problema}, te recomiendo el plan **${principal}**.\n${infoPrincipal?.descripcion || ""}`;
  if (infoAlternativa)
    texto += `\nTambién puedes considerar **${alternativa}**, según diagnóstico asistido por IA.`;
  if (incluirPrecio && infoPrincipal?.precio)
    texto += `\n💰 Valor de referencia: ${infoPrincipal.precio} (confirmado tras diagnóstico IA gratuito).`;
  texto += `\n📅 Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  return texto;
}

export function responderZara(mensaje, canal = "WSP") {
  const txt = normalizar(mensaje);

  if (coincide(txt, frases.bienvenida))
    return "🌸 ¡Hola! Soy Zara IA de Body Elite. Estoy aquí para ayudarte a descubrir tu mejor versión ✨.\nCuéntame qué zona quieres mejorar y te recomiendo el plan ideal con base clínica y tecnología avanzada.";

  if (coincide(txt, frases.humano))
    return `Claro 💬 puedo derivarte con una especialista humana. Escríbenos al ${conocimientos.informacion_general.telefono_humano}`;

  if (coincide(txt, frases.ubicacion))
    return `📍 Estamos en ${conocimientos.informacion_general.direccion}\n🕓 ${conocimientos.informacion_general.horarios}\n${datos.cta}`;
  if (coincide(txt, frases.horarios))
    return `🕓 Nuestro horario es ${conocimientos.informacion_general.horarios}\n${datos.cta}`;

  const pidePrecio = coincide(txt, frases.precio);
  const palabrasFaciales = ["arrugas", "flacidez", "lineas", "lineas de expresion", "patas de gallo", "frente", "papada", "contorno", "bolsas", "ojos", "acne"];
  const zonas = [...frases.zonas_corporales, ...frases.zonas_faciales];
  const problemas = frases.problemas_comunes;
  let zonaDetectada = null;
  let problemaDetectado = null;

  for (const palabra of palabrasFaciales) {
    if (txt.includes(palabra)) {
      zonaDetectada = "rostro";
      problemaDetectado = palabra;
      break;
    }
  }

  for (const palabra of txt.split(" ")) {
    if (zonas.includes(palabra)) zonaDetectada = palabra;
    if (problemas.includes(palabra)) problemaDetectado = palabra;
  }

  if (zonaDetectada && conocimientos.alias_zonas[zonaDetectada])
    zonaDetectada = conocimientos.alias_zonas[zonaDetectada];

  for (const [alias, destino] of Object.entries(conocimientos.alias_zonas))
    if (txt.includes(alias)) zonaDetectada = destino;

  let respuesta = "";

  if (zonaDetectada && problemaDetectado) {
    const mapa = conocimientos.problema_zona[zonaDetectada];
    if (mapa && mapa[problemaDetectado])
      respuesta = respuestaClinica(zonaDetectada, problemaDetectado, mapa[problemaDetectado], pidePrecio);
  } else if (zonaDetectada) {
    const mapa = conocimientos.problema_zona[zonaDetectada];
    if (mapa) {
      const primerProblema = Object.keys(mapa)[0];
      respuesta = respuestaClinica(zonaDetectada, primerProblema, mapa[primerProblema], pidePrecio);
    }
  } else if (coincide(txt, frases.sesiones)) {
    respuesta = "🕒 Los planes incluyen entre 6 y 10 sesiones según la zona y objetivo clínico.\n📊 Todos los tratamientos cuentan con seguimiento IA.";
  } else if (coincide(txt, frases.resultados)) {
    respuesta = "✨ Los resultados se aprecian desde las primeras sesiones y mejoran progresivamente con el seguimiento IA.";
  } else {
    respuesta = "🤍 No logré entender tu consulta, pero nuestras profesionales podrán orientarte durante tu evaluación gratuita.\nTu diagnóstico IA no tiene costo y te ayudará a definir el mejor plan según tus objetivos.";
  }

  registrarEvento(
    canal.toLowerCase() === "ig" ? "instagram" : "whatsapp",
    "usuario_local",
    mensaje,
    respuesta
  );

  return respuesta;
}

iniciarMonitor();
