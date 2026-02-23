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
            timeMin: now.toISO(),
            timeMax: now.plus({ days: 10 }).endOf('day').toISO(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        if (events.length === 0) return "La agenda está completamente libre.";

        // Extraemos los eventos existentes y le decimos a Zara que están OCUPADOS
        const ocupados = events
            .filter(e => e.start.dateTime)
            .slice(0, 10)
            .map(e => DateTime.fromISO(e.start.dateTime).setZone('America/Santiago').toFormat('dd/MM HH:mm'))
            .join(', ');
        
        return ocupados ? `Atención, estas horas ya están OCUPADAS: ${ocupados}. No las ofrezcas.` : "Agenda libre.";
    } catch (e) { 
        console.error("Error leyendo calendario:", e);
        return "Agenda con disponibilidad, pero confirma antes de asegurar."; 
    }
}

export async function agendarEvento(nombre, fechaInicioISO) {
    try {
        const auth = getAuthClient();
        const calendar = google.calendar({ version: 'v3', auth });
        
        const inicio = DateTime.fromISO(fechaInicioISO).setZone('America/Santiago');
        const fin = inicio.plus({ hours: 1 });

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: {
                summary: `[Reservo] - ${nombre}`,
                description: "Cita agendada automáticamente por ZARA 7.0.",
                start: { dateTime: inicio.toISO(), timeZone: 'America/Santiago' },
                end: { dateTime: fin.toISO(), timeZone: 'America/Santiago' },
            }
        });
        return response.data.htmlLink ? true : false;
    } catch (e) {
        console.error("Error escribiendo en calendario:", e);
        return false;
    }
}