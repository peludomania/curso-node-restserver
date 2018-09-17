const express = require('express');

let { checkToken } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');


/**
 * Obtener todos los productos
 */
app.get('/productos' , (req, res) => {
    Producto.find({ disponible: true})
        .sort('nombre')
        .populate('categoria','description')// populate hace una relación con otra tabla, y trae toda la información de esta
        .exec( (err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true}, (err, count) => {
                res.json({
                    ok:true,
                    productos,
                    count
                });
            });

        });
});

app.get('/producto/:id', checkToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .exec( (err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                producto
            });

        });
});

/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', checkToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria','description')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos: productos
            });
        });

});

app.post('/producto', checkToken, (req, res) => {
    let body = req.body;
    let userId = req.user._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        user: userId
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

/**
 * Actualizar producto
 */
app.put('/producto/:id', checkToken,(req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});


/**
 * Borrado logico de un producto
 */
app.delete('/producto/:id', [ checkToken],(req, res) => {
    let id = req.params.id;

    let body = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, deletedProducto) => { //borrado lógico
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if ( !deletedProducto ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        return res.json({
            ok: true,
            producto: deletedProducto
        });
    });

});


module.exports = app;