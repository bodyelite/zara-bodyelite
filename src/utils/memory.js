import fs from "fs";
import path from "path";

// RUTA EXACTA DE TU DISCO EN RENDER (SEGÚN TU CAPTURA)
const RENDER_PATH = "/opt/render/project/src/data";
const LOCAL_PATH = "./data";

// Determinar ruta final: Si existe la carpeta de Render, úsala. Si no, usa local.
const BASE_DIR = fs.existsSync("/opt/render/project/src") ? RENDER_PATH : LOCAL_PATH;
const DATA_PATH = path.join(BASE_DIR, "chats.json");

console.log(`💾 [MEMORIA] Iniciando sistema en: ${DATA_PATH}`);

// Asegurar que el directorio existe
if (!fs.existsSync(BASE_DIR)) {
    try {
        fs.mkdirSync(BASE_DIR, { recursive: true });
        console.log("✅ [MEMORIA] Directorio creado exitosamente.");
    } catch (e) {
        console.error("❌ [MEMORIA] ERROR CRÍTICO CREANDO DIRECTORIO:", e);
    }
}

// BACKUP DE EMERGENCIA
const BACKUP_HISTORY = {
  "system-check": {
    "nombre": "Sistema",
    "origen": "web",
    "mensajes": [{ "texto": "Sistema reiniciado. Esperando mensajes...", "tipo": "zara", "timestamp": Date.now() }]
  }
};

export function registrar(id, nombre, texto, tipo, origen) {
    let chats = leerChats();
    
    // Crear chat si no existe
    if (!chats[id]) chats[id] = { nombre: nombre || "Anónimo", origen, mensajes: [] };
    
    // Actualizar metadatos
    chats[id].origen = origen; 
    if (nombre) chats[id].nombre = nombre;

    // Agregar mensaje
    chats[id].mensajes.push({ texto, tipo, timestamp: Date.now() });
    
    // Limitar historial
    if (chats[id].mensajes.length > 60) chats[id].mensajes.shift();
    
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2));
        console.log(`💾 [MEMORIA] Guardado exitoso para ${id} (${chats[id].mensajes.length} msgs)`);
    } catch (e) {
        console.error("❌ [MEMORIA] ERROR GUARDANDO CHAT:", e);
    }
}

export function leerChats() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            console.log("⚠️ [MEMORIA] Archivo no existe, creando nuevo con backup...");
            fs.writeFileSync(DATA_PATH, JSON.stringify(BACKUP_HISTORY, null, 2));
            return BACKUP_HISTORY;
        }
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        return JSON.parse(raw);
    } catch (e) {
        console.error("❌ [MEMORIA] ERROR LEYENDO CHATS:", e);
        return BACKUP_HISTORY;
    }
}
