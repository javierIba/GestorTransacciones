const express = require('express');
const router = express.Router();
const dbConnection = require('../db');
const moment = require('moment');
/*renderiza la vista auth.hbs la cual es el formulario de ingreso de usuario*/


router.get('/allTransactions', (req, res) => {
    res.render('forms/allTransaction');
})


module.exports = router;