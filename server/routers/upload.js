const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/usurio');
const Productos = require('../models/producto')
const fs = require('fs'); //Esta libreria viene ya en node no toca instalar nada, fs = file system
const path = require('path'); // Esta libreria viene ya en node no toca instalar nada

// dfault options 
app.use(fileUpload({ useTempFiles: true })); //Esto es un midleware

app.put('/upload/:tipo/:id' , ( req , res ) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    
    if( !req.files ){ //En caso no subas ningun archivo
        return res.status(400).json({
            ok : false,
            err : {
                msg : 'No se ha seleccionado ningun archivo'
            }
        })
    };

    //Validar tipo
    let tiposValidos = ['productos' , 'usuarios'];

    if( tiposValidos.indexOf( tipo ) === -1 ){
        return res.status(400).json({
            ok : false,
            err : {
                msg : 'Los tipos validos son: ' + tiposValidos.join(' - ')
            }
        }) 
    };
    
    
    let archivo = req.files.archivo; //Archivo es la variable que guardara nuestro archivo y que tenemos que escribir en 'from-data'
    let nombreCortado = archivo.name.split('.'); //Lo que hace split es buscar las palabras que esten speradas en este caso por un punto y las coloca en un arreglo de forama independiente.
    let extencion = nombreCortado[nombreCortado.length - 1]; // Lo que hacemos aqui traer solamente la extencion de cada archivo que se suba, como dije arriba el nombre se seára y sus partes se guardan en un arreglo para asi nosotros poder saber cual es su extencion y en base a eso darle permisos o no y po reso queremos el ultimo arreglo siempre que es ahi donde se guardara el nombre de la extencion

    //Extenciones permitidas
    let extencionesValidas = [ 'png' , 'jpg' , 'gif' ] //Estas seran las extenciones permitidas que se podran subir

    if(extencionesValidas.indexOf(extencion) === -1){ //Recuerda que indexOf lo que hace es buscar dentro de un arreglo si existe la palabra le que especifiquemos entre parentecis que en este caso es el nombre de la extencion y luego retorna un -1 si no existe o el indice en donde se encuentra el nombre dentro del arreglo
        return res.status(400).json({
            ok : false,
            err:{
                msg : 'Las extenciones validas son ' + extencionesValidas.join(' - ')
            }
        })
    };

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extencion }`;
    
    archivo.mv( `uploads/${ tipo }/${ nombreArchivo }` , ( err ) => { //Esta es la ruta en donde se guardara el archivo que subamos junto con el nombre del mismo

        if( err ){
            return res.status(500).json({
                ok : false,
                err
            })
        };

        //Aqui , imagen cargada

        
        if ( tipo === 'usuarios' ){
            imagenUsuario( id , res , nombreArchivo );
        }

        if ( tipo === 'productos' ){
            imagenProducto( id , res , nombreArchivo );
        }
        
        
        
    })
    
});

function imagenUsuario( id , res , nombreArchivo ){

    User.findById( id , ( err , userDB ) => {

        if( err ){
            borrarArchivo( nombreArchivo , 'usuarios' );
            return res.status(500).json({
                ok : false,
                err
            })
        };

        if( !userDB ){
            borrarArchivo( nombreArchivo , 'usuarios' );
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'Usuario no existe'
                }
            })
        }



        //ESTO ES REEMPLAZADO CON LA FUNCION DE ABAJO LLAMADA borrarArchivo() 
        //let pathImagen = path.resolve( __dirname , `../../uploads/usuarios/${userDB.img}`) // Lo que hace esto es encontrar la direccion de la imagen en este caso la que viene en el usuario.img y bueno si existe ya esa imagen dentro del directorio o de la carpeta la elimina si no pues no pasa nada , crea una
        //if( fs.existsSync(pathImagen)){ //fs = file sistem
          //      fs.unlinkSync(pathImagen) // Y fs.unlinkSync sivre para eliminar un archivo en particular en un lugar en particular
        //}  //fs.existsSync sirve para saber si existe un archivo determinado en un lugar determiado y devuelve true o false;

        borrarArchivo( userDB.img , 'usuarios' );

        
        userDB.img = nombreArchivo; //Aqui es donde agrega la imagen
        
        userDB.save( (err , userGuardado) => {

            res.json({
                ok : true,
                user : userGuardado,
                img : nombreArchivo
            })

            
        });
        
    });
    
};

function imagenProducto( id , res ,nombreArchivo ){

    Productos.findById( id , ( err , productoDB ) =>{

        if ( err ) {
            borrarArchivo( nombreArchivo , 'productos' )
            res.status(400).json({
                ok : false,
                err
            })
        };

        if( !productoDB ){
            borrarArchivo( nombreArchivo , 'productos' );
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'El ID del producto no existe'
                }
            })
        };


        borrarArchivo( productoDB.img , 'productos' );

        
        productoDB.img = nombreArchivo
        productoDB.save( ( err , productoGuardado ) =>{

            res.json({
                ok : true,
                producto : productoGuardado,
                img : nombreArchivo
            })

        });
        
    });

};

function borrarArchivo( nombreImg , tipo ){

    let pathImagen = path.resolve( __dirname , `../../uploads/${ tipo }/${ nombreImg }` )
    if( fs.existsSync( pathImagen ) ){
        fs.unlinkSync( pathImagen )
    }
    
};


module.exports = app;