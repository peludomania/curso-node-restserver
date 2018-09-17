const express = require('express');
const app = express();

//app.use( require('./mainController'));

app.use( require('./userController'));

app.use( require('./loginController'));

app.use( require('./categoria'));

app.use( require('./producto'));

module.exports = app;