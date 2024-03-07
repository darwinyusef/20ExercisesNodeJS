const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Exportaciones
const pool = require('./mysqlConfigurate');
const app = express();
const port = process.env.PORT;


// Middleware to parse JSON body data
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use('/', require('./migrations/lauch-migrations'));



// Create (POST) endpoint
app.post('/data', async (req, res) => {
    try {
        const { name, description } = req.body;
        // Prepare the SQL statement with placeholders to prevent SQL injection
        const query = `INSERT INTO information (name, description) VALUES (?, ?)`;
        const values = [name, description];

        // Execute the prepared statement with the sanitized values
        const [result] = await pool.execute(query, values);

        res.status(201).json({ message: 'Data inserted successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating data' });
    }
});

// Read (GET) all endpoint
app.get('/data', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM information');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Read (GET) by ID endpoint
app.get('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Prepared statement to prevent SQL injection
        const query = `SELECT * FROM information WHERE id = ?`;
        const values = [id];
        const [rows] = await pool.execute(query, values);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Update (PUT) endpoint
app.put('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        // Prepared statement to prevent SQL injection
        const query = `UPDATE information SET name = ?, description = ? WHERE id = ?`;
        const values = [name, description, id];
        await pool.execute(query, values);

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating data' });
    }
});

// Delete (DELETE) endpoint
app.delete('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Prepared statement to prevent SQL injection
        const query = `DELETE FROM data WHERE id = ?`;
        const values = [id];
        await pool.execute(query, values);

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting data' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});