import fs from "fs";

// ---------- Archivos de logs ----------
const wspFile="logs_wsp.json";
const igFile="logs_ig.json";
const reservoFile="logs_reservo.json";

const respuestas={
  bienvenida:"🌸 Hola, soy Zara IA de Body Elite. Estoy aquí para ayudarte a descubrir tu mejor versión ✨ ¿Qué zona te gustaría mejorar hoy?",
  facial:"💆‍♀️ Tratamientos faciales combinan HIFU focal, Radiofrecuencia y Pink Glow. Desde $120 000 CLP.",
  corporal:"🔥 Para grasa localizada y flacidez usamos HIFU 12D + Cavitación + RF + EMS Sculptor. Desde $348 800 CLP.",
  gluteos:"🍑 PUSH UP con EMS Sculptor y RF. Resultados en 2 semanas.",
  toxina:"💉 Toxina Botulínica segura y efectiva.",
  ubicacion:"📍 Av. Las Perdices 2990, Local 23, Peñalolén.",
  precios:"📋 Planes desde $120 000 CLP con evaluación gratuita.",
  desconocido:"No entendí bien, pero puedo orientarte en tu evaluación gratuita asistida con IA."
};

const patrones={
  facial:["arrugas","manchas","piel","hidratar","cara","antiage","papada"],
  corporal:["abdomen","grasa","flacidez","vientre","celulitis","cintura","piernas","brazos"],
  gluteos:["gluteo","glúteos","push up","levantar","trasero"],
  toxina:["botox","toxina","relleno","expresión"],
  ubicacion:["donde","peñalolén","horarios","dirección"],
  precios:["precio","valor","planes","cuesta"]
};

const match=(t,a)=>a.some(p=>t.includes(p));
export function obtenerRespuesta(t){
  const s=t.toLowerCase();
  if(match(s,patrones.facial))return respuestas.facial;
  if(match(s,patrones.gluteos))return respuestas.gluteos;
  if(match(s,patrones.corporal))return respuestas.corporal;
  if(match(s,patrones.toxina))return respuestas.toxina;
  if(match(s,patrones.ubicacion))return respuestas.ubicacion;
  if(match(s,patrones.precios))return respuestas.precios;
  if(s.includes("hola")||s.includes("buenas"))return respuestas.bienvenida;
  return respuestas.desconocido;
}

// ---------- Cargar logs y clasificar ----------
export function leerLogs(){
  const parseFile=f=>fs.existsSync(f)?fs.readFileSync(f,"utf8")
      .split(",\n").filter(Boolean).map(l=>{try{return JSON.parse(l);}catch{return null;}}).filter(Boolean):[];
  const wsp=parseFile(wspFile);
  const ig=parseFile(igFile);
  const res=parseFile(reservoFile);

  const leads={azul:0,rojo:0,amarillo:0,verde:0};
  ig.forEach(m=>{if(m.estado==="azul")leads.azul++;});
  wsp.concat(ig).forEach(m=>{if(m.estado==="rojo")leads.rojo++;});
  wsp.concat(ig).forEach(m=>{if(m.estado==="amarillo")leads.amarillo++;});
  res.forEach(m=>{if(m.estado==="verde")leads.verde++;});
  return {wsp,ig,res,leads};
}

// ---------- Actualizar estado según contenido ----------
export function actualizarEstado(){
  try{
    const wsp=fs.existsSync(wspFile)?fs.readFileSync(wspFile,"utf8"):"";
    const ig =fs.existsSync(igFile)?fs.readFileSync(igFile,"utf8"):"";
    const all=wsp+ig;
    const lines=all.split(",\n").filter(Boolean);
    let azul=0,rojo=0,amarillo=0,verde=0;
    lines.forEach(line=>{
      try{
        const m=JSON.parse(line);
        if(m.canal==="ig"&&!m.respuesta)azul++;
        else if(m.estado==="rojo")rojo++;
        else if(m.estado==="amarillo")amarillo++;
        else if(m.estado==="verde")verde++;
      }catch{}
    });
    return {azul,rojo,amarillo,verde};
  }catch{return {azul:0,rojo:0,amarillo:0,verde:0};}
}
