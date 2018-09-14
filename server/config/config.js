



// ==========================================
//  Puerto, si no está definido, ponemos el 3000
// ==========================================

process.env.PORT = process.env.PORT || 3000;

// ==========================================
//  Entorno. La variable NODE_ENV la proporciona Heroku
// ==========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================================
//  Base de datos
// ==========================================
let urlDB;

if ( 'dev' === process.env.NODE_ENV) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;