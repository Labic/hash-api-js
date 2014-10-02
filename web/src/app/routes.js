var request = require('request');
var Parallel = require('node-parallel');

// app/routes.js
module.exports = function(app, passport) {
  // Handle 404
  app.use(function (err, req, res, next) {
    if (err.status !== 404)
      return next();

    res.status(404).render('404.jade', {title: '404: File Not Found'});
  });

  // Handle 500
  app.use(function (err, req, res, next) {
    if (err.status !== 500)
      return next();

    console.error(err.stack);
    res.status(500).render('500.jade', {title:'500: Internal Server Error', error: error});
  });
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//res.render('index', {title: 'App ENEM | Inep'});
    res.redirect('/twitter/secoes');
	});
	
	// =====================================
	// Twitter =============================
	// =====================================
	app.get('/twitter/secoes', function(req, res) {
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

    var tweetApiUrl = 'http://104.131.228.31:3000/api/Tweets?filter=';

    var urls = [
      { id: "humor", title: "Humor", uri: tweetApiUrl + JSON.stringify(filterHumor) },
      { id: "oficial", title: "Oficial", uri: tweetApiUrl + JSON.stringify(filterOficial) },
      { id: "orientacoes", title: "Orientações", uri: tweetApiUrl + JSON.stringify(filterOrientacoes) },
      { id: "logistica-infraestrutura", title: "Logistica & Infraestrutura", uri: tweetApiUrl + JSON.stringify(filterLogisticaInfraestrutura) },
      { id: "cobertura-midia", title: "Cobertura da Mídia", uri: tweetApiUrl + JSON.stringify(filterCoberturaMidia) },
      { id: "midia", title: "Mídia", uri: tweetApiUrl + JSON.stringify(filterMidia) },
      { id: "questoes-pedagogicas", title: "Questões Pedagógicas", uri: tweetApiUrl + JSON.stringify(filterQuestoesPedagogicas) },
      { id: "educacional", title: "Educacional", uri: tweetApiUrl + JSON.stringify(filterEducacional) },
      { id: "sentimentos", title: "Sentimentos", uri: tweetApiUrl + JSON.stringify(filterSentimentos) },
      { id: "rumores", title: "Rumores", uri: tweetApiUrl + JSON.stringify(filterRumores) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(5000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
	});


  app.get('/twitter/estados', function(req, res) {
    var filterRioGrandeDoSul = {
      "where": {
        "categories": {"inq": ["Rio Grande do Sul"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRioGrandeDoNorte = {
      "where": {
        "categories": {"inq": ["Rio Grande do Norte"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterParana = {
      "where": {
        "categories": {"inq": ["Parana"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterEspiritoSanto = {
      "where": {
        "categories": {"inq": ["Espirito Santo"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterSaoPaulo = {
      "where": {
        "categories": {"inq": ["Sao Paulo"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterPara = {
      "where": {
        "categories": {"inq": ["Para"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var tweetApiUrl = 'http://104.131.228.31:3000/api/Tweets?filter=';

    var urls = [
      { id: "rs", title: "Rio Grande do Sul", uri: tweetApiUrl + JSON.stringify(filterRioGrandeDoSul) },
      { id: "rn", title: "Rio Grande do Norte", uri: tweetApiUrl + JSON.stringify(filterRioGrandeDoNorte) },
      { id: "pr", title: "Paraná", uri: tweetApiUrl + JSON.stringify(filterParana) },
      { id: "es", title: "Espírito Santo", uri: tweetApiUrl + JSON.stringify(filterEspiritoSanto) },
      { id: "sp", title: "São Paulo", uri: tweetApiUrl + JSON.stringify(filterSaoPaulo) },
      { id: "pa", title: "Pará", uri: tweetApiUrl + JSON.stringify(filterPara) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(5000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });
  
  // =====================================
  // Twitter Gráficos ====================
  // =====================================
  // show the login form
  app.get('/twitter/graficos', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('twitter-graficos', { route: req.route, title: 'Gráficos do Twitter - App ENEM | Inep' }); 
  });
  
  // =====================================
  // Facebook Gráficos ===================
  // =====================================
  // show the login form
  app.get('/facebook/graficos', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('facebook-graficos', { route: req.route, title: 'Gráficos do Facebooks - App ENEM | Inep' }); 
  });
  
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { route: req.route, message: req.flash('loginMessage') }); 
  });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function (req, res) {
		
		// render the page and pass in any flash data if it exists
		res.render('signup', { route: req.route, message: req.flash('signupMessage') });
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
      route: req.route, 
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