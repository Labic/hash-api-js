var p = require('../package.json');
var version = p.version.split('.').shift();

var isDevEnv = (process.env.NODE_ENV === 'development');

module.exports = {
  isDevEnv: isDevEnv,
  restApiRoot: '/v' + version,
  host: '0.0.0.0',
  port: 3000,
  remoting: {
    context: {
      enableHttpContext: false
    },
    rest: {
      normalizeHttpPath: false,
      xml: false
    },
    json: {
      strict: false,
      limit: '100kb'
    },
    urlencoded: {
      extended: true,
      limit: '100kb'
    },
    cors: false,
    errorHandler: {
      disableStackTrace: false
    }
  },
  legacyExplorer: false
};