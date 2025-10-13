// knowledge.js
// Motor de conocimiento clínico Body Elite

import fs from "fs";

let base = {};
try {
  base = JSON.parse(fs.readFileSync("base_conocimiento_clinico.json", "utf8"));
} catch {
  console.error("⚠️ No se pudo cargar base_conocimiento_clinico.json");
}

export function buscarTratamiento(texto) {
  const t = base.tratamientos;
  const match = Object.keys(t).find((k) => texto.toLowerCase().includes(k.toLowerCase().split(" ")[0]));
  return match ? { nombre: match, ...t[match] } : null;
}

export function respuestaClinica(tratamiento, extendida = false) {
  if (!tratamiento) return null;
  const base = `✨ ${tratamiento.nombre}: ${tratamiento.descripcion}`;
  if (!extendida)
    return `${base}\n💸 ${tratamiento.precio.toLocaleString("es-CL")} CLP | ${tratamiento.sesiones} sesiones aprox.\nAgenda tu evaluación gratuita para definir tu plan ideal.`;
  return `${base}\n\n📋 Detalles clínicos:\n- Duración: ${tratamiento.duracion}\n- Aparatología: ${tratamiento.aparatologia}\n- Experiencia del paciente: ${tratamiento.experiencia}\n\n💸 Valor: ${tratamiento.precio.toLocaleString(
    "es-CL"
  )} CLP (${tratamiento.sesiones} sesiones).\nAgenda aquí para tu evaluación personalizada.`;
}
