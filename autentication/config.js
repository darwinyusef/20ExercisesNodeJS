require('dotenv').config();

// forma en la que podemos generar secrets
// openssl rand -hex 32  # generates a 32-character hexadecimal secret key */

const accessTokenSecret = process.env.ACCESS_TOCKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


module.exports = {
    accessTokenSecret,
    refreshTokenSecret
};

