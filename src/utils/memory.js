import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, "../../data");
const DATA_PATH = path.join(BASE_DIR, "chats.json");

if (!fs.existsSync(BASE_DIR)) { try { fs.mkdirSync(BASE_DIR, { recursive: true }); } catch (e) {} }

const BACKUP = {
  "status": { "nombre": "System", "origen": "web", "mensajes": [] }
};

export function registrar(id, nombre, texto, tipo, origen) {
    let chats = leerChats();
    
    if (!chats[id]) chats[id] = { nombre: nombre || "Anónimo", origen, mensajes: [] };
    
    // CORRECCIÓN CRÍTICA: Solo actualizamos el nombre si habla el USUARIO.
    // Si habla Zara o el Staff (Human), NO tocamos el nombre del chat.
    if (tipo === 'usuario' && nombre) {
        chats[id].nombre = nombre;
    }
    // Si el origen cambia (ej: de web a wsp), lo actualizamos
    if (origen) chats[id].origen = origen;
    
    chats[id].mensajes.push({ texto, tipo, timestamp: Date.now() });
    
    if (chats[id].mensajes.length > 50) chats[id].mensajes.shift();
    
    try { fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2)); } catch (e) {}
}

export function leerChats() {
    try {
        if (!fs.existsSync(DATA_PATH)) return BACKUP;
        return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    } catch (e) { return BACKUP; }
}
