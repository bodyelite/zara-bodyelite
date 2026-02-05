import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const STAFF_NUMBERS = ['56955145504', '56983300262', '56937648536'];
const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'sesiones.json');

let sesiones = {}; 
let botStatus = {}; 

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

try { 
    if (fs.existsSync(FILE)) {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); 
        sesiones = data.sesiones || {}; 
        botStatus = data.botStatus || {}; 
    }
} catch (e) { console.error("Error DB:", e); }

function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

async function notificarStaff(texto) { for (const n of STAFF_NUMBERS) { try { await enviarMensaje(n, texto); } catch(e){} } }

export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }
export function toggleBot(p) { botStatus[p]=!botStatus[p]; guardar(); return botStatus[p]; }
export function updateTagManual(p, t) { if(sesiones[p]){ sesiones[p].tag=t; guardar(); return true;} return false;}
export function marcarLeido(p) { if(sesiones[p]) { sesiones[p].unread = false; guardar(); return true; } return false; }

export async function enviarMensajeManual(p, t) { 
    const r = await enviarMensaje(p, t); 
    if(r.ok && sesiones[p]){ 
        sesiones[p].history.push({role:'assistant', content:t, timestamp:Date.now(), source:'manual'}); 
        guardar(); 
    } 
    return r.ok; 
}

export function agregarNota(p, t, s, d) { 
    if(!sesiones[p]) return false; 
    if(!sesiones[p].notes) sesiones[p].notes=[]; 
    sesiones[p].notes.push({date:Date.now(), text:t, isScheduled:!!s, targetDate:d||"", status:s?'pending':'note'}); 
    guardar(); return true; 
}

export async function procesarEvento(e) { 
    const v=e.entry?.[0]?.changes?.[0]?.value; 
    const m=v?.messages?.[0]; 
    if(!m) return; 
    const p=m.from; 
    const n=v.contacts?.[0]?.profile?.name||"Cliente"; 
    
    if(!sesiones[p]) { 
        sesiones[p]={name:n, history:[], phone:p, tag:"NUEVO", lastInteraction:Date.now(), unread:true, notes:[]}; 
        await notificarStaff(`🚨 NUEVO: ${n}`); 
    } else { 
        sesiones[p].unread = true; 
        sesiones[p].lastInteraction=Date.now();
    } 
    
    let c=m.type==="text"?m.text.body:""; 
    sesiones[p].history.push({role:"user", content:c, timestamp:Date.now()}); 
    guardar(); 

    if(botStatus[p]!==false) { 
        // Pasamos las notas de la bitácora al pensar()
        const r=await pensar(sesiones[p].history, sesiones[p].name, sesiones[p].campaign, sesiones[p].tag, sesiones[p].notes); 
        const s=await enviarMensaje(p,r); 
        if(s.ok) { sesiones[p].history.push({role:"assistant", content:r, timestamp:Date.now(), source:'bot'}); guardar(); } 
    } 
}
