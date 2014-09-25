var request = require('request');
var Parallel = require('node-parallel')

// app/routes.js
module.exports = function(app, passport) {
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index', {title: 'App ENEM | Inep'});
	});
	
	// =====================================
	// Twitter =============================
	// =====================================
	app.get('/twitter', function(req, res) {
    var filterHumor = {
      "where": {
        "categories": {"inq": ["humor"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterOficial = {
      "where": {
        "categories": {"inq": ["OFICIAL"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterInstitucional = {
      "where": {
        "categories": {"inq": ["institucional"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterOrientacoes = {
      "where": {
        "categories": {"inq": ["ORIENTACOES"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterLogisticaInfraestrutura = {
      "where": {
        "categories": {"inq": ["LOGISTICA_E_INFRA", "INFRAESTRUTURA_E_LOGISTICA"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterCoberturaMidia = {
      "where": {
        "categories": {"inq": ["COBERTURA_DE_MIDIA"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterMidia = {
      "where": {
        "categories": {"inq": ["midia"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterQuestoesPedagogicas = {
      "where": {
        "categories": {"inq": ["QUESTOES_PEDAGOGICAS"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterEducacional = {
      "where": {
        "categories": {"inq": ["educacional"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterSentimentos = {
      "where": {
        "categories": {"inq": ["SENTIMENTOS"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRumores = {
      "where": {
        "categories": {"inq": ["RUMORES"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var tweetApiUrl = 'http://app-enem.dev.inep.gov.br:3000/api/Tweets?filter=';

    var urls = [
      tweetApiUrl + JSON.stringify(filterHumor),
      tweetApiUrl + JSON.stringify(filterOficial),
      tweetApiUrl + JSON.stringify(filterInstitucional),
      tweetApiUrl + JSON.stringify(filterOrientacoes),
      tweetApiUrl + JSON.stringify(filterLogisticaInfraestrutura),
      tweetApiUrl + JSON.stringify(filterMidia),
      tweetApiUrl + JSON.stringify(filterQuestoesPedagogicas),
      tweetApiUrl + JSON.stringify(filterEducacional),
      tweetApiUrl + JSON.stringify(filterSentimentos),
      tweetApiUrl + JSON.stringify(filterRumores)
    ];

    var parallel = new Parallel();
    parallel.timeout(5000);

    urls.forEach(function (url) {
      parallel.add(function (done) {
        request.get({url: url, json: true}, function(err, res) {
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweets) {
      res.render('twitter', {title: 'Twitter - App ENEM | Inep', tweets: tweets});
    });
	});
  
  // =====================================
  // Twitter Gráficos ====================
  // =====================================
  // show the login form
  app.get('/twitter/graficos', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('twitter-graficos', { title: 'Gráficos do Twitter - App ENEM | Inep' }); 
  });
  
  // =====================================
  // Facebook Gráficos ===================
  // =====================================
  // show the login form
  app.get('/facebook/graficos', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('facebook-graficos', { title: 'Gráficos do Facebooks - App ENEM | Inep' }); 
  });
  
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') }); 
  });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function (req, res) {
		
		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));
	
	// =====================================
	// TWITTER ROUTES ======================
	// =====================================
	// route for twitter authentication and login
	app.get('/auth/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}