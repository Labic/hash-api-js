module.exports = function(server) {
  // Install a `/` route that returns server status
};

module.exports = (app, options) => {
  var router = app.loopback.Router();
  router.get(options.path, app.loopback.status());
  app.use(router);
}