import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const token=process.env.PAGE_ACCESS_TOKEN;
const phoneId=process.env.PHONE_NUMBER_ID;
export async function sendMessage(to,text){
  try{
    await axios.post(`https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {messaging_product:"whatsapp",to,type:"text",text:{body:text}},
      {headers:{Authorization:`Bearer ${token}`}}
    );
  }catch(err){
    console.error("Error enviando mensaje:",err.response?.data||err.message);
  }
}
