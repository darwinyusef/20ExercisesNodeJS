import express from 'express';
import morgan from 'morgan';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

// middlewares
app.use(morgan('dev'));
app.use(cors());
// activar la conf de la carpeta public 
app.use(express.static(__dirname + '/public'));

const events = [
    {
        id: "event1",
        calendarId: "cal3",
        title: "Weekly meeting",
        location: "https://meet.google.com/ugo-efmp-cee",
        attendees: ["Yusef Gonzalez"],
        category: "time",
        state: "Free",
        body: "TOAST UI Calendar",
        start: "2024-03-19T09:00:00",
        end: "2024-03-19T15:00:00",
        isReadOnly: true,
        isFocused: true,
        isPrivate: true,
        recurrenceRule: "dato algo",
        color: "#fff",
        backgroundColor: "#ccc",
    },
    {
        id: "event2",
        calendarId: "cal1",
        title: "Lunch appointment",
        start: "2024-03-19T12:00:00",
        end: "2024-03-19T13:00:00",
        isReadOnly: true,
    },
    {
        id: "event3",
        calendarId: "cal2",
        title: "Vacaciones",
        start: "2024-03-19",
        end: "2024-03-30",
        isAllday: true,
        category: "allday",
        isReadOnly: true,
    },
    {
        id: "event3",
        calendarId: "cal2",
        title: "Vacaciones",
        start: "2024-03-19",
        end: "2024-03-30",
        isAllday: false,
        category: "task",
        isReadOnly: true,
    },
]

app.get('/events', (req, res) => {
    res.status(200).json({events});
});

app.get('*', function (req, res) {
    res.status(200).send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
});

server.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});