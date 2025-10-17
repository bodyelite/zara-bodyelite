import fetch from "node-fetch";

export async function sendMessage(to, body) {
  const token = process.env.WHATSAPP_TOKEN; // corregido
  const phone_number_id = process.env.PHONE_NUMBER_ID;

  const url = `https://graph.facebook.com/v17.0/${phone_number_id}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Error al enviar mensaje:", data);
    } else {
      console.log(`✅ Mensaje enviado a ${to}: ${body.slice(0, 50)}...`);
    }
  } catch (err) {
    console.error("❌ Error de conexión con API WhatsApp:", err);
  }
}
