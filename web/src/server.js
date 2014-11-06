// server.js

// set up ======================================================================
// get all the tools we need
var port = process.env.PORT || 8080;

var https = require('https');
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var autolinker = require('autolinker');

var util = require('util');

var morgan = require('morgan');

// configuration ===============================================================
var sslConfig = require('./ssl-config');
var dbConfig = require('./config/database.js');
var httpsOptions = {
	key: sslConfig.privateKey,
	cert: sslConfig.certificate,
    requestCert: false,
    rejectUnauthorized: false
};
//'mongoose'.connect(dbConfig.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

var moment = require('moment');
moment.locale('pt-BR');
app.locals.moment = moment;

app.locals.autolinker = autolinker;

app.locals.util = util;

// Security
app.disable('x-powered-by');
app.use(helmet());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
// i18n
var i18n = require("i18next");
i18n.init({ lng: "pt-BR", resGetPath: './locales/__ns__-__lng__.json' });
i18n.registerAppHelper(app);
app.use(i18n.handle);

// required for passport
app.use(session({ secret: 'mysecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch =====================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//return https.createServer(httpsOptions, app).listen(app.get('port'), function() {
//return https.createServer(httpsOptions, app).listen(port, function() {
//	//var baseUrl = 'https://' + app.get('host') + ':' + app.get('port');
//	var baseUrl = 'https://' + 'localhost' + ':' + port;
//	app.emit('started', baseUrl);
//	console.log('The magic happens on %s%s', baseUrl, '/');
//});