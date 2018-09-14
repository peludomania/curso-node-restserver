const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.json('Hello World')
});

module.exports = app;