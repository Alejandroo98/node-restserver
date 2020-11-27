const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path'); //Este paquete no hay que instalarlo por que ya lo trae node
require('./config/config')
mongoose.set('useCreateIndex', true);
// require('./config/config')

// parse application/x-www-form-urlencoded

//Configuracion global de rutas
app.use(require('./routers/index.js'));



app.use(bodyParser.urlencoded({ extended: false }))  // Todos los comuandos que tengan  'use' quiere decir que son unos midelwarse es decir que cada peeticion que se haga siempre pasara primero por un 'use' si asi lo quieres

// parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use( express.static(path.resolve( __dirname , '../public')))

//Mongoose DB
mongoose.connect( process.env.URLDB , { useNewUrlParser : true  , useUnifiedTopology : true , useCreateIndex : true } , ( err , res) => {
  if( err ) throw err;
  console.log('Data base is alive in port ' , process.env.URLDB);
});


app.listen( process.env.PORT , () => {
    console.log('Escuchando en el puerto' ,  process.env.PORT );
})