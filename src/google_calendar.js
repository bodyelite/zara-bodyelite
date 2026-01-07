import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// 1. OBTENCIÓN Y LIMPIEZA BLINDADA DE LA LLAVE
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

if (PRIVATE_KEY) {
    // 🧹 LIMPIEZA MAESTRA:
    // 1. Reemplazamos cualquier '\n' literal (escrito como texto) por un salto de línea real.
    // 2. Esto no daña la llave si ya estaba bien, pero arregla las que están mixtas.
    PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
    
    console.log("✅ Llave procesada y formateada.");
} else {
    console.error("❌ ERROR FATAL: GOOGLE_PRIVATE_KEY no existe en Render.");
}

// 2. AUTENTICACIÓN
const auth = new google.auth.JWT(
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });

export async function checkAvailability() {
    try {
        if (!PRIVATE_KEY) return "Error: Falta configuración en Render.";

        // Verificación rápida de autorización
        await auth.authorize();

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

        // Procesar eventos ocupados
        const busySlots = response.data.items.map(event => {
            return {
                start: DateTime.fromISO(event.start.dateTime || event.start.date, { zone: timeZone }),
                end: DateTime.fromISO(event.end.dateTime || event.end.date, { zone: timeZone })
            };
        });

        // Buscar huecos libres (Lógica simplificada de 9 a 19 hrs)
        let freeSlots = [];
        let currentDay = now;

        for (let i = 0; i < 7; i++) {
            let dayStart = currentDay.plus({ days: i }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
            let dayEnd = currentDay.plus({ days: i }).set({ hour: 19, minute: 0, second: 0, millisecond: 0 });

            if (dayStart.weekday === 7) continue; // Domingo libre

            let slot = dayStart;
            while (slot < dayEnd) {
                let isBusy = busySlots.some(busy => {
                    return (slot >= busy.start && slot < busy.end) || 
                           (slot.plus({ minutes: 30 }) > busy.start && slot.plus({ minutes: 30 }) <= busy.end);
                });

                if (!isBusy && slot > now) {
                    freeSlots.push(slot);
                }
                slot = slot.plus({ minutes: 30 });
            }
        }

        if (freeSlots.length === 0) return "Agenda llena próximos 7 días.";

        // Formatear respuesta amigable
        let output = "";
        let lastDate = "";
        const relevantSlots = freeSlots.filter((slot, index) => index % 2 === 0);

        relevantSlots.forEach(slot => {
            let dateStr = slot.toFormat('cccc d LLLL', { locale: 'es' });
            let timeStr = slot.toFormat('HH:mm');
            if (dateStr !== lastDate) {
                output += `\n📅 ${dateStr.toUpperCase()}: `;
                lastDate = dateStr;
            }
            output += `${timeStr}, `;
        });

        return output;

    } catch (error) {
        console.error("❌ Error Calendario:", error.message);
        return "Lo siento, tengo un problema técnico momentáneo con la agenda.";
    }
}

export async function crearEvento(fechaIso, nombre, telefono) {
    try {
        const start = DateTime.fromFormat(fechaIso, 'yyyy-MM-dd HH:mm', { zone: 'America/Santiago' });
        await calendar.events.insert({
            calendarId: CALENDAR_ID,
            requestBody: {
                summary: `EVALUACIÓN: ${nombre} (${telefono})`,
                start: { dateTime: start.toISO() },
                end: { dateTime: start.plus({ minutes: 30 }).toISO() }
            }
        });
        return true;
    } catch (error) {
        console.error("Error creando evento:", error);
        return false;
    }
}