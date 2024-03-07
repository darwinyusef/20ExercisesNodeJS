
const express = require('express');
const { exec } = require('child_process');
const pool = require('../mysqlConfigurate');
//const faker = require('faker');

const router = express.Router();
const globalUrl = `http://localhost:${process.env.PORT}`;

router.get('/create-table-information', async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS information (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL
            )
        `;

        await pool.query(query);
        res.status(201).json({ message: 'Table created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating table' });
    }
});

router.get('/create-table-data', async (req, res) => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL
            )
        `;

        await pool.query(query);
        res.status(201).json({ message: 'Table created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating table' });
    }
});


router.post('/launch-installation', async (rep, res) => {
    try {
        await exec(`curl -X GET ${globalUrl + '/create-table-information'}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            console.log(`Salida estándar: ${stdout}`);
            console.log(`Salida de error: ${stderr}`);
        });
    } catch (error) {
        console.log(`Salida de error: ${error}`);
    }

    try {
        await exec(`curl -X GET ${globalUrl + '/create-table-data'}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            console.log(`Salida estándar: ${stdout}`);
            console.log(`Salida de error: ${stderr}`);
        });
    } catch (error) {
        console.log(`Salida de error: ${error}`);
    }
    res.status(201).json({ message: 'Migrations lacuch install successfully' });
});

// Populate with datas
// router.post('/populate/information', async (req, res) => {
//     const { numRecords } = req.body;

//     try {
//         const query = `INSERT INTO information (name, description) VALUES ?`;
//         const values = [];

//         for (let i = 0; i < numRecords; i++) {
//             values.push([faker.name.findName(), faker.lorem.sentence()]);
//         }

//         await pool.execute(query, [values]);
//         res.json({ message: `Se insertaron ${numRecords} registros` });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error al insertar datos' });
//     }
// });


module.exports = router;