export const chats = {};

export function registrarMensaje(id, nombre, mensaje, tipo, origen) {
    if (!chats[id]) {
        chats[id] = {
            nombre: nombre || "Desconocido",
            origen: origen,
            mensajes: []
        };
    }
    chats[id].mensajes.push({
        texto: mensaje,
        tipo: tipo,
        timestamp: Date.now()
    });
    if (chats[id].mensajes.length > 50) chats[id].mensajes.shift();
}
