// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');

// Configurar dotenv para cargar variables de entorno
dotenv.config();

// Configurar el servidor Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar middleware
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5500/indexprcors.html', // Reemplaza con el origen de tu frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
//     allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
// }));

app.use(morgan('dev'));
app.use(bodyParser.json());

// Configurar la base de datos SQLite
const db = new sqlite3.Database('./db_sqlite.sqlite');

// io.origins('http://127.0.0.1:5500');
// Crear tabla en la base de datos si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", (err) => {
        if (err) {
            console.error('Error creating table "items":', err.message);
        } else {
            console.log('Table "items" created or already exists.');
        }
    });
});

// Mostrar un elemento por su ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.json(row);
    });
});

// Rutas CRUD
// Listar todos los elementos
app.get('/items', (req, res) => {
    db.all("SELECT * FROM items", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Crear un nuevo elemento
app.post('/items', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO items (name) VALUES (?)`, [name], function (err) {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemCreated', { id: this.lastID, name }); // Emitir evento de creación
        res.json({ id: this.lastID, name });
    });
});

// Actualizar un elemento
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.run(`UPDATE items SET name = ? WHERE id = ?`, [name, id], (err) => {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemUpdated', { id, name }); // Emitir evento de actualización
        res.json({ id, name });
    });
});

// Eliminar un elemento
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM items WHERE id = ?`, id, (err) => {
        if (err) {
            return console.error(err.message);
        }
        io.emit('itemDeleted', { id }); // Emitir evento de eliminación
        res.json({ message: 'Item deleted', id });
    });
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
