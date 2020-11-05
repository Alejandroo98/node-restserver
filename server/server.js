const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require('./config/config')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))  // Todos los comuandos que tengan  'use' quiere decir que son unos midelwarse es decir que cada peeticion que se haga siempre pasara primero por un 'use' si asi lo quieres
 
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
  res.json('Hello World');
})
 
 app.post('/user', function (req, res) {
     let body = req.body;  //El req.body es la informacion que provien de postman opcion ->  Body x-www-form-urlencoded

     if(body.name === undefined)
     res.status(400).json({
         results : false,
         mse : 'The name is necesary'
     })
     else
     res.json({
         "persona" : body
     })
  })

  app.put('/user/:id', function (req, res) {

    let id = req.params.id
    res.json({
        id
    })

  })

  app.patch('/user', function (req, res) {
    res.json('patch World');
  })
  

app.listen( process.env.PORT , () => {
    console.log('Escuchando en el puerto' ,  process.env.PORT );
})