const config = require('../config');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/* TABLA DE CREACIÓN DE USERS

CREATE TABLE users (
  id SERIAL PRIMARY KEY, -- Add an auto-incrementing SERIAL column as the primary key
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  recovery_token VARCHAR,
  confirmation_token VARCHAR,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

*/

function generateAccessToken(userId) {
    return jwt.sign({ id: userId }, config.accessTokenSecret, { expiresIn: '1h' });
}

function generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, config.refreshTokenSecret, { expiresIn: '7d' });
}

function generateRandomToken() {
    return uuidv4();
}
/* const token = generateRandomToken();
console.log(token); */

// genera aleatorio de may y min generarString(10)
const generarString = (longitud) => {
    let result = "";
    const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" "); // Espacios para convertir cara letra a un elemento de un array
    for (i = 1; i <= longitud; i++) {
        if (abc[i]) { // Condicional para prevenir errores en caso de que longitud sea mayor a 26
            const random = Math.floor(Math.random() * 4); // Generaremos el número
            const random2 = Math.floor(Math.random() * abc.length); // Generaremos el número
            const random3 = Math.floor(Math.random() * abc.length + 3); // Generaremos el número
            if (random == 1) {
                result += abc[random2]
            } else if (random == 2) {
                result += random3 + abc[random2]
            } else {
                result += abc[random2].toUpperCase()
            }
        }
    }
    return result;
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateRandomToken,
    generarString
};