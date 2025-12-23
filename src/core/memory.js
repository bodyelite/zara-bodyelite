import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RENDER_DISK_PATH = '/opt/render/project/src/data';
const LOCAL_DISK_PATH = path.join(__dirname, '../../data');

const DB_DIR = fs.existsSync(RENDER_DISK_PATH) ? RENDER_DISK_PATH : LOCAL_DISK_PATH;
const DB_PATH = path.join(DB_DIR, 'chat_history.json');

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = {};
try {
    if (fs.existsSync(DB_PATH)) {
        db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
} catch (e) {
    db = {};
}

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, zara_active: true, mensajes: [] };
        }
        
        db[id].plataforma = plataforma || "whatsapp";
        db[id].nombre = nombre || "Cliente";
        if (db[id].zara_active === undefined) db[id].zara_active = true;

        const mensaje = {
            role,
            content,
            timestamp: Date.now(),
            estado
        };

        db[id].mensajes.push(mensaje);
        
        if (db[id].mensajes.length > 60) {
            db[id].mensajes = db[id].mensajes.slice(-60);
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return db[id].mensajes;
    } catch (error) {
        return [];
    }
}

export function toggleZara(id, status) {
    if (db[id]) {
        db[id].zara_active = status;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return true;
    }
    return false;
}

export function isZaraActive(id) {
    return db[id] ? db[id].zara_active : true;
}

export function leerDB() {
    return db;
}
