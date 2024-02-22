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
setInterval(() => {
  const data = {
    variable1: 22, // Genera un valor aleatorio entre 1 y 100
    variable2: 8,
    variable3: 1
  };
  io.sockets.emit('data', data); // Emitir datos a todos los clientes conectados
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
