import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuthClient() {
    let key = process.env.GOOGLE_PRIVATE_KEY;
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    if (!key || !email) return null;
    key = key.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    return new google.auth.GoogleAuth({ credentials: { client_email: email, private_key: key }, scopes: SCOPES });
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export async function checkAvailability() {
    try {
        const auth = getAuthClient();
        if (!auth) return "No pude acceder a la agenda (Credenciales).";
        const calendar = google.calendar({ version: 'v3', auth });
        const timeZone = 'America/Santiago';
        const now = DateTime.now().setZone(timeZone);
        const start = now.startOf('hour').plus({ hours: 1 });
        const end = now.plus({ days: 5 }).endOf('day');

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: start.toISO(),
            timeMax: end.toISO(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: timeZone
        });

        const busySlots = response.data.items.map(event => ({
            start: DateTime.fromISO(event.start.dateTime || event.start.date, { zone: timeZone }),
            end: DateTime.fromISO(event.end.dateTime || event.end.date, { zone: timeZone })
        }));

        let freeSlots = [];
        let currentDay = now;

        // Buscamos cupos en los próximos 5 días
        for (let i = 0; i < 5; i++) {
            let diaCheck = currentDay.plus({ days: i });
            let weekday = diaCheck.weekday;
            if (weekday === 7) continue; // Domingo cerrado

            // Horarios Body Elite
            let horaFin = 19.5; // L-M-V hasta 19:30
            if (weekday === 2 || weekday === 4) horaFin = 17; // M-J hasta 17:00
            if (weekday === 6) horaFin = 13; // Sáb hasta 13:00

            let slot = diaCheck.set({ hour: 10, minute: 0, second: 0 }); // Abre a las 10
            let cierre = diaCheck.set({ hour: Math.floor(horaFin), minute: (horaFin % 1) * 60, second: 0 });

            while (slot < cierre) {
                let isBusy = busySlots.some(busy => (slot >= busy.start && slot < busy.end) || (slot.plus({ minutes: 30 }) > busy.start && slot.plus({ minutes: 30 }) <= busy.end));
                if (!isBusy && slot > now) freeSlots.push(slot);
                slot = slot.plus({ minutes: 30 });
            }
        }
        
        if (freeSlots.length === 0) return "Agenda llena próximos días. Sugiere la próxima semana.";

        // === CORRECCIÓN ANTI-VOMITO ===
        // Solo devolvemos las PRIMERAS 3 OPCIONES para obligar al cliente a elegir rápido.
        // Formato limpio: "Martes 27 11:30"
        return freeSlots.slice(0, 3).map(s => s.toFormat('cccc d HH:mm')).join(", ");

    } catch (error) { return "Error consultando agenda."; }
}
