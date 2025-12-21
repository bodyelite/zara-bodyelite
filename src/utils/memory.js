import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// OBTENER RUTA REAL DEL ARCHIVO ACTUAL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SALIR 2 NIVELES (de src/utils -> src -> raiz) Y ENTRAR A DATA
// Esto funciona igual en Mac y en Render, no falla.
const BASE_DIR = path.join(__dirname, "../../data");
const DATA_PATH = path.join(BASE_DIR, "chats.json");

console.log(`📂 [MEMORIA] Ruta detectada: ${DATA_PATH}`);

// Asegurar que el directorio existe
if (!fs.existsSync(BASE_DIR)) {
    try {
        fs.mkdirSync(BASE_DIR, { recursive: true });
        console.log("✅ [MEMORIA] Carpeta /data creada.");
    } catch (e) {
        console.error("❌ [MEMORIA] Error creando carpeta:", e);
    }
}

const BACKUP = {
  "status": {
    "nombre": "System",
    "origen": "web",
    "mensajes": [{ "texto": "Sistema online. Memoria conectada.", "tipo": "zara", "timestamp": Date.now() }]
  }
};

export function registrar(id, nombre, texto, tipo, origen) {
    let chats = leerChats();
    
    if (!chats[id]) chats[id] = { nombre: nombre || "Anónimo", origen, mensajes: [] };
    
    // Actualizar datos
    chats[id].origen = origen;
    if (nombre) chats[id].nombre = nombre;
    
    chats[id].mensajes.push({ texto, tipo, timestamp: Date.now() });
    
    // Limitar historial (evita archivos gigantes)
    if (chats[id].mensajes.length > 50) chats[id].mensajes.shift();
    
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2));
        // console.log(`💾 [GUARDADO] Chat ${id} actualizado.`);
    } catch (e) {
        console.error("❌ [MEMORIA] ERROR AL ESCRIBIR:", e);
    }
}

export function leerChats() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            fs.writeFileSync(DATA_PATH, JSON.stringify(BACKUP, null, 2));
            return BACKUP;
        }
        const data = fs.readFileSync(DATA_PATH, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.error("❌ [MEMORIA] ERROR AL LEER:", e);
        return BACKUP;
    }
}
