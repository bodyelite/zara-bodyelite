import fs from 'fs';
import path from 'path';

// RUTA MAGICA: Si estamos en Render, usar el disco montado. Si no, usar local.
const IS_RENDER = process.env.RENDER || false;
const DATA_DIR = IS_RENDER ? '/opt/render/project/src/data' : process.cwd();
const DB_FILE = path.join(DATA_DIR, 'chats_db.json');

// Asegurar que el directorio existe
if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

let memoryCache = {};

// Cargar al inicio
try {
    if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE);
        memoryCache = JSON.parse(raw);
    }
} catch (e) {
    console.error("DB Load Error:", e.message);
}

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

    if (nombre && nombre !== "Amiga WSP" && nombre !== "Usuario IG") {
        memoryCache[id].nombre = nombre;
    }
    
    if (nuevoEstado) memoryCache[id].estado = nuevoEstado;
    memoryCache[id].last_active = Date.now();

    memoryCache[id].mensajes.push({ role, content: texto, timestamp: Date.now() });
    
    // Limite historial
    if (memoryCache[id].mensajes.length > 60) memoryCache[id].mensajes.shift();

    // Guardar en disco (Asíncrono para no frenar la Web)
    try {
        fs.writeFile(DB_FILE, JSON.stringify(memoryCache, null, 2), () => {});
    } catch (e) {}

    return memoryCache[id].mensajes;
}
