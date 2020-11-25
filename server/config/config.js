//===============================================
//PORT
//===============================================
process.env.PORT = process.env.PORT || 3000;

//===============================================
//Entorno
//===============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

    if ( process.env.NODE_ENV === 'dev'){
        urlDB = 'mongodb://localhost:27017/cafe'
    }else{
        urlDB = process.env.MONGO_URI; // MONGO_URI es una variable de entorno que creamos desde la consola y lo que guarda es el link de la coneccion de la base de datos y la ocultamos por que este link tiene el usuario y la constraseña de nuestra BD; (Este proceso lo anote en el cuaderno en la parte de gitHub)
    }

process.env.URLDB = urlDB;  //URLDB  es un nombre creado en esta linea

//===============================================
//Vencimiento del token
//===============================================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; //CADUCIDAD_TOKEN es una variable creada en este linea


//===============================================
//SEED de autenticacion
//===============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo' //SEED es una variable creada en este linea - La usamos en el archiv login.js


//===============================================
//Google Client ID
//===============================================
process.env.CLIENT_ID = process.env.CLIENT_ID || "968349260182-llf6rkveqtupg4tcl0okkkom9s88aiv7.apps.googleusercontent.com"
