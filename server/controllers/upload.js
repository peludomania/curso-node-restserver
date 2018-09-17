const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user')
// default options
app.use(fileUpload());


app.post('/upload/:tipo/:id', function(req, res) {
    if (!req.files ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }
    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];

    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipo permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length -1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensión no es válida. Las correctas son ' + extensionesValidas.join(', ')
            }
        });
    }

    //cambiamos el nombre al archivo
    let nuevoNombre = `${ id }-${ new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nuevoNombre }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        imagenUsuario(id, res, nuevoNombre);
    });
});

function imagenUsuario (id, res, nombreArchivo) {

    User.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        let pathImagen = path.resolve( __dirname + `../../upload/usuarios/${ usuarioDB.img }` );
        if (fs. existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
           res.json({
               ok: true,
               usuario: usuarioGuardado,
               img: nombreArchivo
           })
        });

    });

}

module.exports = app;