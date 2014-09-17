// Module dependencies
var express = require('express'),
	http = require('http'),
	path = require('path'),
	routes = require('./routes'),
	user = require('./routes/user')
	login = require('./routes/login');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.use(function(req, res, next) {
	res.status(404);
	if (req.accepts('html')) {
		res.render('404', { title: 'Página Não Encontrada - App ENEM 2014 | Inep' });
		return;
	}
});
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', login.authenticate);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
