import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleIncoming } from "./src/interpretador.js";
dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.get("/webhook",(req,res)=>{
  const verifyToken=process.env.VERIFY_TOKEN;
  const mode=req.query["hub.mode"];
  const token=req.query["hub.verify_token"];
  const challenge=req.query["hub.challenge"];
  if(mode&&token&&mode==="subscribe"&&token===verifyToken){res.status(200).send(challenge);}else{res.sendStatus(403);}
});
app.post("/webhook",async(req,res)=>{
  try{
    const entry=req.body.entry?.[0];
    const changes=entry?.changes?.[0];
    const message=changes?.value?.messages?.[0];
    if(message)await handleIncoming(message);
    res.sendStatus(200);
  }catch(err){
    console.error("Error en /webhook:",err);
    res.sendStatus(500);
  }
});
app.listen(PORT,()=>console.log("Zara Body Elite activa en puerto:",PORT));
