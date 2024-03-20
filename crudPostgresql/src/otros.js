const express = require("express");
const route = express.Router();

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connectionString = process.env.POSTGRESQL_EXTERNAL_DB;
const pool = new Pool({
    connectionString,
});

// CRUD Routes (implement these functions below)
route.get("/otros", getTodos); // GET all todos
route.post("/otros", createTodo); // POST a new todo
route.get("/otros/:id", getTodoById); // GET a todo by ID
route.put("/otros/:id", updateTodo); // PUT update a todo
route.delete("/otros/:id", deleteTodo); // DELETE delete a todo


// ☺ ♦ ♣
async function getTodos(req, res) {
    try {
        // Obtener todos los "todos" de la base de datos
        const client = await pool.connect();
        const results = await client.query("SELECT * FROM otros");
        const todos = results.rows;
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving otros");
    }
}

// ☺ ♦ ♣
async function createTodo(req, res) {
    try {
        // Validar la entrada del body
        const { title, completed } = req.body;
        if (!title) {
            return res.status(400).send("Missing title");
        }

        // Crear un nuevo "todo" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO otros (title) VALUES ($1) RETURNING *",
            [title],
        );
        const newTodo = result.rows[0];
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating otros");
    }
}

// ☺ ♦
async function getTodoById(req, res) {
    try {
        // Obtener un "todo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM otros WHERE id = $1", [
            id,
        ]);
        const todo = result.rows[0];
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving otros");
    }
}

// ☺ ♦
async function updateTodo(req, res) {
    try {
        // Actualizar un "todo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const { title, completed } = req.body;
        if (!title) {
            return res.status(400).send("Missing title");
        }

        const client = await pool.connect();
        const result = await client.query(
            "UPDATE otros SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
            [title, completed, id],
        );
        const updatedTodo = result.rows[0];
        if (!updatedTodo) {
            return res.status(404).send("Otro not found");
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating otros");
    }
}

// ☺ ♦
async function deleteTodo(req, res) {
    try {
        // Eliminar un "todo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM otros WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("Todo not found");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting otros");
    }
}

module.exports = route; 