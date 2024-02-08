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

io.on("connection", socket => {

    console.log("Clientes conectados: ", io.engine.clientsCount);
    console.log("ID del socket conectado: ", socket.id);
    socket.on("hello", (arg) => {
        console.log(`Alguien dijo hola ${arg}`);   
    });

    // socket.on("disconnect", () => {
    //     console.log("El socket " + socket.id + " se ha desconectado.");
    // });

    // socket.conn.once("upgrade", () => {
    //     console.log("Hemos pasado de HTTP Long-Polling a ", socket.conn.transport.name);
    // });

});

httpServer.listen(PORT, function () {
    console.log('go server: ', PORT);
});