const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');

const morgan = require('morgan');

// exportación de archivos
const sendEmails = require('./email');
const config = require('../config');
const { generateAccessToken, generateRefreshToken, generateRandomToken, generarString } = require('./auth');

// postgresql
const pg = require('pg');
const bcrypt = require('bcrypt');




const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database.db');


const pool = new pg.Pool({
    connectionString: process.env.POSTGRESQL_DB
});

const app = express();

const server = http.createServer(app);
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function verifyToken(token, secret) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return false;
    }
}

// ♣
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const client = await pool.connect();
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).send('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid email or password');
    }
    const accessToken = generateAccessToken(user.rows[0].id);
    const refreshToken = generateRefreshToken(user.rows[0].id);

    res.json({
        accessToken,
        refreshToken,
        confirmation_token: user.rows[0].confirmation_token,
        confirmed: user.rows[0].confirmed
    });
});

// ♣ 
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const client = await pool.connect();
    const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
        return res.status(400).send('Email already registered');
    }
    const emailIsValid = validateEmail(email);
    if (!emailIsValid) {
        return res.status(400).send('Invalid email format');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmation = generateRandomToken().replace(/[^a-zA-Z0-9 ]/g, '');
    await client.query('INSERT INTO users (name, email, password, confirmation_token) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, confirmation]);
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    const accessToken = generateAccessToken(user.rows[0].id);
    const refreshToken = generateRefreshToken(user.rows[0].id);

    //TODO  Debemos crear todo lo que respecta a la ampliación del token y tambien a la gestión de roles y permisos; 

    await sendEmails(email, `Se ha Registrado correctamente en aquicreamos`, `Bienvenido: Hola ${name}.
     se ha registrado correctamente a nuestra plataforma con email: ${email} y
      password ${password} por favor tenga en cuenta la seguridad de este mensaje 
      bajo politicas internacionales.`)
    res.json({
        accessToken,
        refreshToken,
    });
});

// ♣
app.get('/email', async (req, res) => {
    await sendEmails('wsgestor@gmail.com', `Información email de prueba`, `Esto legalmente es una prueba genial`)
    res.send('enviado');
});

//TODO  • toca revisarla porque no esta completa la revisión
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).send('Token de actualización no válido');
    }

    try {
        const decoded = verifyToken(refreshToken, config.refreshTokenSecret);
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (!user || !user.rows.length) {
            return res.status(401).send('Usuario no encontrado');
        }

        const accessToken = generateAccessToken(user.rows[0].id);

        res.send({
            accessToken,
        });
    } catch (error) {
        res.status(401).send('Token de actualización no válido');
    }
});
//TODO  • toca revisarla porque no esta completa la revisión
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    console.log(token.replace('Bearer ', ''));
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, config.accessTokenSecret, async (err, decoded) => {
        console.log(err, decoded);
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        // Obtener el usuario de la base de datos con el ID decodificado
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        if (user.rows.length === 0) {
            return res.status(401).send('Unauthorized');
        }

        // Se puede acceder al usuario en la ruta protegida
        res.send(`Usuario: ${user.rows[0].name}`);
    });
});

// ♣
app.post('/recover-password', async (req, res) => {
    const { email } = req.body;

    const client = await pool.connect();
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).send('Email not found');
    }

    // Generar token de recuperación y guardarlo
    const token = generateRandomToken().replace(/[^a-zA-Z0-9 ]/g, '');
    await client.query('UPDATE users SET recovery_token = $1 WHERE id = $2', [token, user.rows[0].id]);

    // Enviar correo electrónico con el token
    await sendEmails(email, `Recuperación de contraseña`, `Hola, Para recuperar tu contraseña, haz clic en el siguiente enlace: [http://localhost:3000/reset-password?token=${token}] Este enlace es válido por 24 horas. 
    Si no has solicitado un cambio de contraseña, ignora este mensaje. Atentamente, El equipo de tu aplicación`);

    res.json('Email sent with recovery token');
});

// ♣
app.get('/reset-password', async (req, res) => {
    const token = req.query.token;
    console.log(token);
    const user = await pool.query('SELECT * FROM users WHERE recovery_token = $1', [token]);
    if (user.rows.length === 0) {
        return res.status(400).send('Invalid token');
    }
    const password = generarString(10);
    // Actualizar la contraseña del usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = $1, recovery_token = NULL WHERE id = $2', [hashedPassword, user.rows[0].id]);

    await sendEmails(user.rows[0].email, `Cambio satisfactorio de la contraseña`, `Hola, has recuperado tu contraseña de manera efectiva hemos generado un núevo nuevo password checkealo: ${password}`);

    res.send('Password updated successfully');
});

app.get('/change-manual-password', (req, res) => {
    //TODO DEBEMOS CREAR EL CAMBIO MANUAL DEL PASSWORD POR SI DESEA EL CAMBIO USUARIO
});


app.get('/send-confirm-email', (req, res) => {
    //TODO DEBEMOS CREAR UNA EMISIÓN DE EMAIL CON EL TOKEN DE /confirm-email
});

// ♣
app.get('/confirm-email', async (req, res) => {
    const token = decodeURI(req.query.token);

    console.log(token);
    const user = await pool.query('SELECT * FROM users WHERE confirmation_token = $1', [token]);
    if (user.rows.length === 0) {
        return res.status(400).send('Invalid token');
    }

    // Marcar la cuenta como verificada
    await pool.query('UPDATE users SET confirmed = TRUE, confirmation_token = NULL WHERE id = $1', [user.rows[0].id]);

    res.send('Email confirmed successfully');
});

//TODO  • toca revisarla porque no esta completa la revisión
app.get('/user-data', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, config.accessTokenSecret, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        // Obtener los datos del usuario de la base de datos con el ID decodificado
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        if (user.rows.length === 0) {
            return res.status(401).send('Unauthorized');
        }

        const filteredUserData = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
        };

        res.send(filteredUserData);
    });
});

//TODO  • toca revisarla porque no esta completa la revisión
app.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('No se ha proporcionado un token');
    }

    const isAccessTokenValid = verifyToken(token, config.accessTokenSecret);
    const isRefreshTokenValid = verifyToken(token, config.refreshTokenSecret);

    if (!isAccessTokenValid && !isRefreshTokenValid) {
        return res.status(401).send('Token no válido');
    }

    if (isAccessTokenValid) {  // Valid access token, return user info
        const decoded = jwt.decode(token, config.accessTokenSecret);
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (!user || !user.rows.length) {
            return res.status(401).send('Usuario no encontrado');
        }

        res.send(user.rows[0]);
    } else {  // Valid refresh token, issue new access token
        const decoded = jwt.decode(token, config.refreshTokenSecret);
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (!user || !user.rows.length) {
            return res.status(401).send('Usuario no encontrado');
        }

        const newAccessToken = generateAccessToken(user.rows[0].id);
        res.send({
            accessToken: newAccessToken,
        });
    }
});



server.listen('3000', () => {
    console.log('Server is running in a port 3000');
});