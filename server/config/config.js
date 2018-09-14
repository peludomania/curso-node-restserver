



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
    /**
     * La variable MONGO_URI la hemos creado nosotros en heroku para que no sea información pública
     *
     * para crearla, hemos ejecutado la siguiente orden
     * heroku config:set MONGO_URI="mongodb://curso-node:XXX@ds257372.mlab.com:57372/cafe"
     *
     * para ver todas las variables que tenemos creadas, solo hay que poner
     * heroku config
     */
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;