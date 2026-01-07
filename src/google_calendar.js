import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// --- CORRECCIÓN CRÍTICA DE LA LLAVE ---
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
if (PRIVATE_KEY) {
    // Reemplazamos SIEMPRE los caracteres literales \n por saltos de línea reales.
    // Esto funciona tanto si la pegaste en una línea como si la pegaste expandida.
    PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
} else {
    console.error("❌ ERROR CRÍTICO: No se encuentra GOOGLE_PRIVATE_KEY en las variables de entorno.");
}

const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export async function checkAvailability() {
    try {
        if (!PRIVATE_KEY) return "Error de Configuración: Falta la llave de Google en Render.";

        const timeZone = 'America/Santiago';
        const now = DateTime.now().setZone(timeZone);
        
        // MIRAMOS 7 DÍAS ADELANTE
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

        const busySlots = response.data.items.map(event => {
            return {
                start: DateTime.fromISO(event.start.dateTime || event.start.date, { zone: timeZone }),
                end: DateTime.fromISO(event.end.dateTime || event.end.date, { zone: timeZone })
            };
        });

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
        console.error("Error Calendario Detallado:", error); // Log más detallado
        return "Error de conexión con el calendario.";
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