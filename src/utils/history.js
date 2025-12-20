// ALMACÉN DE CONVERSACIONES (En Memoria RAM)
export const DB = {
    chats: {} 
};

export function guardarMensaje(id, nombre, plataforma, rol, texto, campana = null) {
    if (!DB.chats[id]) {
        DB.chats[id] = {
            id: id,
            nombre: nombre || "Desconocido",
            plataforma: plataforma,
            campana: campana || "Orgánico",
            inicio: Date.now(),
            mensajes: []
        };
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
}

export function obtenerChats() {
    return DB.chats;
}
