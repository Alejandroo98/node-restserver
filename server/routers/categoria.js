const express = require('express');
const bodyParser = require('body-parser');
let { verificarToken , verificarAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
const _ = require('underscore');
app.use(bodyParser.urlencoded({ extended: false }));

let Categoria = require('../models/categoria');

// =====================================
// Mostrar todas las categorias
// =====================================
app.get('/categoria' , verificarToken ,( req , res ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limite || 5;
    limit = Number(limit);

    Categoria.find({})
    .skip( desde ) 
    .limit( limit )
    .sort('descripcion') //Lo que hace sort es ordenar en roden alfabeitco su contenido en este caso de 'descripcion' que es el key
    .populate('user' , 'name email') //Lo que hace populate es en caso existe un objectID lo muestra asi que el primer argumento 'user' hace referencia a ese key o nombre dentro del objeto e imprime lo que contiene, lo que viene despues de la coma son los nombres de los keys que quiero que se muestren, solamente esos se mostraran
            .exec( ( err , categorias ) => {

                if( err )
                return res.status(400).json({
                    ok : false,
                    err : {
                        msg : 'No se'
                    }
                })

                Categoria.countDocuments( {} , ( err , counting ) => {
                    res.json({
                        ok : true,
                        categorias,
                        counting
                    })
                })
                    
            })
    
})


// =====================================
// Mostrar una categoria por ID
// =====================================
app.get('/categoria/:id' ,  verificarToken ,( req , res ) => {
    //Categoria.findId(....)
    let id = req.params.id;
    Categoria.findById( id )
    .populate('user ')
    .exec(( err , descDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok : false,
                err
            });
        };

        if ( !descDB ) {
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'El ID no es correcto'
                }
            });
        };

        res.json({
            ok : true,
            descDB
        })
        
    } )
})

// =====================================
// Crear una categoria
// =====================================
app.post('/categoria' ,  verificarToken , ( req , res ) => {

    console.log(req.user._id);
    
    let body = _.pick( req.body , ['descripcion' , 'user'] ); //Esto son los unicos valores que tomara en cuenta
    // let body = req.body;
    let categoria = new Categoria({
        descripcion : body.descripcion,
        user : req.user._id
    });


    categoria.save(( err , descDB ) => {

        if ( err ){
        return res.status(400).json({
                ok : false,
                err 
            });
        };

        if( !descDB ){
            return res.state(400).json({
                ok : false,
                err
            })
        };

        
        res.json({
            ok : true,
            desc : descDB
        })
        
    })

})


// =====================================
// Actualizar una categoria
// =====================================
app.put('/categoria/:id' ,  verificarToken ,( req , res ) => {

    let id = req.params.id
    let body = req.body;
 
    Categoria.findByIdAndUpdate( id , body , { new : true , runValidators : true , useFindAndModify : false} , ( err , descDB ) => { //Esto lo que hace es que lo busca por el id y lo actualiza si lo encuentra

        if( err )
        return res.status(500).json({
            ok : false,
            err
        });

        if( !descDB ){
            return res.state(400).json({
                ok : false,
                err
            })
        };

        res.json({
            ok : true,
            descDB
        })
        
    } )
    
});


// =====================================
// Mostrar una categoria por ID
// =====================================
app.delete('/categoria/:id',  verificarToken ,[ verificarToken , verificarAdmin_Role ]  , ( req , res ) => {
    //Solo un administrador puede borrar categoria
    //Categoria.findIdAndRemove(....)
    let id = req.params.id;
    Categoria.findByIdAndDelete( id , ( err , descDB ) => {

        if( err ) {
            return res.status(500).json({
                ok : false,
                err
            })
        };

        if( !descDB ){
            return res.status(400).json({
                ok : false,
                err : {
                    msg : 'El id no existe'
                }
            })
        };

        res.json({
            ok : true,
            descDB
        })
        

    })
})




module.exports = app;
