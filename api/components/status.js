module.exports = (app, options) => {
  const router = app.loopback.Router();
  router.get(options.mountPath, app.loopback.status());
  app.use(router);
}