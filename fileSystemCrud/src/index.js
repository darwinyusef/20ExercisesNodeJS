// index.js
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const dotenv = require('dotenv');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));





// Read data from JSON file
function readData() {
    const data = fs.readFileSync('./src/data.json', 'utf8');
    return JSON.parse(data);
}

// Write data to JSON file
function writeData(data) {
    fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2), 'utf8');
}

// CRUD operations
app.get('/products', (req, res) => {
    const data = readData();
    res.json(data);
});

app.post('/products', (req, res) => {
    const newData = req.body;
    const data = readData();
    newData.id = data.length + 1;
    data.push(newData);
    writeData(data);
    res.json(newData);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    const data = readData();
    const index = data.findIndex(item => item.id === productId);
    if (index !== -1) {
        newData.id = productId;
        data[index] = newData;
        writeData(data);
        res.json(newData);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const data = readData();
    const index = data.findIndex(item => item.id === productId);
    if (index !== -1) {
        data.splice(index, 1);
        writeData(data);
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});