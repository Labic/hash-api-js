
/*
 * GET home page.
 */

exports.authenticate = function(req, res){
	res.render('login', { title: 'Login - App ENEM 2014 | Inep' });
};