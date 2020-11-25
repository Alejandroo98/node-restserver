const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express()
require('../config/config')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


});

//Coniguraciones de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload);

    return {
        name : payload.name,
        email : payload.email,
        img : payload.picture,
        google : true
    }
    
    // const userid = payload['sub'];
    
  }
//   verify().catch(console.error);



app.post( '/google',  async ( req , res ) => {

    let token = req.body.idtoken

    let googleUser =  await verify(token)
                    .catch( e => {

                        return res.status(400).json({
                            ok : false,
                            err : e
                        })
                    } )

    
    // res.json({
    //     user : googleUser
    // })

    User.findOne( { email : googleUser.email } , ( err , userDB ) => {
        
        if ( err ) {
            return res.status(500).json({
                ok : false,
                err
            })
        }

        if( userDB ) {

            if( userDB.google === false ) {

                return res.status(400).json({
                    ok : false,
                    err : {
                        msg : 'Debe de usar su autenticacion normal'
                    }
                })
                
            }else{

                let token = jwt.sign({
                    user : userDB
                } , process.env.SEED , { expiresIn : process.env.CADUCIDAD_TOKEN })
                
                return res.json({
                    ok : true,
                    user : userDB,
                    token
                })
                
            }
            
        }else{
            //Si el usuario no existe en nuestra base de de datos
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save( ( err , userDB ) => {
                console.log(userDB);
                
                if( err ){
                    res.status(500).json({
                        ok : false,
                        err
                    })
                };

                let token = jwt.sign({
                    user : userDB,
                } , process.env.SEED , { expiresIn : process.env.CADUCIDAD_TOKEN } )

                return res.json({
                    ok : true,
                    user : userDB,
                    token
                })
                
            } )
            
        }
        
    })

})

//C.121

module.exports = app;