const express = require('express');
const router = express.Router();
const moment = require('moment');
const dbConnection = require('../db');


/*renderiza la vista form.hbs la cual es el formulario de ingreso de datos*/
router.get('/add', (req, res) => {
    res.render('forms/form');
})

// router.get('/', (req, res) => {
//     res.render('forms/allTransaction');
// })


/*Valida e ingresa los datos en la base de datos*/
router.post('/add', async (req, res) => {
    try {
        const {
            nombre,
            Rut,
            nombreFantasia,
            sucursales,
            nombreContacto,
            telefono,
            email,
            tipoPlan,
            vendedor,
            fechaCompra,
            estadoSistema,
            EnvioCorreo,
            estado,
            fechaInicioBoleta,
            fechaFinBoleta,
            fechaInicioFactura,
            fechaFinFactura,
            EstaEnLinea,
            emisionDTE,
            comentarios
        } = req.body;
        const transaccionData = {
            Rut,
            nombre,
            nombreFantasia,
            sucursales,
            nombreContacto,
            telefono,
            email,
            tipoPlan,
            vendedor,
            fechaCompra,
            estadoSistema,
            EnvioCorreo,
            estado,
            fechaInicioBoleta,
            fechaFinBoleta,
            fechaInicioFactura,
            fechaFinFactura,
            EstaEnLinea,
            emisionDTE,
            comentarios
        };

        
        const rutEmpresa = await dbConnection.query('SELECT rut from empresas where rut like ? ', [transaccionData.Rut]);
        if (typeof rutEmpresa[0] === "undefined") {
            var empresaData = {
                Rut,
                nombre,
                nombreFantasia,
                sucursales,
                nombreContacto,
                telefono,
                email
            }
            await dbConnection.query('insert into Empresas set ?', [empresaData]);

        }
        

      
        const tipoDePlan = await dbConnection.query('SELECT id from planes where tipo like ? ', [transaccionData.tipoPlan]);
        if (typeof tipoDePlan[0] === "undefined") {

            await dbConnection.query('insert into Planes(tipo) values (?)', [transaccionData.tipoPlan]);

        }
        const rutVendedor = await dbConnection.query('SELECT rut from vendedores where nombre like ? ', [transaccionData.vendedor]);
        
        if (typeof rutVendedor[0] === "undefined") {

            await dbConnection.query('insert into vendedores(nombre) values (?)', [transaccionData.vendedor]);

        }

        var dataInfoCertificacion = {
            emisionDTE,
            estado,
            fechaInicioBoleta,
            fechaFinBoleta,
            fechaInicioFactura,
            fechaFinFactura,
        }
        if (dataInfoCertificacion.emisionDTE === "Si") {
            dataInfoCertificacion.emisionDTE = true;
        } else {
            dataInfoCertificacion.emisionDTE = false;
        }
        
        await dbConnection.query('insert into infoCertificaciones set ?', [dataInfoCertificacion]);
        
        const coleccionIdsInfoCertificaciones = await dbConnection.query('SELECT id from infoCertificaciones');
        var nuevoIdCertificaciones = coleccionIdsInfoCertificaciones.length;
        var idPlan = await dbConnection.query('SELECT id from planes where tipo like ?', [transaccionData.tipoPlan]);

        if (typeof idPlan === 'undefined' || idPlan === null) {
            var coleccionIdPlan = await dbConnection.query('SELECT id from planes');
            idPlan = coleccionIdPlan.length;
        } else {
            idPlan = idPlan[0].id;
        }


        var infoVendedor = rutVendedor[0].rut;
        var Transaccion = {
            fechaCompra,
            Rut,
            idPlan,
            EnvioCorreo,
            nuevoIdCertificaciones,
            estadoSistema,
            comentarios,
            EstaEnLinea,
            infoVendedor

        };
        if (Transaccion.EstaEnLinea === "Si") {
            Transaccion.EstaEnLinea = true;
        } else {
            Transaccion.EstaEnLinea = false;
        }
        if (Transaccion.EnvioCorreo === "Si") {
            Transaccion.EnvioCorreo = true;
        } else {
            Transaccion.EnvioCorreo = false;
        }
        console.log(Transaccion);
        await dbConnection.query('INSERT INTO transacciones(fechaCompra,infoEmpresa,tipoPlan,estadoCorreo,infoCertificacion,estadoSistema,comentario,enLinea,infoVendedores) values(?,?,?,?,?,?,?,?,?)',[Transaccion.fechaCompra,Transaccion.Rut,Transaccion.idPlan,Transaccion.EnvioCorreo,Transaccion.nuevoIdCertificaciones,Transaccion.estadoSistema,Transaccion.comentarios,Transaccion.EstaEnLinea,Transaccion.infoVendedor]);
        
        res.redirect('/');
        // res.render('forms/form',empresaTabla);
    } catch (error) {
        res.status(500);
        console.log(error);
    }

});

router.get('/', async (req, res) => {
    const queryObtenerDatosDeTransacciones = 'select  transacciones.id,empresas.rut, empresas.nombre, empresas.nombreFantasia,Empresas.sucursales,Empresas.nombreContacto,Empresas.telefono,Empresas.email,planes.tipo,Vendedores.nombre,   infoCertificaciones.emisionDTE,infoCertificaciones.estado,DATE_FORMAT(infoCertificaciones.fechaInicioBoleta, "%d/%m/%Y") as fechaInicioBoleta,DATE_FORMAT(infoCertificaciones.fechaFinBoleta , "%d/%m/%Y") as fechaFinBoleta,DATE_FORMAT(infoCertificaciones.fechaInicioFactura , "%d/%m/%Y") as fechaInicioFactura, DATE_FORMAT(infoCertificaciones.fechaFinFactura , "%d/%m/%Y")as fechaFinFactura,  DATE_FORMAT( transacciones.fechaCompra, "%d/%m/%Y") as fechaCompra ,transacciones.estadoCorreo,transacciones.estadoSistema,transacciones.comentario,transacciones.enLinea from transacciones inner join empresas on rut = infoEmpresa inner join planes on planes.id = transacciones.id inner join infoCertificaciones on infoCertificaciones.id = transacciones.id inner join Vendedores on vendedores.rut = infoVendedores;'
   
    var Transacciones = await dbConnection.query(queryObtenerDatosDeTransacciones);
  
    res.render('forms/allTransaction', {Transacciones} );
});


  function insertIntoSet(tabla,coleccion){
            const queryIIS  = 'INSERT INTO ? SET ?'
            return dbConnection.query(queryIIS,[tabla,coleccion]);
        }
        function selectFromWhereLike(dato,tabla,datoAComparar1,datoAComparar2 ){
            const querySFWL = 'SELECT ? FROM ? WHERE ? LIKE ? '
            return dbConnection.query(querySFWL,[dato,tabla,datoAComparar1,datoAComparar2]);
        }
        function validarUndefined(variableAValidar){
            if (typeof rutEmpresa[0] === "undefined"){
                return true;
            }
            return false;
        }
module.exports = router;
// 'select * from transacciones inner join empresas on rut = infoEmpresa  inner join planes on planes.id = transacciones.id inner join infoCertificaciones on infoCertificaciones.id = transacciones.id'