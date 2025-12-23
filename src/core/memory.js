import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RENDER_PATH = '/opt/render/project/src/data/chat_history.json';
const LOCAL_PATH = path.join(__dirname, '../../data/chat_history.json');

const DB_PATH = fs.existsSync('/opt/render/project/src/data') ? RENDER_PATH : LOCAL_PATH;

if (!fs.existsSync(path.dirname(DB_PATH))) {
    try { fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }); } catch (e) {}
}

let db = {};

function cargarYParcharDB() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const raw = fs.readFileSync(DB_PATH, 'utf-8');
            const data = JSON.parse(raw);
            
            Object.keys(data).forEach(key => {
                if (!data[key].plataforma) {
                    data[key].plataforma = 'whatsapp';
                }
                if (!data[key].nombre) {
                    data[key].nombre = 'Cliente';
                }
                if (data[key].zara_active === undefined) {
                    data[key].zara_active = true;
                }
            });
            return data;
        }
    } catch (e) {
        return {};
    }
    return {};
}

db = cargarYParcharDB();

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, zara_active: true, mensajes: [] };
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
