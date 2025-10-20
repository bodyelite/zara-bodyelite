const intents = [
  { tag: 'saludo', patterns: ['hola','buenas','hey','holaa','holis','buen día','buenas tardes'], response: 'saludo' },
  { tag: 'facial', patterns: ['facial','faciales','rostro','cara','piel','tratamiento facial'], response: 'facial' },
  { tag: 'corporal', patterns: ['corporal','cuerpo','abdomen','piernas','brazos','glúteos','tratamiento corporal'], response: 'corporal' },
  { tag: 'flacidez', patterns: ['flacidez','piel suelta','firmeza','tonificar','piel caída'], response: 'flacidez' },
  { tag: 'lipo', patterns: ['lipo','grasa','reducción','reductiva','cavitación','abdomen','cintura'], response: 'lipo' },
  { tag: 'sesiones', patterns: ['sesión','sesiones','cuántas','duración','cuanto dura'], response: 'sesiones' },
  { tag: 'agendar', patterns: ['agendar','reserva','agenda','evaluación','cita','hora'], response: 'agendar' }
];
export default intents;
