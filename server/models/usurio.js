const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values : [ 'ADMIN_ROLE' , 'USER_ROLE' , 'SUPER_ROLE' ],
    message : '{VALUE} no es un rol valido' //Lo que esta en parentecis y en mayusculas es como una variable que vendra con la informacion que ingreses en postman
}

let Schema = mongoose.Schema
let usuarioSchema = new Schema({

    name : {
        type : String,
        required: [true , 'El nombre es necesario']
    },
    
    email : {
        type : String,
        unique : true,
        required : [true , 'El email es necesario']
    },
    
    password : {
        type : String,
        required : [ true , 'La contraseña es obligatoria' ]
    },
    
    img : {
        type : String
    },
    
    role : {
        type : String,
        default : 'USER_ROLE',
        enum : rolesValidos 
    },
    
    estado : {
        type : Boolean,
        default : true
    },
    
    google : {
        type : Boolean,
        default : false
    },

    state : {
        type : String
    }
    
});

//Esto sirve para ocultar el password al momento de imprimirno en pantalla
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchema.plugin( uniqueValidator , { message : '{PATH} debe de ser unico' } )
module.exports = mongoose.model( 'usuarios' , usuarioSchema )


