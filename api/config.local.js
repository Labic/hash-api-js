var p = require('../package.json'),
    version = p.version.split('.').shift();

module.exports = {
  isDevEnv: (process.env.NODE_ENV === 'development'),
  restApiRoot: (process.env.REST_API_ROOT || '/v' + version),
  host: process.env.IP || '0.0.0.0',
  port: (process.env.PORT || 3000),
  remoting: {
    context: false,
    rest: {
      handleErrors: true,
      normalizeHttpPath: false,
      xml: false
    },
    json: {
      strict: false,
      limit: '3072kb'
    },
    urlencoded: {
      extended: true,
      limit: '80kb'
    },
    cors: false,
    errorHandler: {
      disableStackTrace: false
    }
  },
  livereload: process.env.LIVE_RELOAD || false,
  legacyExplorer: process.env.LEGACY_EXPLORER || false
};