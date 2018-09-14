const jwt = require('jsonwebtoken');

/**
 *  Verificar token
 *
 *  Esto hace una verificación del token, la clave está en el next, si no llamamos a esa función el código parará aquí
 */
let checkToken = ( req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify( token, process.env.SECRET_KEY, (err, decoded) => {
        if ( err ) {
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.user = decoded.usuario;
        next();
    });
};

let checkAdminRole = (req, res, next) => {

    let usuario = req.user;

    if ( 'ADMIN_ROLE' !== usuario.role ){
        return res.status(401).json({
            ok:false,
            err: {
                message: 'Role no autorizado'
            }
        });
    } else{
        next();
    }
};

module.exports = {
    checkToken,
    checkAdminRole
};