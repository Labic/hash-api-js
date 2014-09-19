// config/auth.js
// TODO: Make app domain dynamic
// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1470450163242397', // your App ID
		'clientSecret' 	: 'e1e0465a113fe1281660a31c716a3157', // your App Secret
		'callbackURL' 	: 'http://app-enem.dev.inep.gov.br:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'EqjtdUeooUB9a2w9F0AN1jG0v',
		'consumerSecret' 	: 'eravWvAwtyMkwSEeVKU5V9N8axthvTK8Cf9kO43zdc7tcfErCz',
		'callbackURL' 		: 'http://app-enem.dev.inep.gov.br:3000/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://app-enem.dev.inep.gov.br:3000/auth/google/callback'
	}

};