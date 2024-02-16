// index.js
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const dotenv = require('dotenv');
const convert = require('xml-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Path to XML file
const XML_FILE_PATH = './src/data.xml';

// Ensure that the XML file exists and has valid content
function initializeXmlFile() {
    const initialData = {
        expenses: []
    };
    fs.writeFileSync(XML_FILE_PATH, convert.json2xml(initialData, { compact: true, ignoreComment: true, spaces: 4 }), 'utf8');
}

// Read data from XML file
function readData() {
    try {
        const data = fs.readFileSync(XML_FILE_PATH, 'utf8');
        return data; // Devuelve la cadena sin analizarla como JSON
    } catch (error) {
        console.error('Error reading XML file:', error);
        initializeXmlFile();
        return fs.readFileSync(XML_FILE_PATH, 'utf8');
    }
}

// Write data to XML file
function writeData(data) {
    fs.writeFileSync(XML_FILE_PATH, data, 'utf8');
}

// Convert data to XML
function convertToXml(data) {
    return convert.json2xml(data, { compact: true, ignoreComment: true, spaces: 4 });
}

// Calculate total expenses
function calculateTotalExpenses(data) {
    let total = 0;
    data.expenses.forEach(expense => {
        total += parseFloat(expense.amount._text);
    });
    return total;
}

// CRUD operations with XML response

// POST operation to add a new expense
app.post('/expenses', (req, res) => {
    const newExpense = req.body;
    const data = JSON.parse(readData());
    newExpense.id = data.expenses.length + 1;
    data.expenses.push(newExpense);
    writeData(convertToXml(data));
    res.set('Content-Type', 'text/xml');
    res.send(convertToXml(newExpense));
});

// PUT operation to update an existing expense
app.put('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const updatedExpense = req.body;
    const data = JSON.parse(readData());
    const expenseIndex = data.expenses.findIndex(expense => parseInt(expense.id._text) === expenseId);
    if (expenseIndex !== -1) {
        updatedExpense.id = expenseId;
        data.expenses[expenseIndex] = updatedExpense;
        writeData(convertToXml(data));
        res.set('Content-Type', 'text/xml');
        res.send(convertToXml(updatedExpense));
    } else {
        res.status(404).send(convertToXml({ message: 'Expense not found' }));
    }
});

// DELETE operation to delete an expense
app.delete('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const data = JSON.parse(readData());
    const expenseIndex = data.expenses.findIndex(expense => parseInt(expense.id._text) === expenseId);
    if (expenseIndex !== -1) {
        data.expenses.splice(expenseIndex, 1);
        writeData(convertToXml(data));
        res.set('Content-Type', 'text/xml');
        res.send('<message>Expense deleted successfully</message>');
    } else {
        res.status(404).send(convertToXml({ message: 'Expense not found' }));
    }
});

// GET operation to show all expenses
app.get('/expenses', (req, res) => {
    const data = readData();
    res.set('Content-Type', 'text/xml');
    res.send(data);
});

// GET operation to generate a report of total expenses
app.get('/expenses/report', (req, res) => {
    const data = JSON.parse(readData());
    const totalExpenses = calculateTotalExpenses(data);
    res.set('Content-Type', 'text/xml');
    res.send(`<total>${totalExpenses}</total>`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





