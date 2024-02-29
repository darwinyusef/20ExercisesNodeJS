const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('', (req, res) => {
    res.send('iniciación');
});
app.get('/usuarios', async (req, res) => {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
});

app.get('/usuarios/:id', async (req, res) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
    });
    res.json(usuario);
});

app.post('/usuarios', async (req, res) => {
    const usuario = await prisma.usuario.create({
        data: req.body,
    });
    res.json(usuario);
});

app.put('/usuarios/:id', async (req, res) => {
    const usuario = await prisma.usuario.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: req.body,
    });
    res.json(usuario);
});

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.usuario.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    res.json({ message: 'Usuario eliminado' });
});

app.get('/productos', async (req, res) => {
    const productos = await prisma.producto.findMany({
        include: {
            usuario: true,
        },
    });
    res.json(productos);
});

app.get('/productos/:id', async (req, res) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
        include: {
            usuario: true,
        },
    });
    res.json(producto);
});

app.post('/productos', async (req, res) => {
    const producto = await prisma.producto.create({
        data: req.body,
    });
    res.json(producto);
});

app.put('/productos/:id', async (req, res) => {
    const producto = await prisma.producto.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: req.body,
    });
    res.json(producto);
});

app.delete('/productos/:id', async (req, res) => {
    await prisma.producto.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    res.json({ message: 'Producto eliminado' });
});

app.get('/productos/usuario/:usuarioId', async (req, res) => {
    const productos = await prisma.producto.findMany({
        where: {
            usuarioId: parseInt(req.params.usuarioId),
        },
        include: {
            usuario: true,
        },
    });
    res.json(productos);
});

app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;