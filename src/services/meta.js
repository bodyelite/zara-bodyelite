import fetch from "node-fetch";

export async function sendMessage(to, text, platform) {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;
    const url = platform === "whatsapp" 
        ? `https://graph.facebook.com/v19.0/${phoneId}/messages` 
        : `https://graph.facebook.com/v19.0/me/messages`;
        
    const body = platform === "whatsapp" 
        ? { messaging_product: "whatsapp", to, type: "text", text: { body: text } } 
        : { recipient: { id: to }, message: { text } };
        
    try {
        await fetch(url, { 
            method: "POST", 
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, 
            body: JSON.stringify(body) 
        });
    } catch (e) {
        console.error("Error enviando mensaje Meta:", e);
    }
}

// ESTA ES LA FUNCIÓN QUE APP.JS ESTABA BUSCANDO CON OTRO NOMBRE
export async function getIgUserInfo(userId) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const res = await fetch(`https://graph.facebook.com/v19.0/${userId}?fields=name&access_token=${token}`);
        const data = await res.json(); 
        return data.name || "Usuario IG";
    } catch (e) { 
        return "Usuario IG"; 
    }
}
