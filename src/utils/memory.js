import fs from "fs";
import path from "path";

const isRender = process.env.RENDER || false;
const BASE_DIR = isRender ? "/opt/render/project/src/data" : "./data";
const DATA_PATH = path.join(BASE_DIR, "chats.json");

if (!fs.existsSync(BASE_DIR)) { try { fs.mkdirSync(BASE_DIR, { recursive: true }); } catch (e) {} }

// BACKUP BASE (Solo se usa si el disco está 100% vacío)
const BACKUP_HISTORY = {
  "demo-wsp": { "nombre": "Juan Carlos (WSP)", "origen": "whatsapp", "mensajes": [{ "texto": "Hola, info lipo", "tipo": "usuario", "timestamp": Date.now() }] },
  "demo-ig": { "nombre": "Ailin (IG)", "origen": "instagram", "mensajes": [{ "texto": "Precio full face", "tipo": "usuario", "timestamp": Date.now() }] }
};

export function registrar(id, nombre, texto, tipo, origen) {
    let chats = leerChats();
    if (!chats[id]) chats[id] = { nombre: nombre || "Anónimo", origen, mensajes: [] };
    
    // AUTO-CORRECCIÓN: Actualizar siempre el origen y nombre por si cambiaron
    chats[id].origen = origen; 
    if (nombre) chats[id].nombre = nombre;

    chats[id].mensajes.push({ texto, tipo, timestamp: Date.now() });
    if (chats[id].mensajes.length > 50) chats[id].mensajes.shift();
    
    try { fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2)); } catch (e) {}
}

export function leerChats() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            fs.writeFileSync(DATA_PATH, JSON.stringify(BACKUP_HISTORY, null, 2));
            return BACKUP_HISTORY;
        }
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        const data = JSON.parse(raw);
        if (Object.keys(data).length === 0) return BACKUP_HISTORY;
        return data;
    } catch (e) { return BACKUP_HISTORY; }
}
