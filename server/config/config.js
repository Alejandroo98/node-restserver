//===============================================
//=====================PORT======================
//===============================================
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if ( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://Alava-own:1234@cluster-1.nio54.mongodb.net/cafe'
}

process.env.URLDB = urlDB;  //URLDB  es un nombre creado en esta linea


