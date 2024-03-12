const express = require('express');
const fs = require('fs');

// crea la ruta 
let router = express.Router();
let users = [];
function readData() {
    const jsonData = fs.readFileSync('./src/data.json', 'utf-8');
    users = JSON.parse(jsonData);
}
readData();

// GET
router.get('/users', (req, res) => {
    res.status(200).json(users);
});

// SHOW
router.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((item) => item.id === id);

    if (user === undefined) {
        return res.status(404).json({ 'error': 'No se encontró el usuario en la lista' });
    }
    res.status(200).json(user);
});

// CREATE
router.post('/users', (req, res) => {
    const userInfo = req.body;
    users.push(userInfo);
    res.status(201).json(users);
});

// UPDATE
router.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((item) => item.id === id);
    const userInfo = req.body;
    if (!user) {
        return res.status(404).json({ 'error': 'No se encontró el usuario en la lista' });
    }
    Object.assign(user, userInfo);

    res.status(201).json(user);
});

// DELETE
router.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({ 'error': 'No se encontró el usuario en la lista' });
    }
    users.splice(index, 1);
    res.status(201).json({ "ms": "Objeto eliminado", "data": users });
});


module.exports = router; 