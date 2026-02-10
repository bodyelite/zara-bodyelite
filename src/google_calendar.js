import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

function getAuthClient() {
    let key = process.env.GOOGLE_PRIVATE_KEY;
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    if (!key || !email) return null;
    key = key.replace(/^"|\"$/g, '').replace(/\\n/g, '\n');
    return new google.auth.GoogleAuth({ credentials: { client_email: email, private_key: key }, scopes: SCOPES });
}

export async function checkAvailability() {
    try {
        const auth = getAuthClient();
        const calendar = google.calendar({ version: 'v3', auth });
        const now = DateTime.now().setZone('America/Santiago');
        
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: now.plus({ hours: 2 }).toISO(),
            timeMax: now.plus({ days: 10 }).endOf('day').toISO(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        // Filtramos y mostramos solo los 3 primeros para no abrumar
        const slots = events.slice(0, 3).map(e => DateTime.fromISO(e.start.dateTime).setZone('America/Santiago').toFormat('dd/MM HH:mm')).join(', ');
        
        return slots ? `Disponibles: ${slots}` : "Agenda abierta";
    } catch (e) { return "Agenda disponible."; }
}
