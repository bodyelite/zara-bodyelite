import tratamientos from './tratamientos.js';

const LINK_AGENDA = 'https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9';

export function obtenerRespuesta(texto) {
  const t = texto.toLowerCase();

  const buscar = (planes) => {
    return planes.find(p =>
      t.includes(p.plan.toLowerCase().split(' ')[0]) ||
      t.includes(p.plan.toLowerCase().split(' ')[1])
    );
  };

  const corporal = buscar(tratamientos.corporales);
  const facial = buscar(tratamientos.faciales);

  if (corporal) {
    return ;
  }

  if (facial) {
    return ;
  }

  return ;
}

