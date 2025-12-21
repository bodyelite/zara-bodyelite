import fs from 'fs';
import path from 'path';

let memoryCache = {};
const DB_PATH = path.join(process.cwd(), 'chats_db.json');

try {
    if (fs.existsSync(DB_PATH)) {
        memoryCache = JSON.parse(fs.readFileSync(DB_PATH));
    }
} catch (e) {}

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
    
    if (memoryCache[id].mensajes.length > 30) memoryCache[id].mensajes.shift();

    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(memoryCache, null, 2));
    } catch (e) {}

    return memoryCache[id].mensajes;
}
