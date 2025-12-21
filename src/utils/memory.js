import fs from 'fs';
const DB_FILE = 'chats_db.json';

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}));

export function leerChats() {
    try { return JSON.parse(fs.readFileSync(DB_FILE)); } catch { return {}; }
}

export function registrar(id, nombre, texto, tipo, origen, estado = "LEAD") {
    const db = leerChats();
    if (!db[id]) db[id] = { nombre: nombre || "Desconocido", origen, estado, mensajes: [], timestamp: Date.now() };
    
    if (nombre && db[id].nombre === "Desconocido") db[id].nombre = nombre;
    if (estado !== "LEAD") db[id].estado = estado;

    db[id].mensajes.push({ tipo, texto, timestamp: Date.now() });
    db[id].timestamp = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
