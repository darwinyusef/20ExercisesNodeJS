// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const http = require('http');

// Configurar dotenv para cargar variables de entorno
dotenv.config();

// Configurar el servidor Express
const app = express();
const server = http.createServer(app);

// Configurar middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Configurar la base de datos SQLite
const db = new sqlite3.Database('./db_sqlite.sqlite');

app.get('/', (req, res) => {
    let nombre = 'Juan';
    const edad = 30;

    res.json({ 'nombre': nombre, 'edad': edad });
});

app.get('/uno', (req, res) => {
    let suma = 10 + 5;
    let resta = 10 - 5;

    res.json({ 'suma': suma, 'resta': resta });
});

app.get('/dos', (req, res) => {
    edad = 19; 
    let queeres = 'no se';
    if (edad >= 18) {
        queeres = 'Eres mayor de edad';
    } else {
        queeres = 'Eres menor de edad';
    }

    res.json({ 'respuesta': queeres });
});







server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

