import fetch from "node-fetch";

export async function sendMessage(to, text, platform) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const version = "v19.0";
    let url = platform === "whatsapp" 
      ? `https://graph.facebook.com/${version}/${process.env.PHONE_NUMBER_ID}/messages`
      : `https://graph.facebook.com/${version}/me/messages`;

    // AQUÍ ESTÁ EL TRUCO: "preview_url: false" apaga la tarjeta gigante
    let body = platform === "whatsapp"
      ? { 
          messaging_product: "whatsapp", 
          to, 
          type: "text", 
          text: { body: text, preview_url: false } 
        }
      : { recipient: { id: to }, message: { text } };

    await fetch(url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (error) { console.error("❌ Error Meta:", error); }
}
