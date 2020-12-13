const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en uptask',
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar Sesón en uptask',
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  //Leer los datos
  const { email, password } = req.body;

  try {
    await Usuarios.create({ email, password });

    //crear una url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    //crear el objeto de usuario
    const usuario = {
      email,
    };

    //enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo: 'confirmar-cuenta',
    });

    //redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');

    res.redirect('/iniciar-sesion');
  } catch (error) {
    req.flash(
      'error',
      error.errors.map((error) => error.message)
    );
    res.render('crearCuenta', {
      nombrePagina: 'Crear cuenta en uptask',
      mensajes: req.flash(),
      email,
      password,
    });
  }

  //crear el usuario
};

exports.formRestablecerPassword = (req, res) => {
  res.render('restablecer', {
    nombrePagina: 'Restablecer tu contraseña',
  });
};

//confirmar cuenta

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });

  //si no existe el usuario

  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada');
  res.redirect('/iniciar-sesion');
};
