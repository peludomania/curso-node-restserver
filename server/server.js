require('./config/config');

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Enroutador
app.use( require('./controllers/index'));

mongoose.connect(process.env.URLDB, (err, res) => {

    if ( err ) throw err;

    console.log('Base de datos');

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }`)
});
