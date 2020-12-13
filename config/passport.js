const passport = require('passport');
const LocalStrategy = require('passport-local');

//Referencia al modelo
const Usuarios = require('../models/Usuarios');

//local stategy - login con credenciales propias

passport.use(
  new LocalStrategy(
    //por default passport espera un usuario y password
    {
      usernameField: 'email', //como este en el modelo
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });

        //el usuario existe, pero password incorrecto

        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto',
          });
        }

        //el email existe y el password es correcto
        return done(null, usuario);
      } catch (error) {
        //ese usuario no existe
        return done(null, false, {
          message: 'Esa cuenta no existe',
        });
      }
    }
  )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
