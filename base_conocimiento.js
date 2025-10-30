const baseConocimiento = [
  {
    activador: "face smart",
    plan: "Face Smart",
    detalle: `**Tratamiento:** Face Smart
**Objetivo:** Reafirmar piel facial, estimular colágeno y mejorar textura.
**Tecnologías:** Radiofrecuencia fraccionada + LED terapéutico + activos antioxidantes.
**Duración por sesión:** 45 min.
**Frecuencia:** 1 vez por semana.
**Sesiones:** 6–8.
**Zonas tratables:** rostro completo y cuello.
**Resultados esperados:** piel más firme, luminosa y con poros reducidos.
**Registro fotográfico:** antes y después (sesión 1 y 6).
**Valor referencial:** $198.400 (sujeto a evaluación).`
  },
  {
    activador: "face antiage",
    plan: "Face Antiage",
    detalle: `**Tratamiento:** Face Antiage
**Objetivo:** Tratar arrugas finas, flacidez media y piel apagada.
**Tecnologías:** Radiofrecuencia fraccionada + HIFU 12D + activos tensores.
**Duración:** 60 min.
**Frecuencia:** 1 por semana.
**Sesiones:** 6–8.
**Resultados esperados:** lifting progresivo, mejora del tono y elasticidad.
**Registro fotográfico:** antes, sesión 4 y final.
**Valor referencial:** $281.600 (sujeto a evaluación).`
  },
  {
    activador: "face elite",
    plan: "Face Elite",
    detalle: `**Tratamiento:** Face Elite
**Objetivo:** Lifting facial sin cirugía.
**Tecnologías:** HIFU 12D + Radiofrecuencia fraccionada + Toxina Botulínica.
**Duración:** 60 min.
**Frecuencia:** 1 vez por semana.
**Sesiones:** 6.
**Zonas tratables:** rostro completo, cuello, contorno mandibular.
**Resultados esperados:** tensado SMAS, contorno definido, piel firme y luminosa.
**Registro fotográfico:** antes / después + control sesión 3.
**Valor referencial:** $358.400 (sujeto a evaluación).`
  },
  {
    activador: "full face",
    plan: "Full Face",
    detalle: `**Tratamiento:** Full Face
**Objetivo:** Renovación facial integral.
**Tecnologías:** HIFU 12D + RF + LED + Toxina Botulínica + Pink Glow.
**Duración:** 90 min.
**Frecuencia:** 1 cada 10 días.
**Sesiones:** 6–8.
**Resultados esperados:** lifting completo, mejor textura e hidratación profunda.
**Registro fotográfico:** antes / durante / después.
**Valor referencial:** $584.000 (sujeto a evaluación).`
  },
  {
    activador: "limpieza facial",
    plan: "Limpieza Facial Full",
    detalle: `**Tratamiento:** Limpieza Facial Full
**Objetivo:** Higienizar y oxigenar la piel grasa o mixta.
**Tecnologías:** Ultrasonido + extracción manual + LED antibacteriano.
**Duración:** 45 min.
**Frecuencia:** cada 10–15 días.
**Sesiones:** 6.
**Resultados esperados:** piel limpia, equilibrada y renovada.
**Valor referencial:** $120.000 (sujeto a evaluación).`
  },
  {
    activador: "lipo reductiva",
    plan: "Lipo Reductiva",
    detalle: `**Tratamiento:** Lipo Reductiva
**Objetivo:** Reducir grasa localizada y reafirmar piel.
**Tecnologías:** Cavitación + RF + EMS Sculptor + Drenaje.
**Duración:** 75 min.
**Frecuencia:** 2 por semana.
**Sesiones:** 8–10.
**Resultados esperados:** reducción de centímetros y mejora del contorno.
**Registro fotográfico:** inicio / sesión 5 / final.
**Valor referencial:** $480.000 (sujeto a evaluación).`
  },
  {
    activador: "lipo express",
    plan: "Lipo Express",
    detalle: `**Tratamiento:** Lipo Express
**Objetivo:** Reducir grasa rebelde rápidamente.
**Tecnologías:** Cavitación + RF + Vacumterapia.
**Duración:** 60 min.
**Frecuencia:** 2 por semana.
**Sesiones:** 6–8.
**Resultados esperados:** contorno más definido y reducción visible desde la 2ª sesión.
**Valor referencial:** $432.000 (sujeto a evaluación).`
  },
  {
    activador: "body tensor",
    plan: "Body Tensor",
    detalle: `**Tratamiento:** Body Tensor
**Objetivo:** Reafirmar tejido en brazos, abdomen o muslos.
**Tecnologías:** RF dual + EMS Sculptor.
**Duración:** 60 min.
**Frecuencia:** 2 por semana.
**Sesiones:** 6–8.
**Resultados esperados:** piel más tensa y tonificada.
**Valor referencial:** $232.000 (sujeto a evaluación).`
  },
  {
    activador: "body fitness",
    plan: "Body Fitness",
    detalle: `**Tratamiento:** Body Fitness
**Objetivo:** Tonificar músculo y reducir flacidez general.
**Tecnologías:** EMS Sculptor + RF.
**Duración:** 45 min.
**Frecuencia:** 2 por semana.
**Sesiones:** 8.
**Resultados esperados:** músculos más definidos y piel firme.
**Valor referencial:** $360.000 (sujeto a evaluación).`
  },
  {
    activador: "push up",
    plan: "Push Up Glúteo",
    detalle: `**Tratamiento:** Push Up Glúteo
**Objetivo:** Elevar y dar volumen natural al glúteo.
**Tecnologías:** EMS Sculptor + RF + HIFU focal.
**Duración:** 60 min.
**Frecuencia:** 2 por semana.
**Sesiones:** 8–10.
**Resultados esperados:** efecto push up visible desde la 2ª semana.
**Valor referencial:** $376.000 (sujeto a evaluación).`
  },
  {
    activador: "pink glow",
    plan: "Pink Glow",
    detalle: `**Tratamiento:** Pink Glow
**Objetivo:** Rejuvenecer piel facial mediante péptidos y vitaminas.
**Tecnologías:** Mesoterapia virtual + LED roja + RF suave.
**Duración:** 40 min.
**Frecuencia:** 1 por semana.
**Sesiones:** 6.
**Resultados esperados:** piel hidratada, uniforme y luminosa.
**Valor referencial:** $180.000 (sujeto a evaluación).`
  },
  {
    activador: "toxina",
    plan: "Toxina Botulínica Facial",
    detalle: `**Tratamiento:** Toxina Botulínica Facial
**Objetivo:** Relajar músculos de expresión y suavizar arrugas.
**Zonas frecuentes:** frente, entrecejo, patas de gallo.
**Dosis promedio:** 25–40 U según zona.
**Duración del efecto:** 4–6 meses.
**Combinación:** puede aplicarse junto a Face Elite o Full Face.
**Valor referencial:** desde $180.000 (sujeto a evaluación).`
  }
];

export default baseConocimiento;
