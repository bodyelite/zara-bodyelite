import axios from 'axios';

export const sendMessage = async (to, message) => {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;
    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    await axios.post(url, payload, { headers });
    console.log('✅ Mensaje enviado correctamente a', to);
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error.response?.data || error.message);
  }
};

