var moment = require('moment');
moment.locale('pt-BR');

var request = require('request');

// app/routes.js
module.exports = function(app, passport) {
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index', {title: 'App ENEM | Inep'});
	});
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/twitter', function(req, res) {
		
		var tweets = 
		[
			{
				text: "Universidade do Estado do Amapá abre cursinho preparatório para o Enem 2014 http://t.co/Gs4APS47SA",
				created_at: "Mon May 03 21:01:32 +0000 2010",
				user: {
					utc_offset: -10800,
					profile_image_url: "https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png"
				}
			},
			{
				text: "Universidade do Estado do Amapá abre cursinho preparatório para o Enem 2014 http://t.co/Gs4APS47SA",
				created_at: "Mon May 03 21:01:32 +0000 2010",
				user: {
					utc_offset: -10800,
					profile_image_url: "https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png"
				}
			},
			{
				text: "Universidade do Estado do Amapá abre cursinho preparatório para o Enem 2014 http://t.co/Gs4APS47SA",
				created_at: "Mon May 03 21:01:32 +0000 2010",
				user: {
					utc_offset: -10800,
					profile_image_url: "https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png"
				}
			},
			{
				text: "Universidade do Estado do Amapá abre cursinho preparatório para o Enem 2014 http://t.co/Gs4APS47SA",
				created_at: "Mon May 03 21:01:32 +0000 2010",
				user: {
					utc_offset: -10800,
					profile_image_url: "https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png"
				}
			}
		];
		
		res.render('twitter', {title: 'Twitter - App ENEM | Inep', tweets: tweets});
	});
	
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') }); 
	});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		
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