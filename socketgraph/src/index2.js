const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir la página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Envía datos ficticios cada segundo
let code = 0; 
setInterval(() => {
  code ++;
  const data = {
    timestamp: code,
    value: Math.floor(Math.random() * 100) + 1 // Genera un valor aleatorio entre 1 y 100
  };
  io.sockets.emit('data', data); // Emitir datos a todos los clientes conectados
}, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});