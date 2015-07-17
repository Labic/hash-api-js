var isDevEnv = (process.env.NODE_ENV || 'development') === 'development';

var url = require('url');

var conf = {
  hostname: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3000,
  restApiRoot: process.env.REST_API_ROOT || '/api', // The path where to mount the REST API app
  legacyExplorer: process.env.LEGACY_EXPLORER || false
};

// The URL where the browser client can access the REST API is available.
// Replace with a full url (including hostname) if your client is being
// served from a different server than your REST API.
conf.restApiUrl = url.format({
  protocol: 'http',
  slashes: true,
  hostname: conf.hostname,
  port: conf.port,
  pathname: conf.restApiRoot
});

module.exports = {
  hostname: conf.hostname,
  restApiRoot: conf.restApiRoot,
  livereload: process.env.LIVE_RELOAD,
  isDevEnv: isDevEnv,
  // indexFile: require.resolve(isDevEnv ? '../client/ngapp/index.html' : '../client/dist/index.html'),
  port: conf.port,
  legacyExplorer: conf.legacyExplorer,
  remote: conf.restApiRoot
};