let memoryCache = {};

export function leerDB() {
    return memoryCache;
}

export function guardarMensaje(id, nombre, texto, role, origen, nuevoEstado = null) {
    if (!memoryCache[id]) {
        memoryCache[id] = { 
            nombre: nombre || "Anónimo", 
            origen: origen, 
            estado: "LEAD", 
            mensajes: [], 
            last_active: Date.now() 
        };
    }
    if (nombre && memoryCache[id].nombre === "Anónimo") memoryCache[id].nombre = nombre;
    if (nuevoEstado) memoryCache[id].estado = nuevoEstado;
    memoryCache[id].last_active = Date.now();
    
    memoryCache[id].mensajes.push({ role, content: texto, timestamp: Date.now() });
    return memoryCache[id].mensajes;
}
