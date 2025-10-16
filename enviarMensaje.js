async function enviarMensaje(senderId, mensaje) {
  try {
    const texto = String(mensaje || "").trim() || " ";
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: senderId,
      type: "text",
      text: {
        preview_url: false,
        body: texto
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Mensaje enviado con texto:", texto);
    console.log("Respuesta de Meta:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}
