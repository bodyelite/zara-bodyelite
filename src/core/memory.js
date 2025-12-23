import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/chat_history.json');

// Asegurar carpeta data
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Cargar DB
let db = {};
if (fs.existsSync(DB_PATH)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
        console.error("Error crítico leyendo DB:", e);
        db = {};
    }
}

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, mensajes: [] };
        } 
        
        // ACTUALIZAR SIEMPRE LA PLATAFORMA (Para corregir undefineds antiguos)
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

        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
            if (err) console.error("Error escritura DB:", err);
        });

        return db[id].mensajes;
    } catch (error) {
        console.error("Error guardarMensaje:", error);
        return [];
    }
}

export function leerDB() {
    // AL LEER, SI HAY DATOS VIEJOS SIN PLATAFORMA, LOS PARCHAMOS EN MEMORIA
    const safeDB = { ...db };
    Object.keys(safeDB).forEach(key => {
        if (!safeDB[key].plataforma) safeDB[key].plataforma = "whatsapp";
        if (!safeDB[key].nombre) safeDB[key].nombre = "Cliente";
    });
    return safeDB;
}
