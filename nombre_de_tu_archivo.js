const obtenerHorarios = (fecha) => {
    const dia = fecha.getDay();
    let horaCierre;
    const horaApertura = 10;

    // 0 = Domingo (Cerrado)
    if (dia === 0) return [];

    // Lunes (1), Miércoles (3), Viernes (5) -> 18:30
    if (dia === 1 || dia === 3 || dia === 5) {
        horaCierre = 18.5;
    } 
    // Martes (2), Jueves (4) -> 17:00
    else if (dia === 2 || dia === 4) {
        horaCierre = 17;
    } 
    // Sábado (6) -> 13:00
    else if (dia === 6) {
        horaCierre = 13;
    }

    let slots = [];
    for (let hora = horaApertura; hora < horaCierre; hora += 0.5) {
        if (hora + 0.5 <= horaCierre) {
            const horas = Math.floor(hora);
            const minutos = (hora % 1) * 60;
            const horaFormato = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            slots.push(horaFormato);
        }
    }
    return slots;
};

// Si usas CommonJS, exportalo:
module.exports = { obtenerHorarios };
