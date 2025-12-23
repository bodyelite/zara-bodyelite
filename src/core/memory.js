import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/chat_history.json');

if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

let db = {};
// Carga segura: Intentamos leer, si falla, iniciamos vacío pero no sobrescribimos a menos que sea necesario
try {
    if (fs.existsSync(DB_PATH)) {
        db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
} catch (e) {
    console.error("Error leyendo DB:", e);
    // No reseteamos db = {} aquí para evitar borrar datos en memoria si solo falló la lectura de disco momentánea
}

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            // Por defecto Zara nace ENCENDIDA (true)
            db[id] = { nombre, plataforma, zara_active: true, mensajes: [] };
        }
        
        // Actualizar metadatos
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
        
        // Mantener historial saludable (últimos 60 mensajes)
        if (db[id].mensajes.length > 60) {
            db[id].mensajes = db[id].mensajes.slice(-60);
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return db[id].mensajes;
    } catch (error) {
        console.error("Error guardando:", error);
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
