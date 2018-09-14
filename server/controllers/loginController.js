const express = require('express');
const User = require('../../models/user');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    let credentials = {
        email: body.email
    };

    User.findOne(credentials, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrectos'
                }
            });
        }

        //if ( !bcrypt.compareSync(body.password, usuarioDB.password ) ) {
        if ( body.password !== usuarioDB.password ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, 'secret', { expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            user: usuarioDB,
            token
        });

    });

});


module.exports = app;