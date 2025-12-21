import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'chats_db.json');

if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));

export function leerDB() {
    try { return JSON.parse(fs.readFileSync(DB_PATH)); } catch { return {}; }
}

export function guardarMensaje(id, nombre, texto, role, origen, nuevoEstado = null) {
    const db = leerDB();
    
    if (!db[id]) {
        db[id] = { 
            nombre: nombre || "Anónimo", 
            origen: origen, 
            estado: "LEAD", 
            mensajes: [], 
            last_active: Date.now() 
        };
    }

    if (nombre && db[id].nombre === "Anónimo") db[id].nombre = nombre;
    if (nuevoEstado) db[id].estado = nuevoEstado;
    db[id].last_active = Date.now();

    db[id].mensajes.push({ role, content: texto, timestamp: Date.now() });
    if (db[id].mensajes.length > 20) db[id].mensajes.shift();

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return db[id].mensajes;
}
