import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";
const socket = io();
socket.emit("hello", "world");

function checkSocketStatus() {
    console.log("Estado del socket: ", socket.connected);
}

socket.on("connect", () => {
    console.log("El socket se ha conectado: ", socket.id);
    checkSocketStatus();

});

socket.on("connect_error", () => {
    console.log("No pude conectarme 😔");
})

socket.on("disconnect", () => {
    console.log("El socket se ha desconectado: ", socket.id);
    checkSocketStatus();

});

socket.io.on("reconnect_attempt", () => {
    console.log("Estoy intentado reconectarme 🤪");
});

socket.io.on("reconnect", () => {
    console.log("¡Me he vuelto a conectar! 😎");
});