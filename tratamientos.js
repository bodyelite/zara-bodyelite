export const tratamientos = {
  corporales: [
    { plan: 'Lipo Focalizada Reductiva', objetivo: 'Disminuir adiposidad localizada mediante lipólisis no invasiva.', zonas: 'Abdomen, flancos, muslos.', tecnologias: 'Cavitación ultrasónica, Radiofrecuencia multipolar, Drenaje manual.', precio: 348800 },
    { plan: 'Lipo Express', objetivo: 'Reducción acelerada de perímetro y modelado.', zonas: 'Abdomen, cintura.', tecnologias: 'HIFU 12D, Cavitación, EMS Sculptor.', precio: 432000 },
    { plan: 'Lipo Reductiva', objetivo: 'Remodelar zonas amplias con exceso graso y flacidez asociada.', zonas: 'Abdomen, muslos, brazos.', tecnologias: 'HIFU 12D, Cavitación, Radiofrecuencia multipolar, EMS Sculptor.', precio: 480000 },
    { plan: 'Lipo Body Elite', objetivo: 'Protocolo integral: reducción, tensado y tonificación.', zonas: 'Abdomen, glúteos, piernas, brazos.', tecnologias: 'HIFU 12D + Cavitación + RF + EMS + Pink Glow Body.', precio: 664000 },
    { plan: 'Body Tensor', objetivo: 'Reafirmar tejido dérmico post-pérdida de peso o flacidez leve.', zonas: 'Abdomen, brazos, muslos.', tecnologias: 'Radiofrecuencia fraccionada, HIFU superficial.', precio: 232000 },
    { plan: 'Body Fitness', objetivo: 'Aumentar tono muscular y metabolismo basal.', zonas: 'Glúteos, abdomen, piernas.', tecnologias: 'EMS Sculptor + Radiofrecuencia.', precio: 360000 },
    { plan: 'Push Up', objetivo: 'Elevar y compactar glúteos, mejorar drenaje.', zonas: 'Glúteos.', tecnologias: 'EMS Sculptor + Cavitación focal + RF bipolar.', precio: 376000 }
  ],
  faciales: [
    { plan: 'Limpieza Facial Full', objetivo: 'Desobstruir poros, remover comedones, mejorar oxigenación tisular.', zonas: 'Rostro.', tecnologias: 'Peeling ultrasónico, alta frecuencia, máscara LED azul.', precio: 120000 },
    { plan: 'RF Facial', objetivo: 'Estimular neocolagénesis y mejorar firmeza dérmica.', zonas: 'Rostro, cuello.', tecnologias: 'Radiofrecuencia monopolar o fraccionada.', precio: 60000 },
    { plan: 'Face Light', objetivo: 'Restaurar luminosidad e hidratación superficial.', zonas: 'Rostro.', tecnologias: 'Peeling enzimático + RF suave + LED ámbar.', precio: 128800 },
    { plan: 'Face Smart', objetivo: 'Rejuvenecimiento inicial con efecto tensor.', zonas: 'Rostro y cuello.', tecnologias: 'RF + toxina cosmética tópica + LED roja.', precio: 198400 },
    { plan: 'Face Inicia', objetivo: 'Prevención anti-age en piel joven.', zonas: 'Rostro completo.', tecnologias: 'Pink Glow + RF + LED.', precio: 270400 },
    { plan: 'Face Antiage', objetivo: 'Reducir arrugas y mejorar densidad dérmica.', zonas: 'Rostro y cuello.', tecnologias: 'HIFU focal + RF profunda + toxina cosmética.', precio: 281600 },
    { plan: 'Face Elite', objetivo: 'Rejuvenecimiento integral y tensado completo.', zonas: 'Rostro, papada, cuello.', tecnologias: 'HIFU 12D + Pink Glow + RF multipolar + LED rojo + toxina cosmética.', precio: 358400 },
    { plan: 'Full Face', objetivo: 'Lifting facial completo sin cirugía.', zonas: 'Rostro completo.', tecnologias: 'HIFU 12D + RF + Pink Glow + LED.', precio: 584000 }
  ],
  mecanismos: {
    HIFU12D: 'Ultrasonido focalizado que actúa sobre fascia SMAS y grasa subcutánea.',
    Cavitacion: 'Presión alternante que rompe adipocitos.',
    Radiofrecuencia: 'Calor endógeno que estimula colágeno I–III.',
    EMSSculptor: 'Contracciones musculares supramáximas (20.000 en 30 min).',
    PinkGlow: 'Péptidos y antioxidantes para regeneración celular.',
    LEDTherapy: 'Fotobiomodulación: azul antibacteriano, rojo regenerador, ámbar estimulante.'
  }
};
export default tratamientos;
