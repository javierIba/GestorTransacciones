/* Conexion con la base de datos */


const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            Console.error('Se perdio la conexion con la base de datos');
            return;
        }else
        if(err.code === 'ER_CON_COUNT_ERROR'){
            Console.error('La base de datos tiene multiples conexiones');
            return;
        }else
        if(err.code === 'ECONNREFUSED'){
            console.error('Conexion con la base de datos rechadasa');
            return;
        }else{
            console.error('error de conexion: ' + err.stack);
            return;
        }
    }

    if(connection){
        connection.release();
        console.log('La base de datos se conecto exitosamente');
        return;
    }
    
})

pool.query = promisify(pool.query);
module.exports=pool;


// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '22.jaigibac.22'
// });
 
// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('connected as id ' + connection.threadId);
// });
