/**
 * UNICORN BACK-END GLOBAL GUIDELINE
 * -------------------
 *
 * GENERAL SPECIFICATIONS :
 * ---------
 * The whole system is built on the socket system.
 * Every calls from the front-end after the user loaded the page will be done
 * From socket calls which have access to all the tools pre-defined by the system.
 * You will mainly write code in the `/sockets/` and `/processes/` folders.
 *
 * APP INITIALIZATION :
 * ---------
 * The system will load the basic services provided by Express.
 * First of all the `helpers` ($h) are loaded followed
 * By the `starters` which are initializers of database and socket service (will open the connection).
 * It's quickly followed by the `after_starters` which is
 * A simple library processing some code depending on the `starters` (database update, etc.)
 *
 * PAGE LOAD :
 * ---------
 * When an user shows up, the whole system initialize again the `helpers`
 * Followed by the `services` and the `workers` which are dependents of each others.
 * Afterwards, you can access those libraries from every `*_socket.js` and `*_process.js` file.
 * The user start to handle the sockets calls afterwards.
 *
 * STRUCTURE EXPLANATION :
 * ---------
 * controllers /
 *   app_controller.js -> the only controller we user will be redirected on via HTTP
 *   
 * helpers /
 *   any(s).js -> the basic helpers of the project, the name must be plural
 *   
 * models /
 *   Any.js -> the MongoDB schemas which will be loaded by Mongoose (maj + singular)
 *   
 * processes /
 *   any_process.js -> the complex processes called from the socket controllers when it's to heavy
 *   
 * services /
 *   any(s).js -> the libraries that need req, res to work (such as sessions or cookies, must be plural)
 *   sockets.js -> there is also `sockets.js` which will be basically the link between front-end / back-end
 *   
 * sockets /
 *   any_socket.js -> the socket controllers containing the methods that will be called from the front-end socket system
 *   validations.js -> the back-end socket validation system, it's a big object which controls all the front-end calls, if there's no validation for a specific call, it output a WARNING and accept it automatically
 *   
 * starters /
 *   any.js -> the services that must be initialized on server start (not page load)
 *   after_starters.js -> the module that will be called after the `starters` are initialized, will use them to make some short processes (such as empty the users from the servers)
 *   
 * workers /
 *   any(s).js -> the libraries that need the `services` to work (such as socket control, socket sending, etc.)
 *
 * LIBRARIES :
 * ---------
 * $h -> `helpers` available from anywhere in the application
 *       they are small helpful methods not depending on any context, they can be dependants from each others
 *       
 * $s -> `services` available in every socket controllers and their children (`/processes/`)
 *       they are context dependants libraries which play with sessions, sockets and database calls, etc.
 *       
 * $w -> `workers` also vaiable in every socket controller and their children
 *       they are `services` dependants and got all the other libraries available to process
 *
 * SOCKET CONTROLLERS :
 * ---------
 * Every socket controller (`/sockets/*_socket.js`) got a `process` to stay lightweight
 * Each time the socket controller method get too big, you MUST put the business logic within its `process`
 *
 *
 * -------------------
 */

/**
 * Constants we will use through the app
 */
__ROOT__ = process.cwd();
__START__ = new Date();
__STORAGE__ = {};

/**
 * Basics services express need
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');

var routes = require('./routes/index');

var app = express();


/**
 * External handy libraries we will use everytime (global scope exception, BE CAREFUL about it, antipattern.)
 */
_ = require('underscore');

/**
 * We load all the helpers
 */
var $h = require(__ROOT__ + '/api/helpers');

/**
 * We load the starters (database and sockets)
 */
var starters = {

    database: require(__ROOT__+'/api/starters/db')(),
    sockets: require(__ROOT__+ '/api/starters/sockets')()

}

/**
 * We load the after starters
 */
require(__ROOT__ + '/api/starters/post_starters')(starters);

/**
 * View engine
 */

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('53e323db2e35a688407fc416'));
app.use(session({

    secret: '53e323db2e35a688407fc416',
    maxAge  : new Date(Date.now() + 3600000 * $h.configs.system.session_expiration),
    expires : new Date(Date.now() + 3600000 * $h.configs.system.session_expiration),
    //cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true

}));

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Database / Sockets injection within req
 */
app.use(function(req, res, next) {

    $h.logs.info('We inject the database & sockets for the user ...');
    
    req.sockets = starters.sockets;
    req.database = starters.database;

    next();

});

app.use('/', routes);

/**
 * HTTP Error handling
 */
app.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);

});

/**
 * Development mode
 */
if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

}

/**
 * Production mode
 */
app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });

});


/**
 * Welcome display
 */
$h.logs.info('--------------------');
$h.logs.info('Unicorn (%s)', $h.configs.about.version);
$h.logs.info('-> Welcome aboard !');
$h.logs.info('-> Your app is ready to use.');
$h.logs.info('--------------------');

module.exports = app;

