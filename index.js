const express = require('express');
const routes = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importa las variables
require('dotenv').config({ path: 'variables.env' });

//helpers
const helpers = require('./helpers');

//Crear la conexion a la base de datos
const db = require('./config/db');

//importar el modelo
require('./models/Usuarios');
require('./models/Proyectos');
require('./models/Tareas');

db.sync()
  .then(() => console.log('Conectado al servidor'))
  .catch((error) => console.log(error));

const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Habilitar bodyParser

app.use(express.urlencoded({ extended: true }));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flas messages
app.use(flash());

app.use(cookieParser());

//sesiones nos permite navegar entre diferentes paginas sin volverno a autenticar
app.use(
  session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicacion
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;

  next();
});

app.use('/', routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log('El servidor esta funcionando');
});
