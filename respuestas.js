export function generarRespuesta(msg) {
  msg = msg.toLowerCase().trim();

  const zonas = {
    abdomen: "Lipo Reductiva",
    abdomenes: "Lipo Reductiva",
    barriga: "Lipo Reductiva",
    flancos: "Lipo Express",
    cintura: "Lipo Body Elite",
    gluteos: "Push Up",
    trasero: "Push Up",
    glúteos: "Push Up",
    piernas: "Body Fitness",
    brazos: "Body Tensor",
    rostro: "Face Elite",
    cara: "Face Elite",
    facial: "Face Elite"
  };

  const precios = {
    "Lipo Reductiva": "$480.000",
    "Lipo Express": "$432.000",
    "Lipo Body Elite": "$664.000",
    "Push Up": "$376.000",
    "Body Fitness": "$360.000",
    "Body Tensor": "$232.000",
    "Face Elite": "$358.400"
  };

  for (const [zona, plan] of Object.entries(zonas)) {
    if (msg.includes(zona)) {
      return `💡 Tratamiento recomendado: *${plan}*\n💰 Valor: ${precios[plan]}\n📅 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
    }
  }

  if (msg.includes("precio") || msg.includes("valor")) {
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito asistido con IA.";
  }
  if (msg.includes("direccion") || msg.includes("ubicacion") || msg.includes("peñalolén")) {
    return "📍 Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Lun–Vie 9:30–20:00 | Sáb 9:30–13:00.";
  }

  return null;
}
