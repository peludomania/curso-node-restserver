const express = require('express');
const app = express();

//app.use( require('./mainController'));

app.use( require('./userController'));

app.use( require('./loginController'));

app.use( require('./categoria'));

app.use( require('./producto'));

app.use( require('./upload'));

module.exports = app;