const express = require('express');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');//El standard de uso de underscore es volcarlo en una constante solo con "_"

const app = express();

app.get('/usuario', function (req, res) {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    //la cadena en el segundo parámetro indica los campos que queremos entregar, si lo omitimos entrega todos
    User.find({ status: true }, 'name email role status google')
        .skip(Number(from))
        .limit(Number(limit))
        .exec( (err, users) => {
            if (err) {
                return res.status(400).json({
                   ok: false,
                   err
                });
            }

            User.count({ status: true }, (err, count) => {
                res.json({
                    ok:true,
                    users,
                    count
                });
            });

        });
});

app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new User({
       name: body.name,
       email: body.email,
       password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
           ok: true,
           user: userDB
        });

    });
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);//con underscore "_" decidimos que campos se pueden utilizar

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            user: userDB
        });
    });

});

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    let body = {
        status: false
    };

    //User.findByIdAndRemove(id, (err, deletedUser) => { //borrado fisico
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, deletedUser) => { //borrado lógico
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if ( !deletedUser ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        return res.json({
            ok: true,
            user: deletedUser
        });
    });


});


module.exports = app;