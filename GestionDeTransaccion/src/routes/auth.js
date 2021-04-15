const express = require('express');
const router = express.Router();
const dbConnection = require('../db');
/*renderiza la vista auth.hbs la cual es el formulario de ingreso de usuario*/


router.get('/auth', (req, res) => {
    res.render('auth/auth');

})

router.post('/auth', async (req, res) => {
    const { rut } = req.body;
    const rutVendedor = rut;
    const existeVendedor = await dbConnection.query('SELECT rut FROM vendedores WHERE rut LIKE ? ',[rutVendedor] );
    if(typeof existeVendedor[0] === 'undefined' ){
        console.error('usuario inexistente');
        res.redirect('/auth');
    }else{
        res.redirect('/add');

    }
    console.log(existeVendedor)

})

module.exports = router;