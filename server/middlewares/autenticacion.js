const jwt = require('jsonwebtoken')

//==========================
//Verificar token
//==========================
let verificarToken = ( req , res , next ) => {
    let token = req.get('token') //get es para obtener la imformacion del los headers

    jwt.verify( token , process.env.SEED , ( err , decoded ) => { //token es el toke que envia el usuario , process.env.SEED es la variable de entorno que creamos desde la consola y que guarda la firma del token

        if ( err ) {
            return res.status(401).json({
                ok : false,
                err
            })
        }
        
         req.user = decoded.user
        next() // Una vez que ingresa a este middleare y si todo esta en orden continuara ejecutando lo que esta dentro de la funcion app.get( '/users' , bla bla bla), para eso sirve el next
    })

}

let verificarAdmin_Role = ( req , res , next ) => {

    let user = req.user;

    if ( user.role === 'ADMIN_ROLE' ) {
        next()
    }else{
        res.json({
            ok : false,
            err : {
                msg : 'El usuario no es administrador'
            }
        })
    }
    
};

// =====================
// Verifica token para imagen desde URL
// =====================
 let verificaTokenImg = ( req , res , next ) =>{
    let token = req.query.token; // Gracias a esto obtenemos la informacion que viene desde la URL,es decir con req.query y el nombre que tenemos que poner en la URL en este caso token por eso queda asi req.query.token

    jwt.verify( token , process.env.SEED , ( err , decoded ) => { //token es el toke que envia el usuario , process.env.SEED es la variable de entorno que creamos desde la consola y que guarda la firma del token

        if ( err ) {
            return res.status(401).json({
                ok : false,
                err : {
                    msg : 'Token no valido'
                }
            })
        }
        
         req.user = decoded.user

        next() // Una vez que ingresa a este middleare y si todo esta en orden continuara ejecutando lo que esta dentro de la funcion app.get( '/users' , bla bla bla), para eso sirve el next
    })
 };


module.exports = {
    verificarToken,
    verificarAdmin_Role,
    verificaTokenImg
}