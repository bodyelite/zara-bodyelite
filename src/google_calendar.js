import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const HORARIOS_ATENCION = {
    1: { inicio: 10, fin: 19 },
    2: { inicio: 10, fin: 17 },
    3: { inicio: 10, fin: 19 },
    4: { inicio: 10, fin: 17 },
    5: { inicio: 10, fin: 19 },
    6: { inicio: 10, fin: 13 }
};

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
            timeMax: now.plus({ days: 7 }).endOf('day').toISO(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        const events = response.data.items || [];
        let resumen = "Horarios: Lun/Mie/Vie 10-19h, Mar/Jue 10-17h, Sab 10-13h.\n";
        const ocupados = events
            .filter(e => e.start.dateTime)
            .map(e => {
                const start = DateTime.fromISO(e.start.dateTime).setZone('America/Santiago');
                const end = DateTime.fromISO(e.end.dateTime).setZone('America/Santiago');
                return `${start.toFormat('dd/MM HH:mm')} a ${end.toFormat('HH:mm')}`;
            }).join(', ');
        return resumen + (ocupados ? `OCUPADO: ${ocupados}.` : "Libre.") + " No agendes fuera de rango ni en horas ocupadas.";
    } catch (e) { return "Error agenda."; }
}

export async function agendarEvento(nombre, fechaInicioISO) {
    try {
        const auth = getAuthClient();
        const calendar = google.calendar({ version: 'v3', auth });
        const inicio = DateTime.fromISO(fechaInicioISO, { zone: 'America/Santiago' });
        const fin = inicio.plus({ minutes: 60 });
        const horario = HORARIOS_ATENCION[inicio.weekday];

        if (!horario || inicio.hour < horario.inicio || (inicio.hour + inicio.minute/60) >= horario.fin) {
            return { ok: false, msg: "Esa hora está fuera del horario de atención o el día no es válido." };
        }

        const freeBusyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin: inicio.toISO(),
                timeMax: fin.toISO(),
                timeZone: 'America/Santiago',
                items: [{ id: CALENDAR_ID }]
            }
        });

        const busyBlocks = freeBusyResponse.data.calendars[CALENDAR_ID].busy;
        if (busyBlocks && busyBlocks.length > 0) {
            return { ok: false, msg: "Esa hora exacta ya está ocupada en el calendario. Ofrece otro horario disponible de la misma jornada (mañana o tarde)." };
        }

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: {
                summary: `Evaluación: ${nombre}`,
                description: "Agendado por ZARA 7.0",
                start: { dateTime: inicio.toISO(), timeZone: 'America/Santiago' },
                end: { dateTime: fin.toISO(), timeZone: 'America/Santiago' },
            }
        });
        return { ok: !!response.data.htmlLink };
    } catch (e) { return { ok: false, msg: "Error de conexión al guardar en Calendar." }; }
}
