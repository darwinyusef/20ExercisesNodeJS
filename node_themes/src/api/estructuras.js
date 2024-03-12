const express = require('express');
// crea la ruta 
let router = express.Router();


const animales = ['perro', 'gato', 'pepito', 'pecesito', 'vaquita'];
// function = () => {}
// app.get('/', function); get - post - put - delete
router.get('/hola', (req, res) => {
    res.status(200).json({ 'data': 'Hello World!' });
});

// if( condicion ) {  hacer esto true } else { hacer eso false }
// ( condicion )?  hacer esto true : hacer eso false ;
router.get('/condicional', (req, res) => {
    const a = 10;
    const b = 5;
    let sum = 0;
    let sum2 = 0;

    if (a <= b) {
        sum = a + b;
    } else {
        sum = a - b;
    }

    (a <= b) ? sum2 = a + b : sum2 = a - b;

    res.status(200).json({ 'data': 'Valor de la suma! ' + sum, 'data2': 'Valor de la suma2! ' + sum2 });
});

// for(in, limite,  incrementar) {}
router.get('/for/:id', (req, res) => {
    const id = req.params.id;
    let seleccionado = '';
    let i = 0;
    for (i; i < animales.length; i++) {
        if (i == id) {
            seleccionado = animales[i]
        }
    }
    res.status(200).json({ 'data': 'El for seleccionado es: ' + seleccionado });
});

// iniciador; while (condicion) {  hacer algo incremental ++ }
router.get('/while', (req, res) => {
    const anm = req.query.anm;
    let seleccionado = null;
    let i = 0;
    while (i < animales.length) {
        if (animales[i] == anm) {
            seleccionado = animales[i];
        }
        i++;
    }

    if (!(seleccionado == null)) {
        res.status(200).json({ 'data': 'El while seleccionado fue: ' + seleccionado });
    } else {
        res.status(404).send('No se encontró el animal en la lista');
    }

});

// [array].map(() => { })
router.get('/map', (req, res) => {
    const anm = req.query.anm;
    let seleccionado = null;
    animales.map((response) => {
        if (response == anm) {
            seleccionado = response
        }
    });

    if (!(seleccionado == null)) {
        res.status(200).json({ 'data': 'El Map seleccionado fue: ' + seleccionado });
    } else {
        res.status(404).send('No se encontró el animal en la lista');
    }

});





module.exports = router; 