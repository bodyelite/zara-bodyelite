import fs from 'fs';
import path from 'path';

// RUTA ABSOLUTA DE RENDER (CONFIRMADA POR TU IMAGEN)
const RENDER_PATH = '/opt/render/project/src/data/chat_history.json';

// Lógica de selección de ruta
let DB_PATH = path.join(process.cwd(), 'data/chat_history.json'); // Default local

// Si estamos en Render (verificando si existe la carpeta montada)
if (fs.existsSync('/opt/render/project/src/data')) {
    DB_PATH = RENDER_PATH;
    console.log("🔵 USANDO DISCO PERSISTENTE DE RENDER:", DB_PATH);
} else {
    // Crear carpeta local si no existe
    const localDir = path.dirname(DB_PATH);
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    console.log("🟠 USANDO DISCO LOCAL:", DB_PATH);
}

let db = {};

// FUNCIÓN PARA CARGAR Y REPARAR DATOS VIEJOS
function cargarBaseDeDatos() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const raw = fs.readFileSync(DB_PATH, 'utf-8');
            const data = JSON.parse(raw);
            
            // --- BLOQUE DE REPARACIÓN DE HISTORIA ---
            let recuperados = 0;
            Object.keys(data).forEach(key => {
                // Si el chat antiguo no tiene plataforma, es WhatsApp por defecto
                if (!data[key].plataforma) {
                    data[key].plataforma = 'whatsapp';
                    recuperados++;
                }
                // Si no tiene nombre
                if (!data[key].nombre) data[key].nombre = 'Cliente Antiguo';
                
                // Si no tiene estado de Zara
                if (data[key].zara_active === undefined) data[key].zara_active = true;
            });
            
            if (recuperados > 0) console.log(`✅ SE RECUPERARON ${recuperados} CHATS ANTIGUOS`);
            return data;
        }
    } catch (e) {
        console.error("❌ ERROR LEYENDO DB:", e);
    }
    return {};
}

// Cargar al inicio
db = cargarBaseDeDatos();

export function guardarMensaje(id, nombre, content, role, plataforma = "whatsapp", estado = "normal") {
    try {
        if (!db[id]) {
            db[id] = { nombre, plataforma, zara_active: true, mensajes: [] };
        }
        
        // Asegurar metadatos
        db[id].plataforma = plataforma || "whatsapp";
        db[id].nombre = nombre || "Cliente";

        const mensaje = {
            role,
            content,
            timestamp: Date.now(),
            estado
        };

        db[id].mensajes.push(mensaje);
        
        // Mantener historial
        if (db[id].mensajes.length > 60) {
            db[id].mensajes = db[id].mensajes.slice(-60);
        }

        // Guardar en disco
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
