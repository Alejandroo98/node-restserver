//===============================================
//=====================PORT======================
//===============================================
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

    if ( process.env.NODE_ENV === 'dev'){
        urlDB = 'mongodb://localhost:27017/cafe'
    }else{
        urlDB = process.env.MONGO_URI; // MONGO_URI es una variable de entorno que creamos desde la consola y lo que guarda es el link de la coneccion de la base de datos y la ocultamos por que este link tiene el usuario y la constraseña de nuestra BD; (Este proceso lo anote en el cuaderno en la parte de gitHub)
    }

process.env.URLDB = urlDB;  //URLDB  es un nombre creado en esta linea


