const express = require('express');
const app = express();
const { verificarToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');


//===========================
//Obtener productos
//===========================
app.get('/productos' , verificarToken , ( req , res ) => {

    let limit = req.query.limite || 5;
    let desde = req.query.desde || 0;

    Producto.find({ disponible : true }) //No olives que le que esta dentro del parentesis son los objetos que mostrara que cumplan con esa condicion
    .skip(desde)
    .limit(limit)
    .populate('categoria user' , 'name descripcion') //Categoria  y user son los nombres o los keys de los objetosID y name y descripcion es el contenido de cada uno de estos objectID que queremos que se imprima
    .exec( ( err , productosDB ) => {

        if( err ){

            return res.status(400).json({
                ok : false,
                err
            })
            
        };

        res.json({
            ok : true,
            productosDB
        })



    });
    
    //trae todos los poductos
    //populate : user , categoria
    //paginado
});


//===========================
//Obtener producto por ID
//===========================
app.get('/productos/:id' , ( req , res ) => {

    let id = req.params.id;

    Producto.findById( id )
    .populate('user categoria' , 'name descripcion' )
    .exec(( err , productoDB ) => {

        if( err ){
             return res.status(500).json({
                ok : false,
                err
            })
        };

        if(!productoDB ){
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'El ID no existe'
                }
            })
        };
        
        res.json({
            ok : true,
            productoDB
        });
        
        
    } )
    
    //populate : user , categoria
});


// =============================
// Buscar productos
// =============================
app.get('/productos/buscar/:termino' , verificarToken , ( req , res ) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino , 'i'); //lo que hace new RegExp es buscar coindidencias en base a una palabra en este casos que se guarda en la variable termino y lo que viene despues es decir 'i' lo que es es que sea incencible a las mayusculas y minusculas. ( new RegExp es uan funcion de JS)

    Producto.find({ name : regex })
    .populate('user' , 'name email')
    .populate('categoria' , 'descrpcion')
    .exec( ( err , productoDB ) => {

        if ( err ) {
            res.status(500).json({
                ok : false,
                err
            })
        };

        res.json({
            ok : true,
            productoDB
        })
        
        
    })
    
});


//===========================
//Crear un producto
//===========================
app.post('/productos' , verificarToken , ( req , res ) => {

    let body = req.body;
    
    let producto = new Producto({
        name : body.name,
        precio : body.precio,
        user : req.user._id,
        categoria : body.categoria,
        descripcion : body.descripcion
    });

    producto.save( ( err , productoDB ) => {
        if( err ){
                return res.status(500).json({
                        ok : false,
                        err
                    })
        };

        if( !productoDB ){
                return res.status(400).json({
                    ok : false,
                    err : {
                        msg : 'No se puedo guardar el producto'
                    }
                })
        };


        res.status(201).json({ //el status 201 queire decir que salio bien, es una pcion diferente que podemos hacer
            ok : true,
            productoDB
        })
        
        
    })
    
    //guardar el usuario
    //guardar una categoria del listado
});



//===========================
//Editar o actualizar un prducto
//===========================
app.put('/productos/:id' , ( req , res ) => {

    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate( id , body , { new : true }  , ( err , productoDB ) => {

        if( err ){
            return  res.status(500).json({
                ok : false,
                err
            })
        };

        if( !productoDB ){
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'El producto no fue encontrado'
                }
            })
        };

        res.json({
            ok : true,
            productoDB
        })
        
        
    })
    
    //grabar el usuario
    //
});



//===========================
//Borrar un producto
//===========================
app.delete('/productos/:id' , ( req , res ) => {

    let id = req.params.id;
    
    Producto.findByIdAndUpdate( id , { disponible : false } , { new : true }  , ( err , productoDB ) => {

        if( err ){
            return res.status(500).json({
                ok : false,
                err
            })
        };

        if( !productoDB ){
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'EL ID es incorrecto'
                }
            })
        };

        res.json({
            ok : true,
            productoDB
        })
        
    } )
    
    //cambiar el estado de disponible a false
});





module.exports = app;
