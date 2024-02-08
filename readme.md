# Cliente con SOCKET IO

para instalación del paquete de socket.io en node, se utilizan los siguientes comando:

npm init 
npm i express socket.io --save 
npm i bufferutil utf-8-validate --save-dev 
git init 
npm i nodemon --save-dev

## Estos son los Eventos del lado del cliente para el objeto socket.io

[Socket io eventos](https://ajaxhispano.com/ask/lista-de-socketio-eventos-70239/)
[Socket io eventos desde doc original](https://socket.io/docs/v4/listening-to-events/)

> connect → Disparó sobre una conexión exitosa.
> connect_error → Se disparó por un error de conexión.Parámetros:
## Object objeto de error
> connect_timeout → Se disparó en un tiempo de espera de conexión.
> reconnect → Disparó a una reconexión exitosa.Parámetros:
## Number número de intento de reconexión
> reconnect_attempt → Disparó en un intento de re-conectar.
> reconnecting → Disparó en un intento de re-conectar. Parámetros:
> Number número de intento de reconexión
> reconnect_error → Se disparó tras un error de intento de reconexión. Parámetros:

## Object objeto de error
> reconnect_failed → Se disparó cuando no se pudo volver a conectar dentro reconnectionAttempts
> Eventos del lado del cliente para el objeto socket
> connect → Disparo al conectar.
> error → Se dispara a un error de conexión. Parámetros:

## Object datos de error
> disconnect → Disparó tras una des-conexión.
> reconnect → Disparó a una reconexión exitosa.Parámetros:

## Number número de intento de reconexión
> reconnect_attempt → Disparada a un intento de re-conectarse.
> reconnecting → Disparó en un intento de re-conectar. Parámetros:
> Number número de intento de reconexión
> reconnect_error → Se disparó tras un error de intento de reconexión. Parámetros:
> Object objeto de error
> reconnect_failed → Se disparó cuando no se pudo volver a conectar dentro de reconnectionAttempts

## Eventos del Servidor
> connection / connect → Disparó contra un relación. Parámetros:
> Socket el socket entrante.