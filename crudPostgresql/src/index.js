const express = require("express");
const bodyParser = require("body-parser");
// const pool = require("./db"); // Import the database connection pool
const { Pool } = require("pg");


const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CRUD Routes (implement these functions below)
app.get("/create", createDatabase);
app.get("/todos", getTodos); // GET all todos
app.post("/todos", createTodo); // POST a new todo
// app.get("/todos/:id", getTodoById); // GET a todo by ID
// app.put("/todos/:id", updateTodo); // PUT update a todo
// app.delete("/todos/:id", deleteTodo); // DELETE delete a todo

// Error handler middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});




// const connectionString = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
// const connectionString = "postgres://prismapr_user:960ZfhlyzyXewBOmWWyaksZ3ldbc2DMz@dpg-cnot3jnsc6pc73d5n520-a/prismapr"

const connectionString = "postgres://prismapr_user:960ZfhlyzyXewBOmWWyaksZ3ldbc2DMz@dpg-cnot3jnsc6pc73d5n520-a.oregon-postgres.render.com/prismapr" + "?sslmode=require";
console.log(connectionString);
const pool = new Pool({
    connectionString,
});

// Reemplaza las funciones vacías con tu lógica específica:
async function createDatabase(req, res) {
    try {
        const client = await pool.connect();
        // Obtener todos los "todos" de la base de datos
        const results = await client.query(`CREATE TABLE todos3(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );`);
        console.log(results);
        res.status(200).json({ message: 'Table created' });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving todos");
    } finally {
        await (await pool.connect()).release();
    }
}

async function getTodos(req, res) {
    try {
        // Obtener todos los "todos" de la base de datos
        const client = await pool.connect();
        const results = await client.query("SELECT * FROM todos");
        const todos = results.rows;
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving todos");
    } finally {
        // await client.release();
    }
}

async function createTodo(req, res) {
    try {
        // Validar la entrada del body
        const { title } = req.body;
        if (!title) {
            return res.status(400).send("Missing title");
        }

        // Crear un nuevo "todo" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO todos (title) VALUES ($1) RETURNING *",
            [title],
        );
        const newTodo = result.rows[0];
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating todo");
    } finally {
        await client.release();
    }
}

async function getTodoById(req, res) {
    try {
        // Obtener un "todo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM todos WHERE id = $1", [
            id,
        ]);
        const todo = result.rows[0];
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving todo");
    } finally {
        await client.release();
    }
}

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
            "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
            [title, completed, id],
        );
        const updatedTodo = result.rows[0];
        if (!updatedTodo) {
            return res.status(404).send("Todo not found");
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating todo");
    } finally {
        await client.release();
    }
}

async function deleteTodo(req, res) {
    try {
        // Eliminar un "todo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM todos WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("Todo not found");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting todo");
    } finally {
        await client.release();
    }
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
