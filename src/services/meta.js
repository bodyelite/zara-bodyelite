import axios from "axios";

export async function sendMessage(to, text, platform = "whatsapp") {
  try {
    const url = `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`;
    await axios.post(url, {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
    }, {
      headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` }
    });
  } catch (e) {}
}

export async function getWhatsAppMediaUrl(mediaId) {
    try {
        const url = `https://graph.facebook.com/v21.0/${mediaId}`;
        const res = await axios.get(url, { 
            headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` } 
        });
        return res.data.url;
    } catch (e) { return null; }
}
