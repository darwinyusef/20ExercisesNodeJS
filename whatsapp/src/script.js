const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

// whatsapp
whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

let infoCHat = 'ninguna';
let statusActual = 0;
whatsapp.on('message', async message => {
    contentMs = {
        "body": message.body,
        "from": message.from,
        "to": message.to,
        "timestam": message.timestamp
    };
    // console.log(contentMs);
    listWorks = [
        "hola",
        "buenos días",
        "buenas tardes",
        "buenas noches",
        "qué tal",
        "cómo van",
        "encantado de",
        "un placer",
        "mucho gusto",
        "me alegra",
        "me da gusto"
    ];

    if (listWorks.some((palabra) => palabra === contentMs.body.toLowerCase())) {
        //message.reply('buenos días');
        statusActual = 1; 
        await whatsapp.sendMessage(message.from, 'Buen día por favor selecciona el tipo de servicio. \n \n busqueda | sugerencia | envios | ninguna');
    }

    let review = ['busqueda', 'sugerencia', 'envios', 'soporte', 'ninguna'];

    if (review.some((palabra) => palabra === contentMs.body.toLowerCase())) {
        //message.reply('buenos días');
        if (infoCHat == 'ninguna' && statusActual == 0) {
            await whatsapp.sendMessage(message.from, `Selecciona por favor el tipo de servicio. \n \n busqueda | sugerencia | envios | ninguna`);
        } else {
            await whatsapp.sendMessage(message.from, `Escriba a continuación su consulta`);
            statusActual = 2; 
        }
        infoCHat = contentMs.body.toLowerCase();
    }

    if (infoCHat != 'ninguna' && statusActual == 2) {
        await whatsapp.sendMessage(message.from, `apartir de aqui corre chatgpt`);
    }

    // if (message.body === '!papa') {
    // 	await whatsapp.sendMessage(message.from, 'pong');
    // }
});


// end whatsapp

whatsapp.initialize();