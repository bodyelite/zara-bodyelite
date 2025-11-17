export async function procesarMensaje(texto, platform) {
  if (!texto) return "¿Podrías repetirlo?";

  const t = texto.toLowerCase().trim();

  if (t === "hola" || t.startsWith("hola")) {
    return (
      "Hola, soy Zara de Body Elite. ¿Quieres que revisemos tu caso para recomendarte el mejor plan? " +
      "Agenda tu diagnóstico gratuito:\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    );
  }

  if (t.includes("push")) {
    return (
      "El Push Up levanta y da volumen al glúteo con Pro Sculpt, HIFU 12D y Radiofrecuencia.\n" +
      "Agenda tu diagnóstico gratuito aquí:\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    );
  }

  if (t.includes("lipo express")) {
    return (
      "La Lipo Express reduce grasa localizada con Cavitación, Radiofrecuencia y HIFU 12D.\n" +
      "Reserva tu diagnóstico gratuito para ver cuántas sesiones necesitas:\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    );
  }

  if (t.includes("depil")) {
    return (
      "Trabajamos con láser diodo DL900, rápido y seguro.\n" +
      "Agenda tu diagnóstico:\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    );
  }

  return (
    "Puedo ayudarte a elegir el plan ideal según tu objetivo. ¿Qué zona quieres trabajar?\n" +
    "Reserva tu diagnóstico gratuito aquí:\n" +
    "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  );
}
