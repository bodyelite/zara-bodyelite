import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// ================= CONFIG =================
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID   = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN      = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

// ================= IA RESPUESTAS =================
const respuestas = {
  bienvenida:"🌸 Hola, soy Zara IA de Body Elite. Estoy aquí para ayudarte a descubrir tu mejor versión ✨ ¿Qué zona te gustaría mejorar hoy?",
  facial:"💆‍♀️ Tratamientos faciales combinan HIFU focal, Radiofrecuencia y Pink Glow. Desde $120 000 CLP. Agenda 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  corporal:"🔥 Para grasa localizada y flacidez usamos HIFU 12D + Cavitación + RF + EMS Sculptor. Desde $348 800 CLP. Agenda gratis 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  gluteos:"🍑 PUSH UP con EMS Sculptor y RF. Resultados en 2 semanas. Desde $376 000 CLP. Agenda 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  toxina:"💉 Toxina Botulínica segura y efectiva. Incluye diagnóstico facial con IA. Agenda gratis 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  ubicacion:"📍 Av. Las Perdices 2990, Local 23, Peñalolén. Lun–Vie 09:30–20:00 / Sáb 09:30–13:00.",
  planes:"📋 Planes:\n- Lipo Body Elite $664 000 CLP\n- Push Up $376 000 CLP\n- Body Fitness $360 000 CLP\n- Face Elite $358 400 CLP\nTodos con evaluación gratuita.",
  desconocido:"No entendí bien, pero puedo orientarte en tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
};
const patrones = {
  facial:["arrugas","manchas","piel","hidratar","cara","antiage","papada"],
  corporal:["abdomen","grasa","flacidez","vientre","celulitis","cintura","piernas","brazos"],
  gluteos:["gluteo","glúteos","push up","levantar","trasero"],
  toxina:["botox","toxina","relleno","expresión"],
  ubicacion:["donde","peñalolén","horarios","dirección"],
  precios:["precio","valor","planes","cuesta"]
};
const match = (t, arr)=>arr.some(p=>t.includes(p.toLowerCase()));
function obtenerRespuesta(texto){
  const t=texto.toLowerCase();
  if(match(t,patrones.facial))return respuestas.facial;
  if(match(t,patrones.gluteos))return respuestas.gluteos;
  if(match(t,patrones.corporal))return respuestas.corporal;
  if(match(t,patrones.toxina))return respuestas.toxina;
  if(match(t,patrones.ubicacion))return respuestas.ubicacion;
  if(match(t,patrones.precios))return respuestas.planes;
  if(t.includes("hola")||t.includes("buenas"))return respuestas.bienvenida;
  return respuestas.desconocido;
}

// ================= SERVIDOR =================
const app = express();
app.use(bodyParser.json());
const LOG_WSP="logs_wsp.json";
const LOG_IG="logs_ig.json";
const loadJSON=f=>fs.existsSync(f)?fs.readFileSync(f,"utf8").split(",\n").filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean):[];

async function enviarMensaje(to,body){
  const url=`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers={"Content-Type":"application/json",Authorization:`Bearer ${PAGE_ACCESS_TOKEN}`};
  await fetch(url,{method:"POST",headers,body:JSON.stringify({messaging_product:"whatsapp",to,type:"text",text:{body}})});
}

// webhook meta
app.get("/webhook",(req,res)=>{
  const {["hub.mode"]:m,["hub.verify_token"]:t,["hub.challenge"]:c}=req.query;
  if(m==="subscribe"&&t===VERIFY_TOKEN)return res.status(200).send(c);
  res.sendStatus(403);
});
app.post("/webhook",async(req,res)=>{
  try{
    const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg||!msg.from||!msg.text)return res.sendStatus(200);
    const canal=req.body.entry?.[0]?.id?.includes("instagram")?"ig":"wsp";
    const phone=msg.from,texto=msg.text.body.trim();
    const respuesta=obtenerRespuesta(texto);
    const log={fecha:new Date().toISOString(),canal,phone,texto,respuesta,estado:"rojo"};
    fs.appendFileSync(canal==="ig"?LOG_IG:LOG_WSP,JSON.stringify(log)+",\n");
    await enviarMensaje(phone,respuesta);
    res.sendStatus(200);
  }catch(e){console.error(e);res.sendStatus(500);}
});

// endpoint reservo
app.post("/webhook/reserva_confirmada",(req,res)=>{
  try{
    const body=req.body||{};
    const phone=body.phone||"desconocido";
    const log={fecha:new Date().toISOString(),canal:"reservo",phone,estado:"verde"};
    fs.appendFileSync(LOG_WSP,JSON.stringify(log)+",\n");
    res.status(200).json({ok:true});
  }catch{res.status(500).json({ok:false});}
});

// ================= MONITOR =================
app.get("/",(req,res)=>{
  const wsp=loadJSON(LOG_WSP),ig=loadJSON(LOG_IG);
  const azul=ig.filter(x=>x.estado==="azul").length;
  const rojo=wsp.concat(ig).filter(x=>x.estado==="rojo").length;
  const amarillo=wsp.concat(ig).filter(x=>x.estado==="amarillo").length;
  const verde=wsp.concat(ig).filter(x=>x.estado==="verde").length;
  res.send(`
  <html><head><meta charset="utf8"/><title>Monitor Zara 2.1</title>
  <style>
  body{font-family:sans-serif;background:#f4f4f4;margin:0}
  h1{text-align:center;margin:10px;color:#1c3d5a}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px}
  .card{border-radius:12px;color:white;padding:20px;text-align:center;font-size:18px;font-weight:bold}
  .azul{background:#007bff}.rojo{background:#dc3545}.amarillo{background:#ffc107;color:#333}.verde{background:#28a745}
  iframe{width:100%;height:600px;border:0;border-radius:10px;margin-top:10px}
  </style></head><body>
  <h1>📊 Monitor Zara 2.1</h1>
  <div class="grid">
  <div class="card azul">Leads IG sin interacción (${azul})</div>
  <div class="card rojo">Leads activos sin reserva (${rojo})</div>
  <div class="card amarillo">Leads con link sin reserva (${amarillo})</div>
  <div class="card verde">Reservas confirmadas (${verde})</div>
  </div>
  <iframe src="https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"></iframe>
  <script>setTimeout(()=>location.reload(),10000)</script>
  </body></html>`);
});

// ================= START =================
app.listen(PORT,()=>console.log("✅ Zara 2.1 ejecutándose en puerto "+PORT));
