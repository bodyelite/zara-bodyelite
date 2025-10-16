async function enviarMensaje(senderId, mensaje) {
  try {
    const texto = String(mensaje || "").trim() || " ";
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: senderId,
      text: { body: texto }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Mensaje enviado con cuerpo:", texto);
    console.log("Respuesta API:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}
