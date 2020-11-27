var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Categoria = require('./categoria');
let User = require('./usurio');


var productoSchema = new Schema({
    name: { 
        type: String,
         required: [true, 'El nombre es necesario'] 
    },
    precio: {
         type: Number,
          required: [true, 'El precio únitario es necesario'] 
        },
    descripcion: {
         type: String,
          required: false 
        },
    disponible: {
         type: Boolean,
         default: true,
          required: true
        },
    categoria: {
         type: Schema.Types.ObjectId, 
         ref: Categoria,
         required: true
        },
    user: { 
        type: Schema.Types.ObjectId,
         ref: User
    }
});


module.exports = mongoose.model('Producto', productoSchema);