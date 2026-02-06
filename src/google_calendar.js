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
        
        // CORRECCIÓN 1: Desfase de 2 horas desde AHORA mismo
        const now = DateTime.now().setZone(timeZone);
        const startBuffer = now.plus({ hours: 2 }); 
        const end = now.plus({ days: 10 }).endOf('day'); // Miramos 10 días al futuro

        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startBuffer.toISO(), // Empezamos a buscar desde ahora + 2 horas
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
        let currentDay = startBuffer;

        // Buscamos cupos en los próximos días
        for (let i = 0; i < 7; i++) { // Revisar 7 días completos
            let diaCheck = currentDay.plus({ days: i });
            let weekday = diaCheck.weekday;
            
            if (weekday === 7) continue; // Domingo cerrado

            // Horarios Body Elite
            let horaFin = 19.5; // L-M-V hasta 19:30
            if (weekday === 2 || weekday === 4) horaFin = 17; // M-J hasta 17:00
            if (weekday === 6) horaFin = 13; // Sáb hasta 13:00

            // Inicio del día: Si es HOY, usamos la hora actual + buffer. Si es otro día, a las 10 AM.
            let horaInicio = 10;
            let slot = diaCheck.set({ hour: horaInicio, minute: 0, second: 0 });
            
            // Si el día que revisamos es HOY, asegurarnos de no ofrecer horas pasadas
            if (slot < startBuffer) {
                slot = startBuffer.set({ minute: startBuffer.minute >= 30 ? 30 : 0, second: 0 });
                if (startBuffer.minute > 0 && startBuffer.minute < 30) slot = slot.plus({ minutes: 30 });
                if (startBuffer.minute > 30) slot = slot.plus({ minutes: 30 }); // Saltar a la siguiente media hora
            }

            let cierre = diaCheck.set({ hour: Math.floor(horaFin), minute: (horaFin % 1) * 60, second: 0 });

            while (slot < cierre) {
                let isBusy = busySlots.some(busy => (slot >= busy.start && slot < busy.end) || (slot.plus({ minutes: 30 }) > busy.start && slot.plus({ minutes: 30 }) <= busy.end));
                if (!isBusy) freeSlots.push(slot);
                slot = slot.plus({ minutes: 30 });
            }
        }
        
        if (freeSlots.length === 0) return "Agenda llena próximos días. Pregunta al cliente cuándo le acomoda.";

        // CORRECCIÓN 2: Devolver 15 opciones (no 3) para que Zara vea el futuro
        return freeSlots.slice(0, 15).map(s => s.toFormat('cccc d HH:mm')).join(", ");

    } catch (error) { return "Error consultando agenda."; }
}
