const express = require('express');
const router = express.Router();
const fs = require('fs');
const OpenAI = require('openai');

// configuración de OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});


router.get('/chats', async (req, res) => {
    let mensaje  = decodeURI(req.query.pregunta); 
    if(mensaje === 'undefined') {
        return res.status(404).send('El sitio no ha sido encontrado por favor regrese a la url anterior', 404);
    }
    const data = fs.readFileSync("./src/public/entrenamiento.json", 'utf-8');
    if (mensaje.toLowerCase().includes('pregunta pregunta')) {
        mensaje = "Dame una palabra dificil del diccionario que pudiera aprender hoy y su significado y expresalo de manera magica"
    } else {
        mensaje = `Dame el significado de ${mensaje} para aprenderla y su significado a tener en cuenta ${JSON.stringify(data)}`
    }
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            role: 'user', content: `mensaje del usuario: ${mensaje}`
        }],
        model: 'gpt-3.5-turbo',
    });
    res.status(201).json({ response_gpt: chatCompletion.choices[0].message });
});




module.exports = router; 