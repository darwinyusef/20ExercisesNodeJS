const express = require("express");
const route = express.Router();

const { Pool } = require("pg");

const connectionString = "postgres://prismapr_user:960ZfhlyzyXewBOmWWyaksZ3ldbc2DMz@dpg-cnot3jnsc6pc73d5n520-a.oregon-postgres.render.com/prismapr?sslmode=require";
const pool = new Pool({
    connectionString,
});

const queries = [
    `CREATE TABLE todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
    );`, `CREATE TABLE otros (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
    );`
]

// ☺ ♦ Reemplaza las funciones vacías con tu lógica específica:
async function createDatabase(req, res) {
    try {
        const client = await pool.connect();
        // Obtener todos los "todos" de la base de datos
        let results = null;
        for (al in queries) {
            results = await client.query(queries[al]);
        }
        const todos = results.rows;
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving todos");
    }
}

route.get("/create", createDatabase);

module.exports = route; 