// ZARA MOTOR COMPLETO BODY ELITE - PARTE 1/2
// motor_respuesta_v3.js

import fs from "fs";

const MEMORIA_PATH = "./memoria_usuarios.json";

function cargarMemoria() {
  try {
    return JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
  } catch (e) {
    return {};
  }
}

function guardarMemoria(memoria) {
  fs.writeFileSync(MEMORIA_PATH, JSON.stringify(memoria, null, 2));
}

let memoria = cargarMemoria();

function CTA() {
  return "Agenda tu diagnostico gratuito aqui:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0NrxU8d7W64x5t2S6L4h9";
}

export function procesarMensaje(texto, numero) {
  if (!texto) return "";

  const t = texto.toLowerCase().trim();

  if (!memoria[numero]) {
    memoria[numero] = { links: 0, llamo: false };
  }

  const state = memoria[numero];

  function ctaControlado() {
    state.links++;
    guardarMemoria(memoria);

    if (state.links <= 3) {
      return CTA();
    }

    if (state.links === 4) {
      return CTA() + "\n\nSi prefieres, tambien podemos llamarte en horario laboral. Quieres que te llamemos?";
    }

    if (state.links > 4) {
      return "Quieres que te llamemos? Solo dime si.";
    }
  }

  if (/^si$|llamame|llamar|si quiero/.test(t)) {
    state.llamo = true;
    guardarMemoria(memoria);
    return "Perfecto. Indica tu numero (o confirma si es este mismo) y lo derivare al equipo para llamarte dentro del horario laboral.";
  }

  if (/^\+?56|9\d{7,8}/.test(t)) {
    state.llamo = true;
    guardarMemoria(memoria);
    return "Perfecto, derivare tu numero al equipo. Te contactaran dentro del horario laboral.";
  }

  if (/hola|holi|buenas|wenas|hello|ola/.test(t)) {
    return "Hola, soy Zara de Body Elite. En que zona te gustaria mejorar? abdomen, gluteos, piernas, brazos, papada o rostro.";
  }

  if (t.includes("lipo express") || t.includes("lipoexpress")) {
    return "Lipo Express reduce abdomen, cintura y espalda con HIFU 12D, cavitacion y radiofrecuencia compactante.\n" +
      "Ideal para grasa localizada y contorno.\n\n" +
      ctaControlado();
  }

  if (t.includes("push up") || t.includes("pushup")) {
    return "El Push Up de gluteos levanta, da forma y reafirma usando Pro Sculpt, HIFU 12D y radiofrecuencia compactante.\n\n" +
      ctaControlado();
  }

  if (t.includes("body fitness")) {
    return "Body Fitness trabaja abdomen, cintura y gluteos con Pro Sculpt, HIFU y radiofrecuencia profunda.\n\n" +
      ctaControlado();
  }

  if (/abdomen|guata|panza|barriga|rollos|estomago|estomago/.test(t)) {
    return "Para abdomen usamos Lipo Express, combinando HIFU 12D, cavitacion y radiofrecuencia profunda.\n\n" +
      ctaControlado();
  }

  if (/gluteo|gluteos|poto|cola|trasero/.test(t)) {
    return "Para gluteos usamos Push Up, que levanta, reafirma y da forma mediante Pro Sculpt, HIFU 12D y radiofrecuencia.\n\n" +
      ctaControlado();
  }

  if (/piernas|muslos|cartuchera|muslo/.test(t)) {
    return "Para piernas y muslos usamos HIFU 12D, cavitacion y radiofrecuencia profunda, ideal para firmeza y reduccion.\n\n" +
      ctaControlado();
  }

  if (/brazo|brazos|alas de murcielago/.test(t)) {
    return "Para brazos usamos radiofrecuencia profunda y cavitacion focalizada.\n\n" +
      ctaControlado();
  }

  if (/papada|menton/.test(t)) {
    return "Para papada trabajamos con HIFU 12D y radiofrecuencia compactante.\n\n" +
      ctaControlado();
  }

  if (/rostro|cara|arrugas|lineas|lineas finas|patas de gallo/.test(t)) {
    return "Para rostro tenemos tratamientos tensores y antiarrugas: HIFU facial, radiofrecuencia y toxina antiarrugas.\n" +
      "Que zona del rostro te gustaria mejorar?";
  }

  if (/botox|toxina|antiarrugas/.test(t)) {
    return "Si, realizamos toxina antiarrugas para entrecejo, frente, patas de gallo y otras areas faciales.\n" +
      "El efecto dura entre 4 y 6 meses.\n\n" +
      ctaControlado();
  }

  if (/duele|dolor|molesta/.test(t)) {
    return "No duele. Puedes sentir calor o vibracion segun la tecnologia, pero es totalmente soportable y sin tiempo de recuperacion.\n\n" +
      ctaControlado();
  }
// BLOQUE 2 - CONTINUACION DEL MOTOR COMPLETO

  if (/precio|vale|valor|caro|costo/.test(t)) {
    return "Los valores dependen del tratamiento y de cuantas sesiones necesites. " +
      "En el diagnostico gratuito te entregamos un valor exacto para tu caso.\n\n" +
      ctaControlado();
  }

  if (/cuant|cuant|cuantas|cuantos|sesiones/.test(t)) {
    return "Las sesiones dependen de tu punto de partida y objetivo. " +
      "En el diagnostico gratuito te indicamos la cantidad exacta.\n\n" +
      ctaControlado();
  }

  if (/sirve|funciona|resultados/.test(t)) {
    return "Si, funcionan muy bien cuando se aplica la tecnologia correcta para tu caso. " +
      "Por eso realizamos evaluacion previa.\n\n" +
      ctaControlado();
  }

  if (/donde|ubicad|direccion/.test(t)) {
    return "Estamos en: Av. Apoquindo 3990, Las Condes. " +
      "A pasos del Metro Escuela Militar.\n\n" +
      ctaControlado();
  }

  if (/fibrosis/.test(t)) {
    return "Para fibrosis usamos radiofrecuencia profunda y tecnicas especificas de ablandamiento tisular. " +
      "En muchos casos se combina con cavitacion segun la resistencia del tejido.\n\n" +
      ctaControlado();
  }

  if (/flacidez/.test(t)) {
    return "Para flacidez trabajamos con radiofrecuencia profunda, HIFU 12D y combinaciones segun zona. " +
      "Es ideal para abdomen, brazos, piernas y rostro.\n\n" +
      ctaControlado();
  }

  if (/hifu/.test(t) && !t.includes("lipo express") && !t.includes("push") && !t.includes("body fitness")) {
    return "HIFU 12D es un ultrasonido focalizado que reduce grasa o tensa la piel segun el cabezal utilizado. " +
      "En cuerpo se usa para abdomen, cintura y muslos. En rostro se usa para lifting no invasivo.\n\n" +
      ctaControlado();
  }

  if (/cavitacion|cavitado|cavita/.test(t)) {
    return "La cavitacion ayuda a romper grasa localizada mediante ultrasonido. " +
      "Es ideal para abdomen, muslos y brazos y se combina con radiofrecuencia.\n\n" +
      ctaControlado();
  }

  if (/radiofrecuencia|rf/.test(t) && !t.includes("fraccionada")) {
    return "La radiofrecuencia profunda ayuda a tensar, reafirmar y compactar el tejido. " +
      "Se usa tanto en rostro como en cuerpo.\n\n" +
      ctaControlado();
  }

  if (/pro sculpt|prosculpt|ems|contracciones/.test(t)) {
    return "Pro Sculpt (EMS) genera hasta 20000 contracciones musculares en 30 minutos. " +
      "Sirve para tonificar abdomen, gluteos, brazos y piernas.\n\n" +
      ctaControlado();
  }

  if (/pink glow|glow/.test(t)) {
    return "Pink Glow es un tratamiento de luminosidad y mejora de textura que puede aplicarse sin agujas. " +
      "Mejora hidratacion, tono y apariencia general del rostro.\n\n" +
      ctaControlado();
  }

  if (/exosoma|exosomas/.test(t)) {
    return "Los exosomas ayudan a la regeneracion celular, mejorando textura, luminosidad y recuperacion de la piel.\n\n" +
      ctaControlado();
  }

  if (/lipo litico|lipolitico|lipoliticos/.test(t)) {
    return "Los lipo liticos ayudan a reducir grasa localizada en zonas especificas. " +
      "Se indican segun caso en el diagnostico.\n\n" +
      ctaControlado();
  }

  if (/face smart/.test(t)) {
    return "Face Smart combina tecnologias de tensado facial, iluminacion y mejora de textura. " +
      "Proporciona un efecto lifting rapido y sin dolor.\n\n" +
      ctaControlado();
  }

  if (/face elite/.test(t)) {
    return "Face Elite es el plan facial completo que incluye lifting, tensado, definicion y mejora de arrugas. " +
      "Combina HIFU facial, radiofrecuencia y otros protocolos segun tu caso.\n\n" +
      ctaControlado();
  }

  if (/laser|depilacion|depilacion laser|depilar/.test(t)) {
    return "Realizamos depilacion laser SHR, apta para todo tipo de piel. " +
      "Es rapida, efectiva y sin dolor.\n\n" +
      ctaControlado();
  }

  return "Puedo ayudarte, solo dime que zona deseas mejorar: abdomen, gluteos, piernas, brazos, papada o rostro.\n\n" +
    ctaControlado();
}
