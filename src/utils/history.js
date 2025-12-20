export const DB = {
    chats: {} 
};

export function guardarMensaje(id, nombre, plataforma, rol, texto, campana = null) {
    console.log(`[MEMORIA] Intentando guardar mensaje de ${nombre} (${rol})...`);
    
    if (!DB.chats[id]) {
        DB.chats[id] = {
            id: id,
            nombre: nombre || "Desconocido",
            plataforma: plataforma,
            campana: campana || "Orgánico",
            inicio: Date.now(),
            mensajes: []
        };
        console.log(`[MEMORIA] ✨ Nueva conversación creada para ID: ${id}`);
    }
    
    // Actualizar campaña si llega una nueva
    if (campana && DB.chats[id].campana === "Orgánico") {
        DB.chats[id].campana = campana;
    }

    DB.chats[id].mensajes.push({
        remite: rol, // 'user' o 'zara'
        texto: texto,
        fecha: Date.now()
    });
    
    console.log(`[MEMORIA] ✅ Mensaje guardado. Total mensajes en chat: ${DB.chats[id].mensajes.length}`);
}

export function obtenerChats() {
    const total = Object.keys(DB.chats).length;
    console.log(`[API MONITOR] Consultando DB... Hay ${total} chats activos.`);
    return DB.chats;
}
