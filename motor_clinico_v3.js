// motor_clinico_v3.js — versión estable limpia

export function clasificarPlan(mensajeUsuario) {
  if (!mensajeUsuario || typeof mensajeUsuario !== "string") return "general"
  const texto = mensajeUsuario.toLowerCase()

  const patrones = {
    botox: /(botox|toxina|arruga|frente|patas de gallo|expresion)/,
    flacidez: /(flacidez|piel suelta|tensar|firmeza|lifting)/,
    grasa: /(grasa|abdomen|cintura|lipo|celulitis|reductiva)/,
    limpieza: /(limpieza|facial|poros|impurezas|blackheads|puntos negros)/
  }

  for (const [plan, regex] of Object.entries(patrones)) {
    if (regex.test(texto)) return plan
  }

  return "general"
}

export function generarRespuestaClinica(input) {
  if (!input || typeof input !== "string") return "Por favor indícanos qué deseas mejorar."

  const plan = clasificarPlan(input)
  switch (plan) {
    case "botox":
      return "Para expresión facial y arrugas dinámicas recomendamos *FACE ELITE* o *FULL FACE*, que integran HIFU 12D + Radiofrecuencia + Pink Glow + Toxina Botulínica. Actúan sobre la fascia y líneas de expresión mejorando firmeza y textura. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    case "flacidez":
      return "El tratamiento ideal es *BODY TENSOR* o *FACE ANTIAGE*, que trabajan con HIFU 12D + Radiofrecuencia para estimular colágeno y firmeza. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    case "grasa":
      return "Nuestro tratamiento indicado es *LIPO BODY ELITE*, con HIFU 12D + Cavitación + EMS Sculptor. Reduce grasa localizada, reafirma y moldea sin cirugía. Incluye 12 sesiones. Valor $664.000. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    case "limpieza":
      return "Recomendamos *LIMPIEZA FACIAL FULL*, que combina exfoliación, extracción profunda, alta frecuencia y mascarilla LED. Ideal para piel grasa o con poros dilatados. Valor $120.000. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    default:
      return "Podemos ayudarte a elegir el tratamiento más adecuado según tu objetivo corporal o facial. Agenda una evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  }
}
