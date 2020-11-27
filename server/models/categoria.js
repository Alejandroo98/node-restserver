
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let User = require('./usurio')

let categoriaSchema = new Schema({

    descripcion : {
        type : String,
        unique : true,
        required : [ true , 'La descripcion debe de ser unica' ],
    },

    user : {
        type : Schema.Types.ObjectId,
         ref : User
    }
    
});

module.exports = mongoose.model('Categorias' , categoriaSchema );