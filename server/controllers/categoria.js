
const express = require('express');

let { checkToken, checkAdminRole } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');


app.get('/categorias', checkToken, (req, res) => {

    Categoria.find({})
        .sort('description')
        .populate('user')
        .exec( (err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, count) => {
                res.json({
                    ok:true,
                    categorias,
                    count
                });
            });

        });
});


app.get('/categoria/:id', checkToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id)
        .exec( (err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                categoria
            });

        });
});

/**
 * Crear nueva categoria
 */
app.post('/categoria',  checkToken, (req, res) => {
    let body = req.body;
    let userId = req.user._id;

    let categoria = new Categoria({
        description: body.description,
        usuario: userId
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * Actualizar categoria
 */
app.put('/categoria/:id', checkToken,(req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * Borrado fisico de una categoria
 */
app.delete('/categoria/:id', [ checkToken, checkAdminRole],(req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria: deletedCategory
        });
    });
});

module.exports = app;