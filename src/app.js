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
        const raw = fs.readFileSync(FILE, 'utf8');
        const data = JSON.parse(raw); 
        sesiones = data.sesiones || {}; 
        botStatus = data.botStatus || {}; 
        Object.keys(sesiones).forEach(p => {
            if (!sesiones[p].lastInteraction) sesiones[p].lastInteraction = Date.now();
        });
    }
} catch (e) { console.error("Error DB:", e); }

function guardar() { try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } catch (e) { console.error(e); } }
async function notificarStaff(texto) { for (const n of STAFF_NUMBERS) { try { await enviarMensaje(n, texto); } catch(e){} } }

function recalcularEstado(p) {
    const u = sesiones[p];
    if (!u) return;
    if (u.tag === 'AGENDADO' || u.tag === 'ABANDONADOS') return; 

    const tieneTarea = u.notes && u.notes.some(n => n.status === 'pending');
    if (tieneTarea) { u.tag = 'GESTIÓN'; return; }

    const now = Date.now();
    const hoursSince = (now - (u.lastInteraction || now)) / 36e5;
    const history = u.history || [];
    const userMsgs = history.filter(m => m.role === 'user').length;
    const lastMsg = history.length > 0 ? history[history.length - 1] : null;

    if (lastMsg && lastMsg.role !== 'user' && hoursSince > 24) { u.tag = 'ABANDONADOS'; return; }

    const text = history.map(m => m.content.toLowerCase()).join(' ');
    if (text.includes('precio') || text.includes('agendar')) { u.tag = 'HOT'; return; }
    if (userMsgs > 2) { u.tag = 'INTERESADO'; return; }
    
    if (!u.tag) u.tag = (u.origin === 'push') ? 'PUSH' : 'NUEVO';
}

// EXPORTS
export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }
export function toggleBot(p) { botStatus[p]=!botStatus[p]; guardar(); return botStatus[p]; }
export function updateTagManual(p, t) { if(sesiones[p]){ sesiones[p].tag=t; guardar(); return true;} return false;}
export function marcarLeido(p) { if(sesiones[p]) { sesiones[p].unread = false; guardar(); return true; } return false; }
export function forzarRecalculo() { let c=0; Object.keys(sesiones).forEach(p => { recalcularEstado(p); c++; }); guardar(); return c; }
export async function enviarMensajeManual(p, t) { 
    const r = await enviarMensaje(p, t); 
    if(r.ok && sesiones[p]){ 
        sesiones[p].history.push({role:'assistant', content:t, timestamp:Date.now(), source:'manual'}); 
        sesiones[p].lastInteraction=Date.now(); 
        recalcularEstado(p); 
        guardar(); 
    } 
    return r.ok; 
}
export function agregarNota(p, t, s, d) { 
    if(!sesiones[p]) return false; 
    if(!sesiones[p].notes) sesiones[p].notes=[]; 
    sesiones[p].notes.push({date:Date.now(), text:t, isScheduled:!!s, targetDate:d||"", status:s?'pending':'note'}); 
    recalcularEstado(p); guardar(); return true; 
}
export function eliminarNota(p, i) { 
    if(sesiones[p]?.notes?.[i]) { sesiones[p].notes.splice(i,1); recalcularEstado(p); guardar(); return true; } return false; 
}
export async function procesarPushBatch(l) { 
    let c=0; 
    for(const i of l){ 
        try{ 
            const p=i.telefono.replace(/\D/g,''); if(p.length<8)continue; 
            if(!sesiones[p]) { sesiones[p]={name:i.nombre, history:[], phone:p, tag:"PUSH", origin:"push", lastInteraction:Date.now(), unread:false, notes:[]}; } 
            else { sesiones[p].tag='PUSH'; sesiones[p].origin='push'; }
            const r=await enviarMensaje(p,i.mensaje); 
            if(r.ok){ sesiones[p].history.push({role:'assistant', content:i.mensaje, timestamp:Date.now(), source:'push'}); c++; } 
        }catch(e){} 
    } guardar(); return c; 
}

export async function procesarEvento(e) { 
    const v=e.entry?.[0]?.changes?.[0]?.value; 
    if(v?.statuses) return; 
    const m=v?.messages?.[0]; 
    if(!m) return; 
    const p=m.from; 
    const n=v.contacts?.[0]?.profile?.name||"Cliente"; 
    
    if(!sesiones[p]) { 
        sesiones[p]={name:n, history:[], phone:p, tag:"NUEVO", origin:"meta", lastInteraction:Date.now(), unread:true, notes:[]}; 
        await notificarStaff(`🚨 NUEVO: ${n}`); 
    } else { 
        sesiones[p].unread = true; 
        sesiones[p].lastInteraction=Date.now();
        if (sesiones[p].tag === 'ABANDONADOS') sesiones[p].tag = 'INTERESADO';
    } 
    
    let c=m.type==="text"?m.text.body:""; 
    sesiones[p].history.push({role:"user", content:c, timestamp:Date.now()}); 
    recalcularEstado(p); guardar(); 

    if(botStatus[p]!==false) { 
        const r=await pensar(sesiones[p].history, sesiones[p].name, sesiones[p].campaign||'default', sesiones[p].tag||'NUEVO'); 
        const s=await enviarMensaje(p,r); 
        if(s.ok) { sesiones[p].history.push({role:"assistant", content:r, timestamp:Date.now(), source:'bot'}); guardar(); } 
    } 
}
