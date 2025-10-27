import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID   = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN      = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

// ---------- Funciones básicas ----------
const append = (file,obj)=>{
  fs.appendFileSync(file, JSON.stringify(obj)+",\n");
};
async function enviarMensaje(to,body){
  const url=`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers={"Content-Type":"application/json","Authorization":`Bearer ${PAGE_ACCESS_TOKEN}`};
  const data={messaging_product:"whatsapp",to,type:"text",text:{body}};
  await fetch(url,{method:"POST",headers,body:JSON.stringify(data)});
}

// ---------- Servidor ----------
const app = express();
app.use(bodyParser.json());

app.get("/webhook",(req,res)=>{
  const {["hub.mode"]:m,["hub.verify_token"]:t,["hub.challenge"]:c}=req.query;
  if(m==="subscribe" && t===VERIFY_TOKEN) return res.status(200).send(c);
  res.sendStatus(403);
});

// ---------- Webhook de mensajes ----------
app.post("/webhook",async(req,res)=>{
  try{
    const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg||!msg.from||!msg.text) return res.sendStatus(200);

    const canal=req.body.entry?.[0]?.id?.includes("instagram")?"ig":"wsp";
    const phone=msg.from;
    const texto=msg.text.body.trim().toLowerCase();

    const respuesta="Recibido ✅ (bloque 1/3 funcionando)";
    const log={fecha:new Date().toISOString(),canal,phone,texto,respuesta,estado:"rojo"};
    append(`logs_${canal}.json`,log);

    await enviarMensaje(phone,respuesta);
    res.sendStatus(200);
  }catch(e){console.error(e);res.sendStatus(500);}
});

// ---------- Endpoint Reservo ----------
app.post("/webhook/reserva_confirmada",(req,res)=>{
  try{
    const body=req.body||{};
    const phone=body.phone||"desconocido";
    append("logs_reservo.json",{fecha:new Date().toISOString(),canal:"reservo",phone,estado:"verde"});
    res.status(200).json({ok:true});
  }catch{res.status(500).json({ok:false});}
});

app.listen(PORT,()=>console.log("✅ Zara 2.1 – Servidor activo en puerto "+PORT));
