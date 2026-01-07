import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// 1. LEER Y LIMPIAR LA LLAVE
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// 🕵️‍♂️ ZONA DE DIAGNÓSTICO (Esto saldrá en los logs de Render)
console.log("================ DIAGNÓSTICO ZARA ================");
console.log("📧 EMAIL:", CLIENT_EMAIL || "❌ VACÍO");
console.log("📅 CALENDARIO:", CALENDAR_ID || "❌ VACÍO");

if (PRIVATE_KEY) {
    console.log("🔑 LLAVE ORIGINAL (Longitud):", PRIVATE_KEY.length);
    console.log("🔑 LLAVE (Primeros 30 chars):", PRIVATE_KEY.substring(0, 30));
    
    // Corrección de saltos de línea
    if (!PRIVATE_KEY.includes('\n')) {
        console.log("⚠️ AVISO: La llave venía en una sola línea. Arreglando...");
        PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
    } else {
        console.log("qm INFO: La llave ya tenía saltos de línea.");
    }
} else {
    console.error("❌ ERROR FATAL: No hay GOOGLE_PRIVATE_KEY en las variables.");
}
console.log("==================================================");

// 2. CONFIGURAR AUTENTICACIÓN
const auth = new google.auth.JWT(
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });

export async function checkAvailability() {
    try {
        if (!PRIVATE_KEY) return "Error: Falta llave privada en Render.";

        // INTENTO DE AUTENTICACIÓN EXPLÍCITO
        try {
            const token = await auth.authorize();
            console.log("✅ AUTENTICACIÓN EXITOSA. Token generado.");
        } catch (authError) {
            console.error("❌ ERROR DE AUTENTICACIÓN (JWT):", authError.message);
            return "Error grave de credenciales. Revisa logs.";
        }

        const timeZone = 'America/Santiago';
        const now = DateTime.now().setZone(timeZone);
        const start = now.startOf('hour').plus({ hours: 1 });
        const end = now.plus({ days: 7 }).endOf('day');

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: start.toISO(),
            timeMax: end.toISO(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: timeZone
        });

        // ... (Logica normal de disponibilidad) ...
        const busySlots = response.data.items.map(e => ({
            start: DateTime.fromISO(e.start.dateTime || e.start.date, { zone: timeZone }),
            end: DateTime.fromISO(e.end.dateTime || e.end.date, { zone: timeZone })
        }));

        // Resumen simplificado para prueba
        return `Conectado OK. ${busySlots.length} eventos encontrados.`;

    } catch (error) {
        console.error("❌ ERROR AL LEER CALENDARIO:", error.message);
        // Aquí veremos si el error es 403, 404, etc.
        if (error.response) {
            console.error("Detalle Error Google:", JSON.stringify(error.response.data));
        }
        return "Error de conexión con Google Calendar.";
    }
}

export async function crearEvento(fechaIso, nombre, telefono) {
    // ... (Tu lógica de crear evento se mantiene igual, no afecta el diagnóstico)
    return false; 
}