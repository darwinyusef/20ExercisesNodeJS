const express = require('express');
const http = require('http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

// Configuraciones
const app = express();
const server = http.createServer(app);
// instalar morgan 
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
dotenv.config();

// asignación de contenidos
const routerEstructura = require('./api/estructuras');
const routerUsers = require('./api/usersinfo');
// middleware = app.use('/', function);
app.use('/', routerEstructura);
app.use('/', routerUsers);

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});



app.get('/openai', async (req, res) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `quien fue el conquistador de china`
        }],
        model: 'gpt-3.5-turbo',
    });
    res.status(201).json({ response_gpt: chatCompletion.choices[0].message });
});

app.get('/post', (req, res) => {
    res.sendFile('./post.html', { root: 'public' });
});
app.get('/put', (req, res) => {
    res.sendFile('./put.html', { root: 'public' });
});

app.get('/delete', (req, res) => {
    res.sendFile('./delete.html', { root: 'public' });
});


// ruta 404
app.get('*', (req, res) => {
    res.status(404).json({ 'data': '', 'error': 'Información no encontrada' });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server is running on port 3000');
}); 