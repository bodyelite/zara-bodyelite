import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// RUTA ABSOLUTA CONFIRMADA EN TU CAPTURA DE RENDER
const RENDER_DISK_FILE = '/opt/render/project/src/data/chat_history.json';
// RUTA RELATIVA PARA LOCAL (src/core -> src/data)
const LOCAL_DISK_FILE = path.join(__dirname, '../data/chat_history.json');

// Usar la de Render si existe, sino la local
const DB_PATH = fs.existsSync('/opt/render/project/src/data') ? RENDER_DISK_FILE : LOCAL_DISK_FILE;

// Asegurar directorio si estamos en local
if (!fs.existsSync(path.dirname(DB_PATH))) {
    try { fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }); } catch (e) {}
}

let db = {};

// FUNCIÓN DE CARGA INICIAL ROBUSTA
function cargarDB() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const raw = fs.readFileSync(DB_PATH, 'utf-8');
            const data = JSON.parse(raw);
            
            // PARCHE VITAL: RECUPERAR HISTORIA ANTIGUA
            // Si hay chats viejos sin 'plataforma', asumimos 'whatsapp' para que el Monitor los vea
            Object.keys(data).forEach(id => {
                if (!data[id].plataforma) data[id].plataforma = 'whatsapp';
                if (!data[id].nombre) data[id].nombre = 'Cliente';
                if (data[id].zara_active === undefined) data[id].zara_active = true;
            });
            return data;
        }
    } catch (e) {
        console.error("Error leyendo historial:", e);
    }
    return {};
}

// Cargar al inicio
db = cargarDB();

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, zara_active: true, mensajes: [] };
        }
        
        // Actualizar datos de cabecera
        db[id].plataforma = plataforma || "whatsapp";
        db[id].nombre = nombre || "Cliente";

        const mensaje = {
            role,
            content,
            timestamp: Date.now(),
            estado
        };

        db[id].mensajes.push(mensaje);
        
        // Limitar historial para no saturar el JSON
        if (db[id].mensajes.length > 60) {
            db[id].mensajes = db[id].mensajes.slice(-60);
        }

        // Guardar síncrono para asegurar persistencia
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return db[id].mensajes;
    } catch (error) {
        console.error("Error guardando mensaje:", error);
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
    // Recargar DB por si hubo cambios externos o para asegurar frescura
    // (Opcional: si el archivo es muy grande, quitar la recarga aquí y usar solo memoria)
    return db; 
}
