// ALMACÉN DE CONVERSACIONES
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
            estado: 'COLD', // Estado inicial
            inicio: Date.now(),
            mensajes: []
        };
    }
    if (campana && DB.chats[id].campana === "Orgánico") {
        DB.chats[id].campana = campana;
    }
    DB.chats[id].mensajes.push({
        remite: rol,
        texto: texto,
        fecha: Date.now()
    });
}

// Nueva función para actualizar la temperatura del cliente
export function actualizarEstado(id, nuevoEstado) {
    if (DB.chats[id]) {
        DB.chats[id].estado = nuevoEstado;
    }
}

export function obtenerChats() { return DB.chats; }
