// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');
//agregar openai
const OpenAI = require('openai');

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
// Define la ruta pública para los archivos estáticos
app.use(express.static('public'));


// Configurar la base de datos SQLite
const db = new sqlite3.Database('./db_sqlite.sqlite');



const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});



// Rutas a las páginas HTML
app.get('/page', (req, res) => {
  res.sendFile('./index.html', { root: 'public' });
});

app.get('/response/', async (req, res) => {
    const mensaje = req.query.mensaje == undefined ? req.query.mensaje : 'peliculas';
    const cantidad = req.query.cantidad | 1;

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `primero elimina todas las introducciones solo quiero un json, 
        nunca debes debes incluir en el json { "peliculas": [] } solo agrega [],  
        limita a entregarme solo el json nada mas, 
        quiero saber aleatoriamente ${cantidad} de ${mensaje} dame los nombres y fechas, los premios serán listados separados por (;) una unica calificación sera de 0 a 5. tambien debes incluir un numero aleatorio entre 500 y 511 e incluirlo en num_aleatorio, todo esto en json para cada uno internamente en el array así:   
            [{
              "id": 1,
              "nombre": "Pirates of the Caribbean: At World's End",
              "fecha": año aleatorio,
              "num_aleatorio": 500 a 511,
              "calificacion": de 0 a 5,
              "premios": "Teen Choice Award; People's Choice Award; MTV Movie Award"
            }],` }],
        model: 'gpt-3.5-turbo',
    });
    res.status(201).json({ response_gpt: chatCompletion.choices[0].message });
});











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
