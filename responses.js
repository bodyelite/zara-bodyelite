export function obtenerRespuesta(texto) {
  if (!texto) return '💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.';

  const t = texto.toLowerCase();

  if (t.includes('celulitis')) {
    return '💧 Para celulitis recomendamos *Lipo Reductiva* o *Lipo Body Elite*. Combinan cavitación y radiofrecuencia para romper grasa, mejorar firmeza y drenaje. 💰 Desde $480.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (t.includes('flacidez')) {
    return '💧 El tratamiento ideal para flacidez es *Body Tensor* o *Body Elite*. Usan radiofrecuencia fraccionada y HIFU superficial para tensar la piel. 💰 Desde $232.000. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (t.includes('arrugas') || t.includes('líneas')) {
    return '✨ Para arrugas recomendamos *Face Antiage* o *Face Elite*, que combinan HIFU 12D, radiofrecuencia y Pink Glow. 💰 Desde $281.600. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  if (t.includes('precio') || t.includes('vale') || t.includes('cuesta')) {
    return '💰 Nuestros planes van desde $60.000 a $664.000 según el tratamiento. 📅 Agenda tu diagnóstico gratuito para definir el ideal 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
  }

  return '💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';
}
