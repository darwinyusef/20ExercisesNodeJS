const express = require('express');
const router = express.Router();


// creación de la homepage
router.get('/', (req, res) => {
    res.sendFile('./index.html', { root: 'public' });
});

module.exports = router; 
