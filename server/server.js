const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('./config/config')
mongoose.set('useCreateIndex', true);
// require('./config/config')

// parse application/x-www-form-urlencoded
app.use(require('./routers/usuario.js'))

app.use(bodyParser.urlencoded({ extended: false }))  // Todos los comuandos que tengan  'use' quiere decir que son unos midelwarse es decir que cada peeticion que se haga siempre pasara primero por un 'use' si asi lo quieres
 
// parse application/json
app.use(bodyParser.json())



  //Mongoose DB
  mongoose.connect('mongodb://localhost:27017/cafe' , { useNewUrlParser : true  , useUnifiedTopology : true } , ( err , res) => {
      if( err ) throw err;
      console.log('Data base is alive in port 27017');
  });
  

app.listen( process.env.PORT , () => {
    console.log('Escuchando en el puerto' ,  process.env.PORT );
})