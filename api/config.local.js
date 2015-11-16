var p = require('../package.json'),
    version = p.version.split('.').shift();

module.exports = {
  isDevEnv: (process.env.NODE_ENV === 'development'),
  restApiRoot: (process.env.REST_API_ROOT || '/v' + version),
  host: process.env.IP || '0.0.0.0',
  port: (process.env.PORT || 3000),
  cookieSecret: (process.env.COOKIE_SECRET || 'F1FEE670-3C72-11E4-916C-0800200C9A66'),
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
        'text/javascript', 
        'json' 
      ]
    },
    json: {
      strict: false,
      limit: '100kb'
    },
    urlencoded: {
      extended: true,
      limit: '50kb'
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