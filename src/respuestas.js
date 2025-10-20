export function obtenerRespuesta(texto){
  const msg=texto.toLowerCase();
  if(msg.includes("hola"))return "Hola 💙 Soy Zara, asistente IA de Body Elite. ¿Qué zona deseas mejorar hoy?";
  if(msg.includes("pierna")||msg.includes("abdomen")||msg.includes("gluteo"))
    return "Perfecto. Para esas zonas recomiendo *Lipo Body Elite* o *Push Up*, con HIFU 12D, Cavitación y EMS Sculptor. ¿Deseas agendar una evaluación gratuita?";
  if(msg.includes("cara")||msg.includes("rostro")||msg.includes("facial"))
    return "Podemos ayudarte con *Face Elite*, *Face Antiage* o *Limpieza Facial Full*. ¿Quieres conocer precios o agendar tu diagnóstico?";
  if(msg.includes("precio")||msg.includes("val"))
    return "Los precios van desde $120.000 (Faciales) hasta $664.000 (Corporales). Incluyen diagnóstico, aparatología avanzada y seguimiento.";
  if(msg.includes("agendar"))
    return "Reserva directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  return "Puedo orientarte sobre tratamientos corporales y faciales. ¿Qué zona deseas mejorar?";
}
