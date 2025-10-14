export function generarDescripcion(tipo) {
  if (tipo === "facial") {
    return "💆‍♀️ *Tratamientos Faciales Body Elite* combinan HIFU, Radiofrecuencia y Toxina Botulínica para mejorar firmeza, arrugas y luminosidad. Desde $281.600 (6 sesiones).";
  }
  if (tipo === "corporal") {
    return "🔥 *Lipo Focalizada Reductiva* reduce grasa localizada y mejora firmeza combinando Cavitación, RF y EMS Sculptor. Resultados visibles desde la 3ª sesión.";
  }
  return "Ofrecemos tratamientos personalizados con tecnología estética avanzada para rostro y cuerpo.";
}
