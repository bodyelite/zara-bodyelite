// Esta es la memoria central del Monitor.
export const chats = {};

export function registrarMensaje(id, nombre, mensaje, tipo, origen) {
    // --- CHIVATO DE DEPURACIÓN ---
    console.log(`🧠 [DEBUG MEMORIA] Entrando datos -> ID: ${id} | Origen: ${origen} | Tipo: ${tipo}`);
    // -----------------------------

    if (!chats[id]) {
        chats[id] = {
            nombre: nombre || "Desconocido",
            origen: origen, // 'wsp', 'ig', 'web'
            mensajes: []
        };
        console.log(`✨ [DEBUG MEMORIA] Nuevo chat inicializado para: ${id}`);
    }
    
    chats[id].mensajes.push({
        texto: mensaje,
        tipo: tipo, // 'usuario' o 'zara'
        timestamp: Date.now()
    });
    
    console.log(`✅ [DEBUG MEMORIA] Mensaje guardado. Total mensajes en este chat: ${chats[id].mensajes.length}`);

    // Mantener solo los últimos 50 mensajes
    if (chats[id].mensajes.length > 50) {
        chats[id].mensajes.shift();
    }
    
    // --- CHIVATO FINAL: ESTADO GLOBAL ---
    console.log(`📊 [DEBUG GLOBAL] Total chats activos en memoria: ${Object.keys(chats).length}`);
}
