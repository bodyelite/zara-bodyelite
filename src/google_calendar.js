import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Función auxiliar para obtener cliente autenticado fresco
function getAuthClient() {
    let key = process.env.GOOGLE_PRIVATE_KEY;
    const email = process.env.GOOGLE_CLIENT_EMAIL;

    if (!key || !email) {
        console.error("❌ ERROR: Faltan credenciales en Render (Email o Key).");
        return null;
    }

    // Limpieza agresiva de la llave
    // 1. Quitar comillas extra si las hubiera
    key = key.replace(/^"|"$/g, '');
    // 2. Asegurar saltos de línea reales
    if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error("❌ ERROR: La llave no parece una llave RSA válida (falta header).");
        return null;
    }
    key = key.replace(/\\n/g, '\n');

    // USAMOS GoogleAuth (Más moderno y seguro que JWT directo)
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: email,
            private_key: key,
        },
        scopes: SCOPES,
    });
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export async function checkAvailability() {
    try {
        console.log("🔄 Iniciando verificación de calendario...");
        const auth = getAuthClient();
        if (!auth) return "Error técnico: Credenciales mal configuradas.";

        // Instanciamos el calendario con el cliente auth moderno
        const calendar = google.calendar({ version: 'v3', auth });

        const timeZone = 'America/Santiago';
        const now = DateTime.now().setZone(timeZone);
        const start = now.startOf('hour').plus({ hours: 1 });
        const end = now.plus({ days: 7 }).endOf('day');

        console.log(`📅 Consultando agenda para: ${CALENDAR_ID}`);
        
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

        // Lógica simplificada de búsqueda de huecos
        for (let i = 0; i < 7; i++) {
            let dayStart = currentDay.plus({ days: i }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
            let dayEnd = currentDay.plus({ days: i }).set({ hour: 19, minute: 0, second: 0, millisecond: 0 });

            if (dayStart.weekday === 7) continue; 

            let slot = dayStart;
            while (slot < dayEnd) {
                let isBusy = busySlots.some(busy => 
                    (slot >= busy.start && slot < busy.end) || 
                    (slot.plus({ minutes: 30 }) > busy.start && slot.plus({ minutes: 30 }) <= busy.end)
                );

                if (!isBusy && slot > now) freeSlots.push(slot);
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
        console.error("❌ ERROR CALENDARIO REAL:", error.message);
        if (error.code === 401 || error.message.includes('invalid_grant')) {
            console.error("⚠️ La llave privada es incorrecta o está revocada.");
        }
        return "Tengo un problema momentáneo para ver la agenda.";
    }
}

export async function crearEvento(fechaIso, nombre, telefono) {
    try {
        const auth = getAuthClient();
        if (!auth) return false;
        const calendar = google.calendar({ version: 'v3', auth });

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