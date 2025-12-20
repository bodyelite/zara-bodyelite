import fs from "fs";
import path from "path";

// DETECCIÓN INTELIGENTE DE RUTA (Local vs Render Disk)
// En la imagen vi que tu disco está en: /opt/render/project/src/data
const isRender = process.env.RENDER || false;
const BASE_DIR = isRender ? "/opt/render/project/src/data" : "./data";
const DATA_PATH = path.join(BASE_DIR, "chats.json");

// Asegurar que el directorio existe
if (!fs.existsSync(BASE_DIR)) {
    try { fs.mkdirSync(BASE_DIR, { recursive: true }); } catch (e) { console.error("Error creando dir:", e); }
}

// CHAT BASE PARA QUE NO VEAS TODO VACÍO SI EL DISCO ESTÁ LIMPIO
const BACKUP_HISTORY = {
  "web-demo": {
    "nombre": "Visitante Web (Historial)",
    "origen": "web",
    "mensajes": [
      { "texto": "hola", "tipo": "usuario", "timestamp": Date.now() - 60000 },
      { "texto": "¡Hola! 😊 Soy Zara. ¿Buscas algo para rostro o cuerpo? 💖", "tipo": "zara", "timestamp": Date.now() - 55000 },
      { "texto": "tengo guata", "tipo": "usuario", "timestamp": Date.now() - 40000 },
      { "texto": "Te entiendo full. 💖 El Plan Lipo Express es ideal para eso. ¿Te cuento más?", "tipo": "zara", "timestamp": Date.now() - 35000 }
    ]
  }
};

export function registrar(id, nombre, texto, tipo, origen) {
    let chats = leerChats();
    if (!chats[id]) chats[id] = { nombre: nombre || "Anónimo", origen, mensajes: [] };
    
    chats[id].mensajes.push({ texto, tipo, timestamp: Date.now() });
    
    if (chats[id].mensajes.length > 50) chats[id].mensajes.shift();
    try { fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2)); } catch (e) { console.error("Error guardando:", e); }
}

export function leerChats() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            // Si es la primera vez, escribimos el backup para que veas algo
            fs.writeFileSync(DATA_PATH, JSON.stringify(BACKUP_HISTORY, null, 2));
            return BACKUP_HISTORY;
        }
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        return JSON.parse(raw);
    } catch (e) { 
        return BACKUP_HISTORY; 
    }
}
