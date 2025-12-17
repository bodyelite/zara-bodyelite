// Esta es la memoria central del Monitor.
export const chats = {};

export function registrarMensaje(id, nombre, mensaje, tipo, origen) {
    if (!chats[id]) {
        chats[id] = {
            nombre: nombre || "Desconocido",
            origen: origen, // 'wsp', 'ig', 'web'
            mensajes: []
        };
    }
    
    chats[id].mensajes.push({
        texto: mensaje,
        tipo: tipo, // 'usuario' o 'zara'
        timestamp: Date.now()
    });

    // Mantener solo los últimos 50 mensajes para no saturar la RAM
    if (chats[id].mensajes.length > 50) {
        chats[id].mensajes.shift();
    }
}
