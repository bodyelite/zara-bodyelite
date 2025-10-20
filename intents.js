const intents = [
  { tag: 'saludo', patterns: ['hola','buenas','hey','holaa','holis','buen día','buenas tardes'], response: 'saludo' },
  { tag: 'facial', patterns: ['facial','faciales','rostro','cara','piel','tratamiento facial','botox','relleno','ojeras','manchas','antiage'], response: 'facial' },
  { tag: 'corporal', patterns: ['corporal','cuerpo','abdomen','piernas','brazos','glúteos','espalda','muslos','trasero','cintura','reductor','modelar','moldear','flacidez','tonificar','celulitis'], response: 'lipo' },
  { tag: 'flacidez', patterns: ['flacidez','piel suelta','firmeza','tonificar','piel caída'], response: 'flacidez' },
  { tag: 'lipo', patterns: ['lipo','grasa','reducción','reductiva','cavitación','abdomen','cintura','espalda','glúteos','reducir grasa','disminuir','moldear'], response: 'lipo' },
  { tag: 'sesiones', patterns: ['sesión','sesiones','cuántas','duración','cuanto dura'], response: 'sesiones' },
  { tag: 'agendar', patterns: ['agendar','reserva','agenda','evaluación','cita','hora'], response: 'agendar' }
];
export default intents;
