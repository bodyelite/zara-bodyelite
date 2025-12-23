import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/chat_history.json');

// Asegurar que existe la carpeta data
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Cargar DB en memoria
let db = {};
if (fs.existsSync(DB_PATH)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
        console.error("Error leyendo DB, iniciando limpia:", e);
        db = {};
    }
}

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        // Si el usuario no existe, crearlo
        if (!db[id]) {
            db[id] = { nombre, plataforma, mensajes: [] };
        } 
        
        // CORRECCIÓN CLAVE: Actualizar siempre la plataforma y nombre por si cambiaron o eran undefined
        db[id].plataforma = plataforma;
        db[id].nombre = nombre;

        const mensaje = {
            role,
            content,
            timestamp: Date.now(),
            estado
        };

        db[id].mensajes.push(mensaje);
        
        // Mantener historial manejable (últimos 50 mensajes)
        if (db[id].mensajes.length > 50) {
            db[id].mensajes = db[id].mensajes.slice(-50);
        }

        // Guardar en disco (Asíncrono para no bloquear)
        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
            if (err) console.error("Error guardando DB:", err);
        });

        return db[id].mensajes;
    } catch (error) {
        console.error("Error en guardarMensaje:", error);
        return [];
    }
}

export function leerDB() {
    return db;
}
