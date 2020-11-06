const express = require('express');
const bcrypt = require('bcrypt')
const app = express()
const User = require('../models/usurio')
const bodyParser = require('body-parser');
const _ = require('underscore');
app.use(bodyParser.urlencoded({ extended: false }));


    app.get('/', function (req , res) {
        res.json('Hello World Local');
    });

    app.get( '/users' , function( req , res ){

        let desde = req.query.desde || 0;
        desde = Number(desde); // asi es como lo pediremos desde postman -> {{url}}/users?desde=15  
        let limit = req.query.limite || 5;
        limit = Number(limit); // asi es como lo pediremos desde postman -> {{url}}/users?limite=15
        //Y si quiero utulizar los dos al mismo tiempo lo hago asi -> {{url}}/users?desde=10&limite=5

        User.find()
        .skip( desde ) //Skipt es desde que posicion quieres los datos
        .limit( limit )//Limit nos serviara para logicamente poner un limite de datos que queremos ver
                .exec( ( err , users ) => { //.exec quiere decir que ejecute en este caso el find() y esto es lo que nos tendra la respuesta y la guardara en users

                    if( err )
                    return res.status(400).json({
                        ok : false,
                        err
                    })

                    res.json({
                        ok : true,
                        users
                    })
                    
                })
        
    })


   
   app.post('/user', function( req , res ) {
    //let body = req.body;  //El req.body es la informacion que provien de postman opcion ->  Body x-www-form-urlencoded

    let body = _.pick( req.body , [ 'name' , 'email' , 'img' , 'role' , 'estado' ] )
    
        let user = new User({
           name : body.name,
           email : body.email,
           password : bcrypt.hashSync( body.password , 10 ),
           role : body.role
       })

       user.save( ( err , userDB ) => {

        if( err )
        return res.status(400).json({
            ok : false,
            err
        })

        res.json({
            ok : true,
            usuario : userDB
        })
        
       } ) 
       
    })
  
    app.put('/user/:id', function ( req , res ) {
  
        let id = req.params.id
        let body = req.body;

        User.findByIdAndUpdate( id , body , { new : true , runValidators : true } , ( err , userDB ) => { //Esto lo que hace es que lo busca por el id y lo actualiza si lo encuentra

            if( err )
            return res.status(400).json({
                ok : false,
                err
            })

            res.json({
                ok : true,
                usuario : userDB
            })
            
        } )

  
    })
  
    app.patch('/user', function ( req , res ) {
      res.json('patch World');
    })

    module.exports = app;
