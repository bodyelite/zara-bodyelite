import fs from 'fs';
import path from 'path';

const RENDER_PATH = '/opt/render/project/src/data';
const LOCAL_PATH = path.join(process.cwd(), 'data');
const DATA_DIR = fs.existsSync('/opt/render/project/src') ? RENDER_PATH : LOCAL_PATH;
const DB_FILE = path.join(DATA_DIR, 'chats_db.json');

if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

let memoryCache = {};

try {
    if (fs.existsSync(DB_FILE)) {
        memoryCache = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
} catch (e) { memoryCache = {}; }

export function leerDB() {
    return memoryCache;
}

export function guardarMensaje(id, nombre, texto, role, origen, nuevoEstado = null) {
    if (!memoryCache[id]) {
        memoryCache[id] = { 
            nombre: nombre || "Cliente", 
            origen: origen, 
            estado: "INICIO", 
            mensajes: [], 
            last_active: Date.now() 
        };
    }

    if (nombre && nombre !== "Visitante" && nombre !== "Cliente") {
        memoryCache[id].nombre = nombre;
    }
    
    if (nuevoEstado) memoryCache[id].estado = nuevoEstado;
    memoryCache[id].last_active = Date.now();

    memoryCache[id].mensajes.push({ 
        role, 
        content: texto, 
        timestamp: Date.now() 
    });
    
    if (memoryCache[id].mensajes.length > 40) memoryCache[id].mensajes.shift();

    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(memoryCache, null, 2));
    } catch (e) { console.error("Disk Error:", e.message); }

    return memoryCache[id].mensajes;
}
