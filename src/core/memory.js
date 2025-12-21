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

    // Actualizar nombre si no es Anónimo
    if (nombre && nombre !== "Amiga WSP" && nombre !== "Usuario IG") {
        memoryCache[id].nombre = nombre;
    }
    
    if (nuevoEstado) memoryCache[id].estado = nuevoEstado;
    memoryCache[id].last_active = Date.now();

    memoryCache[id].mensajes.push({ role, content: texto, timestamp: Date.now() });
    
    // Mantener historial corto en RAM
    if (memoryCache[id].mensajes.length > 40) memoryCache[id].mensajes.shift();

    return memoryCache[id].mensajes;
}
