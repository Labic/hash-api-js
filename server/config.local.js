var p = require('../package.json'),
    version = p.version.split('.').shift();

module.exports = {
  isDevEnv: (process.env.NODE_ENV === 'development'),
  restApiRoot: '/v' + version,
  host: '0.0.0.0',
  port: 3000,
  remoting: {
    context: {
      enableHttpContext: false
    },
    rest: {
      normalizeHttpPath: false,
      xml: false,
      supportedTypes: [
        'application/json', 
        'application/javascript', 
        'application/xml', 
        'text/javascript', 
        'text/xml', 
        'json', 
        'xml'
      ]
    },
    json: {
      strict: false,
      limit: '100kb'
    },
    urlencoded: {
      extended: true,
      limit: '100kb'
    },
    cors: {
      origin: true,
      credentials: true
    },
    errorHandler: {
      disableStackTrace: false
    }
  },
  livereload: process.env.LIVE_RELOAD || false,
  legacyExplorer: process.env.LEGACY_EXPLORER || false
};