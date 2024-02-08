import express from "express";
import { createServer } from 'http';
import path from "path";
import { Server } from "socket.io";
import * as url from 'url';

const PORT = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.static(path.join(__dirname, '/views')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  console.log({id: socket.id});
});

httpServer.listen(PORT, function () {
    console.log('go server: ', PORT);
});