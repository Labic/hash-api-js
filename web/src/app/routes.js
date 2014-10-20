var request = require('request');
var Parallel = require('node-parallel');
var slug = require('slug');

var tweetApiUrl = 'http://104.131.228.31:3000/api/Tweets?filter=';
var facebookpiUrl = 'http://104.131.228.31:3000/api/FacebookPosts?filter=';

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
    res.redirect('/twitter/secoes/hits');
	});
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/hits', function(req, res) {
    var filterHumor = {
      "where": {
        "categories": {"inq": ["humor"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterEducacional = {
      "where": {
        "categories": {"inq": ["educacional"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterInstitucional = {
      "where": {
        "categories": {"inq": ["institucional"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "humor", title: "Humor", uri: tweetApiUrl + JSON.stringify(filterHumor) },
      { id: "educacional", title: "Educacional", uri: tweetApiUrl + JSON.stringify(filterEducacional) },
      { id: "institucional", title: "Institucional", uri: tweetApiUrl + JSON.stringify(filterInstitucional) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/publico-geral', function(req, res) {
    var filterOrientacoes = {
      "where": {
        "categories": {"inq": ["ORIENTACOES"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterQuestoesPedagogicas = {
      "where": {
        "categories": {"inq": ["QUESTOES_PEDAGOGICAS"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterInfraestruturaLogistica = {
      "where": {
        "categories": {"inq": ["INFRAESTRUTURA_E_LOGISTICA"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRumores = {
      "where": {
        "categories": {"inq": ["RUMORES"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterSentimentos = {
      "where": {
        "categories": {"inq": ["SENTIMENTOS"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "orientacoes", title: "Orientações", uri: tweetApiUrl + JSON.stringify(filterOrientacoes) },
      { id: "questoes-pedagogicas", title: "Questões Pedagógicas", uri: tweetApiUrl + JSON.stringify(filterQuestoesPedagogicas) },
      { id: "infraestrutura-logistica", title: "Infraestrutura & Logistica", uri: tweetApiUrl + JSON.stringify(filterInfraestruturaLogistica) },
      { id: "rumores", title: "Rumores", uri: tweetApiUrl + JSON.stringify(filterRumores) },
      { id: "sentimentos", title: "Sentimentos", uri: tweetApiUrl + JSON.stringify(filterSentimentos) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/midia', function(req, res) {
    var filterOficial = {
      "where": {
        "categories": {"inq": ["OFICIAL"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterCoberturaMidia = {
      "where": {
        "categories": {"inq": ["COBERTURA_DE_MIDIA"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterQuestoesPedagogicas = {
      "where": {
        "categories": {"inq": ["PEDAGOGICAS_QUESTOES"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterLogisticaInfraestrutura = {
      "where": {
        "categories": {"inq": ["LOGISTICA_E_INFRA"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "oficial", title: "Oficial", uri: tweetApiUrl + JSON.stringify(filterOficial) },
      { id: "cobertura-midia", title: "Cobertura de Mídia", uri: tweetApiUrl + JSON.stringify(filterCoberturaMidia) },
      { id: "questoes-pedagogicas", title: "Questões Pedagógicas", uri: tweetApiUrl + JSON.stringify(filterQuestoesPedagogicas) },
      { id: "logistica-infraestrutura", title: "Logistica & Infraestrutura", uri: tweetApiUrl + JSON.stringify(filterLogisticaInfraestrutura) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });


  app.get('/twitter/estados/sudeste', function(req, res) {
    var filterSP = {
      "where": {
        "categories": {"inq": ["Sao Paulo"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRJ = {
      "where": {
        "categories": {"inq": ["Rio de Janeiro"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterES = {
      "where": {
        "categories": {"inq": ["Espirito Santo"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterMG = {
      "where": {
        "categories": {"inq": ["Minas Gerais"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "sp", title: "São Paulo", uri: tweetApiUrl + JSON.stringify(filterSP) },
      { id: "rj", title: "Rio de Janeiro", uri: tweetApiUrl + JSON.stringify(filterRJ) },
      { id: "es", title: "Espírito Santo", uri: tweetApiUrl + JSON.stringify(filterES) },
      { id: "mg", title: "Minas Gerais", uri: tweetApiUrl + JSON.stringify(filterMG) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(1000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });
  

  app.get('/twitter/estados/sul', function(req, res) {
    // Sul
    var filterPR = {
      "where": {
        "categories": {"inq": ["Parana"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterSC = {
      "where": {
        "categories": {"inq": ["Santa Catarina"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRS = {
      "where": {
        "categories": {"inq": ["Rio Grande do Sul"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "pr", title: "Paraná", uri: tweetApiUrl + JSON.stringify(filterPR) },
      { id: "sc", title: "Santa Catarina", uri: tweetApiUrl + JSON.stringify(filterSC) },
      { id: "rs", title: "Rio Grande do Sul", uri: tweetApiUrl + JSON.stringify(filterRS) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });

  app.get('/twitter/estados/centro-oeste', function(req, res) {
    //Centro-Oeste  
    var filterBrasilia = {
      "where": {
        "categories": {"inq": ["Brasilia"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterMT = {
      "where": {
        "categories": {"inq": ["Mato Grosso"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRS = {
      "where": {
        "categories": {"inq": ["Mato Grosso do Sul"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterGO = {
      "where": {
        "categories": {"inq": ["Goias"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "brasilia", title: "Brasília", uri: tweetApiUrl + JSON.stringify(filterBrasilia) },
      { id: "mt", title: "Mato Grosso", uri: tweetApiUrl + JSON.stringify(filterMT) },
      { id: "rs", title: "Mato Grosso do Sul", uri: tweetApiUrl + JSON.stringify(filterRS) },
      { id: "go", title: "Goiás", uri: tweetApiUrl + JSON.stringify(filterGO) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });
  

  app.get('/twitter/estados/nordeste', function(req, res) {
    //Nordeste
    var filterMA = {
      "where": {
        "categories": {"inq": ["Maranhao"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterPI = {
      "where": {
        "categories": {"inq": ["Piaui"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterCE = {
      "where": {
        "categories": {"inq": ["Ceara"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRN = {
      "where": {
        "categories": {"inq": ["Rio Grande do Norte"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterPB = {
      "where": {
        "categories": {"inq": ["Paraiba"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterPE = {
      "where": {
        "categories": {"inq": ["Pernambuco"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterAL = {
      "where": {
        "categories": {"inq": ["Alagoas"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterSE = {
      "where": {
        "categories": {"inq": ["Sergipe"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterBA = {
      "where": {
        "categories": {"inq": ["Bahia"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "ma", title: "Maranhão", uri: tweetApiUrl + JSON.stringify(filterMA) },
      { id: "pi", title: "Piauí", uri: tweetApiUrl + JSON.stringify(filterPI) },
      { id: "ce", title: "Ceará", uri: tweetApiUrl + JSON.stringify(filterCE) },
      { id: "rn", title: "Rio Grande do Norte", uri: tweetApiUrl + JSON.stringify(filterRN) },
      { id: "pb", title: "Paraíba", uri: tweetApiUrl + JSON.stringify(filterPB) },
      { id: "pe", title: "Pernambuco", uri: tweetApiUrl + JSON.stringify(filterPE) },
      { id: "al", title: "Alagoas", uri: tweetApiUrl + JSON.stringify(filterAL) },
      { id: "se", title: "Sergipe", uri: tweetApiUrl + JSON.stringify(filterSE) },
      { id: "ba", title: "Bahia", uri: tweetApiUrl + JSON.stringify(filterBA) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });


app.get('/twitter/estados/norte', function(req, res) {
    // Norte
    var filterAM = {
      "where": {
        "categories": {"inq": ["Amazonas"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterAC = {
      "where": {
        "categories": {"inq": ["Acre"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRR = {
      "where": {
        "categories": {"inq": ["Roraima"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterRO = {
      "where": {
        "categories": {"inq": ["Rondonia"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterAP = {
      "where": {
        "categories": {"inq": ["Amapa"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterPA = {
      "where": {
        "categories": {"inq": ["Para"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var filterTO = {
      "where": {
        "categories": {"inq": ["Tocantins"]}}, 
        "order": "rts DESC", 
        "limit": 10
    };

    var urls = [
      { id: "am", title: "Amazonas", uri: tweetApiUrl + JSON.stringify(filterAM) },
      { id: "ac", title: "Acre", uri: tweetApiUrl + JSON.stringify(filterAC) },
      { id: "rr", title: "Roraima", uri: tweetApiUrl + JSON.stringify(filterRR) },
      { id: "ro", title: "Rondônia", uri: tweetApiUrl + JSON.stringify(filterRO) },
      { id: "ap", title: "Amapá", uri: tweetApiUrl + JSON.stringify(filterAP) },
      { id: "pa", title: "Pará", uri: tweetApiUrl + JSON.stringify(filterPA) },
      { id: "to", title: "Tocantins", uri: tweetApiUrl + JSON.stringify(filterTO) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.categorieId = url.id;
          res.body.categorieTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
  });


  app.get('/facebook/secoes', function(req, res) {
    var filterHumor = {
      "where": {
        "Section": {"inq": ["PERFIS DE HUMOR - Perfis"]}}, 
        "order": ["LikesCount DESC", "CommentsCount DESC"], 
        "limit": 10
    };
    
    var filterEducacional = {
      "where": {
        "Section": {"inq": ["PERFIS EDUCACIONAIS - Perfis"]}}, 
        "order": ["LikesCount DESC", "CommentsCount DESC"], 
        "limit": 10
    };
    
    var filterInstitucional = {
      "where": {
        "Section": {"inq": ["PERFIS INSTITUCIONAIS - Perfis"]}}, 
        "order": ["LikesCount DESC", "CommentsCount DESC"], 
        "limit": 10
    };
    
    var filterMidia = {
      "where": {
        "Section": {"inq": ["PERFIS DE MÍDIA - Perfis"]}}, 
        "order": ["LikesCount DESC", "CommentsCount DESC"], 
        "limit": 10
    };

    var urls = [
      { id: "humor", title: "Humor", uri: facebookpiUrl + JSON.stringify(filterHumor) },
      { id: "educacional", title: "Educacional", uri: facebookpiUrl + JSON.stringify(filterEducacional) },
      { id: "institucional", title: "Institucional", uri: facebookpiUrl + JSON.stringify(filterInstitucional) },
      { id: "midia", title: "Mídia", uri: facebookpiUrl + JSON.stringify(filterMidia) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.sectionId = url.id;
          res.body.sectionTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, facebookSectionsQuery) {
      res.render('facebook', { route: req.route, title: 'Facebook por Seções - App ENEM | Inep', facebookSections: facebookSectionsQuery });
    });
  });
  
  // =====================================
  // Twitter Gráficos ====================
  // =====================================
  // show the login form
  app.get('/twitter/estatisticas', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('twitter-estatisticas', { route: req.route, title: 'Gráficos do Twitter - App ENEM | Inep' }); 
  });
  
  // =====================================
  // Facebook Gráficos ===================
  // =====================================
  // show the login form
  app.get('/facebook/estatisticas', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('facebook-estatisticas', { route: req.route, title: 'Gráficos do Facebook - App ENEM | Inep' }); 
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