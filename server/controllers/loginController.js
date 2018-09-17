const express = require('express');
const User = require('../models/user');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        }, process.env.SECRET_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            user: usuarioDB,
            token
        });

    });

});

//Configuraciones de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch( e => {
           return res.status(403).json({
               ok: false,
               err: e
               });
        });

    User.findOne( {email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( usuarioDB ) {
            if (false === usuarioDB.google ) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SECRET_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    user: usuarioDB,
                    token
                })
            }
        } else {
            // El usuario aún no existe en la base de datos
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, usuarioDB) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SECRET_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN});

                    return res.json({
                        ok: true,
                        user: usuarioDB,
                        token
                    });
                }
            });
        }

    });

});



module.exports = app;