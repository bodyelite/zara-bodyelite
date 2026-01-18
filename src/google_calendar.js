import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuthClient() {
    let key = process.env.GOOGLE_PRIVATE_KEY;
    const email = process.env.GOOGLE_CLIENT_EMAIL;

    if (!key || !email) {
        console.error("❌ ERROR: Faltan credenciales en Render (Email o Key).");
        return null;
    }

    key = key.replace(/^"|"$/g, '');
    if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error("❌ ERROR: La llave no parece una llave RSA válida.");
        return null;
    }
    key = key.replace(/\\n/g, '\n');

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
        const auth = getAuthClient();
        if (!auth) return "Error de credenciales.";

        const calendar = google.calendar({ version: 'v3', auth });
        const timeZone = 'America/Santiago';
        const now = DateTime.now().setZone(timeZone);
        
        // Buscamos disponibilidad desde la próxima hora hasta 7 días adelante
        const rangeStart = now.startOf('hour').plus({ hours: 1 });
        const rangeEnd = now.plus({ days: 7 }).endOf('day');
        
        // 1. OBTENER EVENTOS DE GOOGLE (Citas reales y Bloqueos)
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: rangeStart.toISO(),
            timeMax: rangeEnd.toISO(),
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

        // 2. BARRIDO DE LOS PRÓXIMOS 7 DÍAS
        for (let i = 0; i < 7; i++) {
            let dia = currentDay.plus({ days: i });
            let weekday = dia.weekday; // 1=Lunes, ... 6=Sábado, 7=Domingo

            // === 🕒 CONFIGURACIÓN DE HORARIOS (TUS REGLAS) ===
            
            // Regla 1: Domingos CERRADO
            if (weekday === 7) continue; 

            // Definir Hora de Apertura y Cierre según el día
            let startHour = 10; // Todos abren a las 10:00 am
            let startMinute = 0;
            let endHour = 19;
            let endMinute = 30;

            if (weekday === 1 || weekday === 3 || weekday === 5) {
                // LUNES, MIÉRCOLES, VIERNES: Hasta 19:30
                endHour = 19; 
                endMinute = 30;
            } else if (weekday === 2 || weekday === 4) {
                // MARTES Y JUEVES: Hasta 17:00
                endHour = 17; 
                endMinute = 0;
            } else if (weekday === 6) {
                // SÁBADO: Hasta 13:00
                endHour = 13; 
                endMinute = 0;
            }

            // Crear objetos DateTime para inicio y fin del día laboral
            let dayStart = dia.set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
            let dayEnd = dia.set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

            // 3. GENERAR BLOQUES DE 30 MIN DENTRO DEL HORARIO PERMITIDO
            let slot = dayStart;
            
            // El slot debe terminar ANTES o IGUAL a la hora de cierre.
            // (Ej: Si cierra a las 17:00, el último turno es 16:30-17:00).
            while (slot.plus({ minutes: 30 }) <= dayEnd) {
                
                // Verificar si choca con algo en Google Calendar
                let isBusy = busySlots.some(busy => 
                    (slot >= busy.start && slot < busy.end) || // Empieza dentro de un evento
                    (slot.plus({ minutes: 29 }) > busy.start && slot.plus({ minutes: 29 }) <= busy.end) // Termina dentro de un evento
                );

                // Solo agregar si está libre y es en el futuro
                if (!isBusy && slot > now) {
                    freeSlots.push(slot);
                }
                
                slot = slot.plus({ minutes: 30 });
            }
        }

        if (freeSlots.length === 0) return "No quedan horas disponibles esta semana. 😅";

        // 4. FORMATEAR PARA ZARA
        let output = "";
        let lastDate = "";
        
        freeSlots.forEach(slot => {
            let dateStr = slot.toFormat('cccc d LLLL', { locale: 'es' }); // Ej: lunes 20 enero
            let timeStr = slot.toFormat('HH:mm');
            
            if (dateStr !== lastDate) {
                output += `\n📅 ${dateStr.toUpperCase()}: `;
                lastDate = dateStr;
            }
            output += `${timeStr}, `;
        });

        return output;

    } catch (error) {
        console.error("❌ ERROR CALENDARIO:", error.message);
        return "Dame un segundo, estoy revisando la agenda...";
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
