const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const expresshbs = require('express-handlebars');

const path = require('path');

//settings
app.set('port', process.env.PORT || port);

// initializing mtv hbs
app.set('views', path.join(__dirname,'views')); 
app.engine('.hbs',expresshbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine','.hbs');



//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));//inavilita lo que no sea texto normal
app.use((req,res,next)=>{
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/Transactions',require('./routes/formEmpresa'));




//public 
app.use(express.static(path.join(__dirname,'public')))

//starting
app.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'));
})