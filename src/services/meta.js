import fetch from "node-fetch";
import { NEGOCIO } from "../config/negocio.js";

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

export async function sendMessage(to, text, platform) {
    const url = platform === "whatsapp" 
        ? `https://graph.facebook.com/v19.0/${PHONE_ID}/messages` 
        : `https://graph.facebook.com/v19.0/me/messages`;
        
    const body = platform === "whatsapp" 
        ? { messaging_product: "whatsapp", recipient_type: "individual", to: to, type: "text", text: { body: text } } 
        : { recipient: { id: to }, message: { text: text } };
        
    try {
        await fetch(url, { 
            method: "POST", 
            headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" }, 
            body: JSON.stringify(body) 
        });
    } catch (e) {
        console.error("❌ Error enviando mensaje:", e);
    }
}

export async function getIgUserInfo(userId) {
    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${userId}?fields=name&access_token=${TOKEN}`);
        const data = await res.json(); 
        return data.name || "Amiga";
    } catch (e) { return "Amiga"; }
}

// ALERTA AL STAFF
export async function notifyStaff(cliente, mensaje, canal) {
    const staffNumbers = NEGOCIO.staff_alertas;
    const alerta = `🚨 *ALERTA ZARA* 🚨\nCliente: ${cliente}\nCanal: ${canal}\nDice: "${mensaje}"\n\n👉 ¡Atender rápido!`;
    console.log(`🔔 ALERTA STAFF`);
    for (const number of staffNumbers) {
        await sendMessage(number, alerta, "whatsapp");
    }
}
