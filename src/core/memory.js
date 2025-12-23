import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/chat_history.json');

if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

let db = {};
try {
    if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        db = JSON.parse(raw);
    }
} catch (e) {
    db = {};
}

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, mensajes: [] };
        } 
        
        db[id].plataforma = plataforma || "whatsapp"; 
        db[id].nombre = nombre || "Cliente";

        const mensaje = {
            role,
            content,
            timestamp: Date.now(),
            estado
        };

        db[id].mensajes.push(mensaje);
        
        if (db[id].mensajes.length > 50) {
            db[id].mensajes = db[id].mensajes.slice(-50);
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return db[id].mensajes;
    } catch (error) {
        return [];
    }
}

export function leerDB() {
    return db;
}
