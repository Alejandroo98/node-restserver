const express = require('express');
const bcrypt = require('bcrypt')
const app = express()
const User = require('../models/usurio')
const bodyParser = require('body-parser');
const _ = require('underscore');
const { count, findOneAndDelete, findByIdAndRemove } = require('../models/usurio');
const { verificarToken , verificarAdmin_Role } = require('../middlewares/autenticacion')
app.use(bodyParser.urlencoded({ extended: false }));


    app.get('/', function (req , res) {
        res.json('Hello World Local');
    });

    app.get( '/users' ,  verificarToken , ( req , res ) => {


        return res.json({ //Esto proviendel archivo autentication -> req.user = decoded.user
            user : req.user, 
            name : req.user.name,
            email : req.user.email
            
        })

        let desde = req.query.desde || 0;
        desde = Number(desde); // asi es como lo pediremos desde postman -> {{url}}/users?desde=15  
        let limit = req.query.limite || 5;
        limit = Number(limit); // asi es como lo pediremos desde postman -> {{url}}/users?limite=15
        //Y si quiero utulizar los dos al mismo tiempo lo hago asi -> {{url}}/users?desde=10&limite=5

        User.find( {} , 'name google email password estado' )
        .skip( desde ) //Skipt es desde que posicion quieres los datos
        .limit( limit )//Limit nos serviara para logicamente poner un limite de datos que queremos ver
                .exec( ( err , users ) => { //.exec quiere decir que ejecute en este caso el find() y esto es lo que nos tendra la respuesta y la guardara en users

                    if( err )
                    return res.status(400).json({
                        ok : false,
                        err
                    })

                    User.countDocuments( { estado : true } , ( err , counting ) => {
                        res.json({
                            ok : true,
                            users,
                            counting
                        })
                    })
                        
                })
        
    })


   
   app.post('/users',  [verificarToken , verificarAdmin_Role ] ,( req , res ) => {  //Para agregar dos o mas middleware los ponemso entre -> []
    //let body = req.body;  //El req.body es la informacion que provien de postman opcion ->  Body x-www-form-urlencoded

    let body = _.pick( req.body , [ 'name' , 'email' , 'img' , 'role' , 'estado' , 'state' , 'password' ] ); //Esto son los unicos valores que tomara en cuenta
    
        let user = new User({
           name : body.name,
           email : body.email,
           password :bcrypt.hashSync( body.password , 10 ),
           role : body.role,
           state : body.state
       })

       user.save(  ( err , userDB ) => {    //User.save( user , ( err , userDB ) => {   

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
  
    app.put('/users/:id', verificarToken , ( req , res ) => {
  
        let id = req.params.id
        let body = req.body;

        User.findByIdAndUpdate( id , body , { new : true , runValidators : true , useFindAndModify : false} , ( err , userDB ) => { //Esto lo que hace es que lo busca por el id y lo actualiza si lo encuentra

            if( err )
            return res.status(400).json({
                ok : false,
                err
            })

            res.json({
                ok : true,
                userDB
            })
            
        } )

  
    })

    app.delete('/users/:id' , verificarToken , ( req , res ) => {

        let id = req.params.id
        let body = req.body;

        User.findByIdAndUpdate( id , { estado : false } , { new : true , runValidators : true } , ( err , userDB ) => { //Esto lo que hace es que lo busca por el id y lo actualiza si lo encuentra
            

            if( err )
            return res.status(400).json({
                ok : false,
                err
            })

            
            res.json({
                ok : true,
                userDB
            })
            
        } )
        

        // User.findByIdAndRemove( id , ( err , userRemove ) => {

        //     if( err ){
        //         return res.status(400).json({
        //             ok : false,
        //             err
        //         })
        //     }

        //     if( !userRemove )
        //     return res.status(400).json({
        //         ok : false,
        //         err : {
        //             message : 'Usuario no encontrado'
        //         }
        //     })
            

        //     res.json({
        //         ok : true,
        //         userRemove
        //     })
            
            
        // } )
        
        
    })
    
  
    app.patch('/user', function ( req , res ) {
      res.json('patch World');
    })

    module.exports = app;
