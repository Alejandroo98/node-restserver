const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express()
require('../config/config')
const User = require('../models/usurio')

app.post( '/login', function( req , res ){

    let body = req.body;
    User.findOne( { email : body.email } , ( err , userDB ) =>{

        if( err )
        return res.status(500).json({
            ok : false,
            err
        })

        if( !userDB )
        return res.status(400).json({
            ok : false,
            err : {
                message : '(Usuario) o contraseña incorrectos'
            }
        })

        //Esto lo que hace es comprar la contraseña que envio con la que existe dentro de la base de datos ( Lo que hace es encriptar la contraseña que envio y coompara si exitse un igual dentro de la base de datos )
        if( !bcrypt.compareSync( body.password , userDB.password ) ) //body.password es la que envio y userDB.password es la que esta en la base de datos
        return res.status(400).json({
            ok : false,
            err : {
                msg : 'Usuario o (contraseña) incorrectos'
            }
        });

        //Esto sirve para generrar un token
        let token = jwt.sign({
            user : userDB //Esta el la informacion que guardar el token
        } , process.env.SEED , { expiresIn : process.env.CADUCIDAD_TOKEN } ) // process.env.SEED es la firma del token y esto es como una clave del token - luego viene la fecha de expiracion que eneste caso esta en un mes , primer son los segudos luego los minutos las horas los dias los meses etc, y que su valor se encuentra en el archivo llamado config.js

        
        res.json({
            ok : true,
            userDB,
            token : token
        })
        
        
    } )
    

})

//C.121

module.exports = app;