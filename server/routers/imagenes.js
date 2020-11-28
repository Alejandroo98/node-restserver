const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificarToken , verificaTokenImg } = require('../middlewares/autenticacion')

app.get('/imagen/:tipo/:img' , verificaTokenImg , ( req , res ) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve( __dirname , `../../uploads/${ tipo }/${ img }` ) 

    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg )
    }else{
        let noIathImg = path.resolve( __dirname, '../assets/no-image.jpg' )
        res.sendFile(noIathImg); // Lo que hace sendFile es regresar un archivo sin importar cual sea este
    };
    
    
    
});


module.exports = app;
